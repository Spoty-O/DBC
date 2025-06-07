import { IFieldParser, ITableField } from 'src/shared/interfaces';

export class FieldNameParser implements IFieldParser {
  readonly regexp: RegExp = /(?<=has\s*)\w+/i;

  async parse(text: string): Promise<Partial<ITableField> | null> {
    const match = text.match(this.regexp);
    if (match) {
      return { name: match[0] };
    }
    return null;
  }
}
