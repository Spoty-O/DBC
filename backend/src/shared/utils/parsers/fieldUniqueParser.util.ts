import { IFieldParser, ITableField } from 'src/shared/interfaces';

export class UniqueParser implements IFieldParser {
  readonly regexp = /unique/i;

  async parse(text: string): Promise<Partial<ITableField> | null> {
    const match = text.match(this.regexp);
    if (match) {
      return { unique: true };
    }
    return { unique: false };
  }
}
