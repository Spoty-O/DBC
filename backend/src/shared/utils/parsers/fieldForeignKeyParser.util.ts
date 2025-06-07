import { IFieldParser, ITableField } from 'src/shared/interfaces';

export class ForeignKeyParser implements IFieldParser {
  readonly regexp =
    /(?<=foreign\s+key\s+references\s+)(\w+)\s*\(\s*(\w+)\s*\)/i;

  async parse(text: string): Promise<Partial<ITableField> | null> {
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
