import { IFieldParser, ITableField } from 'src/shared/interfaces';

export class PrimaryKeyParser implements IFieldParser {
  readonly regexp = /primary\s*(key)?/i;

  async parse(text: string): Promise<Partial<ITableField> | null> {
    const match = text.match(this.regexp);
    if (match) {
      return { primaryKey: true };
    }
    return null;
  }
}
