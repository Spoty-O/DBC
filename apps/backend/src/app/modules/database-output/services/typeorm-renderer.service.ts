import { Injectable } from '@nestjs/common';
import type {
  DatabaseField,
  DatabaseSchema,
  DatabaseTable,
} from '../../schema-generator/schemas/database-schema.type';
import { assertSafeSchemaIdentifier } from '../utils/pg-identifier.util';
import { camelCaseFromSnake, pascalCaseFromSnake } from '../utils/entity-naming.util';
import { topologicalTableOrder } from '../utils/topological-tables.util';
import { typeOrmColumnOptions } from '../utils/typeorm-column-options.util';

type IncomingFk = {
  fromTable: string;
  fieldName: string;
  referencedField: string;
  nullable: boolean;
};

const TYPEORM_IMPORTS = `import {
  Entity,
  Column,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
`;

@Injectable()
export class TypeOrmRendererService {
  render(schema: DatabaseSchema): { code: string; warnings: string[] } {
    const warnings: string[] = [];
    const tableByName = new Map(schema.tables.map((t) => [t.name, t]));
    for (const t of schema.tables) {
      assertSafeSchemaIdentifier(t.name, 'table');
      for (const f of t.fields) {
        assertSafeSchemaIdentifier(f.name, 'column');
      }
    }

    const { warnings: topoWarnings } = topologicalTableOrder(schema);
    warnings.push(...topoWarnings);

    const incoming = buildIncomingFkMap(schema, tableByName, warnings);
    const sortedTables = [...schema.tables].sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    const blocks: string[] = [];
    for (const table of sortedTables) {
      blocks.push(
        buildEntityClass(table, tableByName, incoming.get(table.name) ?? [], warnings),
      );
    }

    return { code: `${TYPEORM_IMPORTS}\n${blocks.join('\n\n')}`, warnings };
  }
}

function buildIncomingFkMap(
  schema: DatabaseSchema,
  tableByName: Map<string, DatabaseTable>,
  warnings: string[],
): Map<string, IncomingFk[]> {
  const incoming = new Map<string, IncomingFk[]>();
  for (const table of schema.tables) {
    for (const field of table.fields) {
      if (!field.references) {
        continue;
      }
      const refTable = field.references.table;
      const refField = field.references.field;
      if (!tableByName.has(refTable)) {
        warnings.push(
          `TypeORM: cannot relate ${table.name}.${field.name} — missing table "${refTable}".`,
        );
        continue;
      }
      const refT = tableByName.get(refTable)!;
      const hasCol = refT.fields.some((f) => f.name === refField);
      if (!hasCol) {
        warnings.push(
          `TypeORM: cannot relate ${table.name}.${field.name} — referenced column "${refTable}.${refField}" not found.`,
        );
        continue;
      }
      const list = incoming.get(refTable) ?? [];
      list.push({
        fromTable: table.name,
        fieldName: field.name,
        referencedField: refField,
        nullable: field.nullable,
      });
      incoming.set(refTable, list);
    }
  }
  for (const [, list] of incoming) {
    list.sort((a, b) => a.fromTable.localeCompare(b.fromTable));
  }
  return incoming;
}

