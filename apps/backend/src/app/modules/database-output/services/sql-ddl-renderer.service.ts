import { Injectable } from '@nestjs/common';
import type {
  DatabaseField,
  DatabaseSchema,
  DatabaseTable,
} from '../../schema-generator/schemas/database-schema.type';
import {
  assertSafeSchemaIdentifier,
  escapePgIdentifier,
} from '../utils/pg-identifier.util';
import { mapJsonFieldTypeToPostgresSql } from '../utils/sql-type-map.util';
import { topologicalTableOrder } from '../utils/topological-tables.util';

@Injectable()
export class SqlDdlRendererService {
  render(schema: DatabaseSchema): { sql: string; warnings: string[] } {
    const warnings: string[] = [];
    const tableByName = new Map(schema.tables.map((t) => [t.name, t]));
    for (const t of schema.tables) {
      assertSafeSchemaIdentifier(t.name, 'table');
      for (const f of t.fields) {
        assertSafeSchemaIdentifier(f.name, 'column');
      }
    }

    const { order, warnings: topoWarnings } = topologicalTableOrder(schema);
    warnings.push(...topoWarnings);

    const statements: string[] = [];

    for (const tableName of order) {
      const table = tableByName.get(tableName);
      if (!table) {
        continue;
      }
      const { ddl, indexes, tableWarnings } = buildTableDdl(table, tableByName);
      warnings.push(...tableWarnings);
      statements.push(ddl);
      statements.push(...indexes);
    }

    const sql = statements.join('\n\n');
    return { sql: sql.trimEnd() + '\n', warnings };
  }
}

function buildTableDdl(
  table: DatabaseTable,
  tableByName: Map<string, DatabaseTable>,
): { ddl: string; indexes: string[]; tableWarnings: string[] } {
  const tableWarnings: string[] = [];
  const qTable = escapePgIdentifier(table.name);
  const colLines: string[] = [];
  const pkCols: string[] = [];

  for (const field of table.fields) {
    const qCol = escapePgIdentifier(field.name);
    const sqlType = mapJsonFieldTypeToPostgresSql(field.type, {
      primary: field.primary,
      nullable: field.nullable,
    });

    const segments: string[] = [`${qCol} ${sqlType}`];

    if (field.primary && field.type === 'uuid') {
      segments.push('DEFAULT gen_random_uuid()');
    }

    if (!field.nullable) {
      segments.push('NOT NULL');
    }

    if (field.unique && !field.primary) {
      segments.push('UNIQUE');
    }

    if (field.references) {
      const refTable = field.references.table;
      const refField = field.references.field;
      if (!tableByName.has(refTable)) {
        tableWarnings.push(
          `Skipping FK on ${table.name}.${field.name}: referenced table "${refTable}" not found.`,
        );
      } else {
        segments.push(
          `REFERENCES ${escapePgIdentifier(refTable)} (${escapePgIdentifier(
            refField,
          )})`,
        );
      }
    }

    if (field.primary) {
      pkCols.push(field.name);
    }

    colLines.push(segments.join(' '));
  }

  if (pkCols.length > 0) {
    const pkList = pkCols.map((c) => escapePgIdentifier(c)).join(', ');
    colLines.push(`PRIMARY KEY (${pkList})`);
  }

  const ddl = `CREATE TABLE ${qTable} (\n  ${colLines.join(',\n  ')}\n);`;

  const checks: string[] = [];
  for (const field of table.fields) {
    const expr = optionalIntegerNonNegativeCheck(field);
    if (expr) {
      const cname = sanitizeIndexName(`chk_${table.name}_${field.name}`);
      checks.push(
        `ALTER TABLE ${qTable} ADD CONSTRAINT ${escapePgIdentifier(
          cname,
        )} CHECK (${expr});`,
      );
    }
  }

  const indexes: string[] = [];
  for (const field of table.fields) {
    if (field.references && tableByName.has(field.references.table)) {
      const idxName = sanitizeIndexName(`idx_${table.name}_${field.name}`);
      indexes.push(
        `CREATE INDEX ${escapePgIdentifier(idxName)} ON ${qTable} (${escapePgIdentifier(
          field.name,
        )});`,
      );
    }
  }

  return { ddl, indexes: [...checks, ...indexes], tableWarnings };
}

/** Deterministic CHECK example: non-negative integers for `age`-named columns. */
function optionalIntegerNonNegativeCheck(field: DatabaseField): string | null {
  if (field.type !== 'integer') {
    return null;
  }
  if (field.name.toLowerCase() !== 'age') {
    return null;
  }
  return `${escapePgIdentifier(field.name)} >= 0`;
}

function sanitizeIndexName(name: string): string {
  return name.replace(/[^a-zA-Z0-9_]/g, '_');
}
