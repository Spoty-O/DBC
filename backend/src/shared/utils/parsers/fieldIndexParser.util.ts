import { IFieldParser, ITableField } from 'src/shared/interfaces/nlp.interface';

export class IndexParser implements IFieldParser {
  readonly regexp = /index/i;

  parse(text: string): Partial<ITableField> | null {
    const match = text.match(this.regexp);
    if (match) {
      return { index: true };
    }
    return null;
  }
}
