import { IFieldParser, ITableField } from 'src/shared/interfaces';

export class TableNameParser implements IFieldParser {
  readonly regexp: RegExp = /^\w+(?=\s*has)/i;

  async parse(text: string): Promise<Partial<ITableField> | null> {
    const match = text.match(this.regexp);
    if (match) {
      return { name: match[0] };
    }
    return null;
  }
}
