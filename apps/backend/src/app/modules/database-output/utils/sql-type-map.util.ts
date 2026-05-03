import type { DatabaseFieldType } from '../../schema-generator/schemas/database-schema.type';

export function mapJsonFieldTypeToPostgresSql(
  t: DatabaseFieldType,
  opts: { primary: boolean; nullable: boolean },
): string {
  switch (t) {
    case 'uuid':
      return 'UUID';
    case 'string':
      return 'VARCHAR(255)';
    case 'text':
      return 'TEXT';
    case 'number':
      return 'NUMERIC';
    case 'integer':
      return opts.primary ? 'SERIAL' : 'INTEGER';
    case 'boolean':
      return 'BOOLEAN';
    case 'date':
      return 'DATE';
    case 'datetime':
      return 'TIMESTAMPTZ';
    default: {
      const _exhaustive: never = t;
      return _exhaustive;
    }
  }
}
