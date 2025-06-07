import { IFieldParser, ITableField } from 'src/shared/interfaces';

export class IndexParser implements IFieldParser {
  readonly regexp = /index/i;

  async parse(text: string): Promise<Partial<ITableField> | null> {
    const match = text.match(this.regexp);
    if (match) {
      return { index: true };
    }
    return { index: false };
  }
}
