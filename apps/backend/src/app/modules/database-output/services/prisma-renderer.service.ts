import { Injectable } from '@nestjs/common';
import { UnsupportedOrmError } from '../errors/database-output.errors';
import type {
  DatabaseField,
  DatabaseSchema,
  DatabaseTable,
} from '../../schema-generator/schemas/database-schema.type';
import { assertSafeSchemaIdentifier } from '../utils/pg-identifier.util';
import { camelCaseFromSnake, pascalCaseFromSnake } from '../utils/entity-naming.util';
import { prismaScalarAttrs } from '../utils/prisma-field-type.util';
import { topologicalTableOrder } from '../utils/topological-tables.util';

const PRISMA_HEADER = `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

`;

@Injectable()
export class PrismaRendererService {
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

    const sorted = [...schema.tables].sort((a, b) => a.name.localeCompare(b.name));
    const models = sorted.map((t) =>
      buildModel(t, tableByName, schema, warnings),
    );

    return {
      code: `${PRISMA_HEADER}${models.join('\n\n')}\n`,
      warnings,
    };
  }
}

function buildModel(
  table: DatabaseTable,
  tableByName: Map<string, DatabaseTable>,
  schema: DatabaseSchema,
  warnings: string[],
): string {
  const modelName = pascalCaseFromSnake(table.name);
  const lines: string[] = [];
  lines.push(`model ${modelName} {`);

  const usedNames = new Set<string>();

  for (const field of table.fields) {
    if (field.references) {
      const refTable = field.references.table;
      const refField = field.references.field;
      if (!tableByName.has(refTable)) {
        warnings.push(
          `Prisma: skipping relation on ${table.name}.${field.name} — unknown table "${refTable}".`,
        );
        lines.push(
          `  // ${field.name}: relation dropped (missing table ${refTable})`,
        );
        continue;
      }
      const refT = tableByName.get(refTable)!;
      if (!refT.fields.some((f) => f.name === refField)) {
        warnings.push(
          `Prisma: skipping relation on ${table.name}.${field.name} — unknown column "${refTable}.${refField}".`,
        );
        continue;
      }
      const refModel = pascalCaseFromSnake(refTable);
      const scalarType = fkScalarPrismaType(field);
      const optional = field.nullable ? '?' : '';
      const relName = relationFieldName(field, refTable);
      reservePrismaFieldName(usedNames, field.name, modelName);
      reservePrismaFieldName(usedNames, relName, modelName);
      lines.push(`  ${field.name} ${scalarType}${optional}`);
      lines.push(
        `  ${relName} ${refModel} @relation(fields: [${field.name}], references: [${refField}])`,
      );
      lines.push('');
      continue;
    }

    reservePrismaFieldName(usedNames, field.name, modelName);
    lines.push(`  ${field.name} ${scalarLine(field)}`);
  }

  const incoming = collectIncoming(table.name, schema);
  for (const inc of incoming) {
    const childModel = pascalCaseFromSnake(inc.fromTable);
    const inv = inverseListProp(inc.fromTable);
    reservePrismaFieldName(usedNames, inv, modelName);
    lines.push(`  ${inv} ${childModel}[]`);
  }

  lines.push(`  @@map("${table.name}")`);
  lines.push('}');
  return lines.join('\n');
}

function collectIncoming(
  parentTable: string,
  schema: DatabaseSchema,
): { fromTable: string; fieldName: string }[] {
  const out: { fromTable: string; fieldName: string }[] = [];
  for (const t of schema.tables) {
    for (const f of t.fields) {
      if (f.references?.table === parentTable) {
        out.push({ fromTable: t.name, fieldName: f.name });
      }
    }
  }
  out.sort((a, b) => a.fromTable.localeCompare(b.fromTable));
  return out;
}

function inverseListProp(childTable: string): string {
  return `${camelCaseFromSnake(childTable)}List`;
}

function relationFieldName(field: DatabaseField, refTable: string): string {
  if (field.name.toLowerCase().endsWith('_id')) {
    return field.name.slice(0, -3);
  }
  return `${refTable}_rel`;
}

function fkScalarPrismaType(field: DatabaseField): string {
  switch (field.type) {
    case 'uuid':
      return 'String';
    case 'integer':
      return 'Int';
    case 'string':
    case 'text':
      return 'String';
    default:
      return 'String';
  }
}

function reservePrismaFieldName(
  used: Set<string>,
  name: string,
  modelName: string,
): void {
  if (used.has(name)) {
    throw new UnsupportedOrmError(
      `Prisma model "${modelName}" would declare the field "${name}" twice; simplify references or rename columns in the schema JSON.`,
      'prisma-duplicate-field',
    );
  }
  used.add(name);
}

function scalarLine(field: DatabaseField): string {
  const attrs = prismaScalarAttrs(field.type, {
    primary: field.primary,
    unique: field.unique,
  });
  if (!field.nullable || field.primary) {
    return attrs;
  }
  const idx = attrs.indexOf(' ');
  const first = idx === -1 ? attrs : attrs.slice(0, idx);
  const rest = idx === -1 ? '' : attrs.slice(idx + 1);
  return rest ? `${first}? ${rest}` : `${first}?`;
}
