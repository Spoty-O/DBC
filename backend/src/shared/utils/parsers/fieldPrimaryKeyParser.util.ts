import { IFieldParser, ITableField } from 'src/shared/interfaces/nlp.interface';

export class PrimaryKeyParser implements IFieldParser {
  readonly regexp = /primary\s*(key)?/i;

  parse(text: string): Partial<ITableField> | null {
    const match = text.match(this.regexp);
    if (match) {
      return { primaryKey: true };
    }
    return null;
  }
}