function buildEntityClass(
  table: DatabaseTable,
  tableByName: Map<string, DatabaseTable>,
  incoming: IncomingFk[],
  warnings: string[],
): string {
  const className = pascalCaseFromSnake(table.name);
  const lines: string[] = [];
  lines.push(`@Entity('${table.name}')`);
  lines.push(`export class ${className} {`);

  for (const field of table.fields) {
    if (field.references) {
      const refTable = field.references.table;
      const refField = field.references.field;
      if (!tableByName.has(refTable)) {
        lines.push(
          `  // skipped relation: unknown table ${refTable} for ${field.name}`,
        );
        continue;
      }
      const refT = tableByName.get(refTable)!;
      if (!refT.fields.some((f) => f.name === refField)) {
        lines.push(
          `  // skipped relation: unknown column ${refTable}.${refField}`,
        );
        continue;
      }
      const refClass = pascalCaseFromSnake(refTable);
      const propName = relationPropertyName(field, refTable, warnings);
      const inverseOnParent = inverseCollectionProp(table.name, refTable, warnings);
      const parentVar = camelCaseFromSnake(refTable);
      lines.push(...buildFkScalarFieldLines(field));
      lines.push(`  @Index(['${field.name}'])`);
      lines.push(
        `  @ManyToOne(() => ${refClass}, (${parentVar}) => ${parentVar}.${inverseOnParent}, { nullable: ${field.nullable} })`,
      );
      lines.push(
        `  @JoinColumn({ name: '${field.name}', referencedColumnName: '${refField}' })`,
      );
      lines.push(`  ${propName}: ${refClass};`);
      lines.push('');
      continue;
    }

    lines.push(...buildScalarFieldLines(field));
  }

  for (const inc of incoming) {
    const childClass = pascalCaseFromSnake(inc.fromTable);
    const prop = inverseCollectionProp(inc.fromTable, table.name, warnings);
    const childField = tableByName.get(inc.fromTable)?.fields.find(
      (f) => f.name === inc.fieldName,
    );
    const childFkProp = childField
      ? relationPropertyName(childField, table.name, warnings)
      : camelCaseFromSnake(table.name);
    const childVar = camelCaseFromSnake(inc.fromTable);
    lines.push(
      `  @OneToMany(() => ${childClass}, (${childVar}) => ${childVar}.${childFkProp})`,
    );
    lines.push(`  ${prop}: ${childClass}[];`);
    lines.push('');
  }

  lines.push('}');
  return lines.join('\n');
}

function inverseCollectionProp(
  childTable: string,
  parentTable: string,
  warnings: string[],
): string {
  const base = camelCaseFromSnake(childTable) + 'Items';
  if (base === camelCaseFromSnake(parentTable)) {
    warnings.push(
      `TypeORM: ambiguous inverse collection name for ${childTable} on ${parentTable}; using suffixed name.`,
    );
    return `${base}Rel`;
  }
  return base;
}

function relationPropertyName(
  field: DatabaseField,
  refTable: string,
  warnings: string[],
): string {
  if (field.name.toLowerCase().endsWith('_id')) {
    return camelCaseFromSnake(field.name.slice(0, -3));
  }
  const guess = camelCaseFromSnake(refTable);
  warnings.push(
    `TypeORM: FK column "${field.name}" does not end with _id; relation property named "${guess}".`,
  );
  return guess;
}

function buildFkScalarFieldLines(field: DatabaseField): string[] {
  const lines: string[] = [];
  const opts = typeOrmColumnOptions(field.type);
  const prop = camelCaseFromSnake(field.name);
  lines.push(`  @Column(${opts})`);
  lines.push(`  ${prop}: ${tsPrimitiveForField(field)};`);
  lines.push('');
  return lines;
}

function buildScalarFieldLines(field: DatabaseField): string[] {
  const lines: string[] = [];
  const tsType = tsPrimitiveForField(field);
  const opts = typeOrmColumnOptions(field.type);
  if (field.primary && field.type === 'uuid') {
    lines.push(`  @PrimaryGeneratedColumn('uuid')`);
    lines.push(`  ${camelCaseFromSnake(field.name)}: ${tsType};`);
    lines.push('');
    return lines;
  }
  if (field.primary && field.type === 'integer') {
    lines.push(`  @PrimaryGeneratedColumn()`);
    lines.push(`  ${camelCaseFromSnake(field.name)}: ${tsType};`);
    lines.push('');
    return lines;
  }
  if (field.primary) {
    lines.push(`  @PrimaryColumn(${opts})`);
    lines.push(`  ${camelCaseFromSnake(field.name)}: ${tsType};`);
    lines.push('');
    return lines;
  }
  if (field.unique) {
    lines.push(`  @Unique(['${field.name}'])`);
  }
  lines.push(`  @Column(${opts})`);
  lines.push(`  ${camelCaseFromSnake(field.name)}: ${tsType};`);
  lines.push('');
  return lines;
}

function tsPrimitiveForField(field: DatabaseField): string {
  switch (field.type) {
    case 'boolean':
      return 'boolean';
    case 'integer':
    case 'number':
      return 'number';
    case 'date':
    case 'datetime':
      return 'Date';
    default:
      return 'string';
  }
}
