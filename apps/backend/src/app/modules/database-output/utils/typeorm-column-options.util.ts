import type { DatabaseFieldType } from '../../schema-generator/schemas/database-schema.type';

export function typeOrmColumnOptions(type: DatabaseFieldType): string {
  switch (type) {
    case 'uuid':
      return `{ type: 'uuid' }`;
    case 'string':
      return `{ type: 'varchar', length: 255 }`;
    case 'text':
      return `{ type: 'text' }`;
    case 'number':
      return `{ type: 'decimal', precision: 18, scale: 6 }`;
    case 'integer':
      return `{ type: 'int' }`;
    case 'boolean':
      return `{ type: 'bool' }`;
    case 'date':
      return `{ type: 'date' }`;
    case 'datetime':
      return `{ type: 'timestamptz' }`;
    default: {
      const _e: never = type;
      return _e;
    }
  }
}
