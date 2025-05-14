import { IFieldParser, ITableField } from 'src/shared/interfaces/nlp.interface';

export class ForeignKeyParser implements IFieldParser {
  readonly regexp =
    /(?<=foreign\s+key\s+references\s+)(\w+)\s*\(\s*(\w+)\s*\)/i;

  parse(text: string): Partial<ITableField> | null {
    const match = text.match(this.regexp);

    if (!match) return null;

    const [, table, column] = match;
    return {
      foreignKey: {
        tableName: table!,
        columnName: column!,
      },
    };
  }
}
