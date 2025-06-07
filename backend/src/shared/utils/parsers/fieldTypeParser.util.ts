import { IFieldParser, ITableField } from 'src/shared/interfaces';

export class TypeParser implements IFieldParser {
  readonly types = [
    'int',
    'integer',
    'smallint',
    'bigint',
    'decimal',
    'numeric',
    'real',
    'double precision',
    'float',
    'boolean',
    'bool',
    'char',
    'varchar',
    'text',
    'date',
    'time',
    'timestamp',
    'uuid',
    'json',
    'jsonb',
  ];

  private readonly pattern = this.types
    .map((type) => type.trim().replace(/\s+/gi, '\\s+'))
    .join('|');

  readonly regexp = new RegExp(`(?<=type\\s*)(${this.pattern})`, 'i');

  async parse(text: string): Promise<Partial<ITableField> | null> {
    const match = text.match(this.regexp);
    if (match) {
      return { type: match[0].trim() };
    }
    return { type: 'varchar(255)' };
  }
}
