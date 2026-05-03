import type { DatabaseFieldType } from '../../schema-generator/schemas/database-schema.type';

export function prismaScalarAttrs(
  type: DatabaseFieldType,
  opts: { primary: boolean; unique: boolean },
): string {
  let base: string;
  switch (type) {
    case 'uuid':
      base = 'String';
      break;
    case 'string':
      base = 'String';
      break;
    case 'text':
      base = 'String @db.Text';
      break;
    case 'integer':
      base = 'Int';
      break;
    case 'number':
      base = 'Decimal @db.Decimal(18, 6)';
      break;
    case 'boolean':
      base = 'Boolean';
      break;
    case 'date':
      base = 'DateTime @db.Date';
      break;
    case 'datetime':
      base = 'DateTime';
      break;
    default: {
      const _e: never = type;
      return _e;
    }
  }
  const parts: string[] = [base];
  if (opts.primary) {
    parts.push('@id');
    if (type === 'uuid') {
      parts.push('@default(uuid())');
    } else if (type === 'integer') {
      parts.push('@default(autoincrement())');
    }
  }
  if (opts.unique && !opts.primary) {
    parts.push('@unique');
  }
  return parts.join(' ');
}
