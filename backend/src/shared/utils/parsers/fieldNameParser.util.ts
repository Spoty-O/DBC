import { IFieldParser, ITableField } from 'src/shared/interfaces/nlp.interface';

export class FieldNameParser implements IFieldParser {
  readonly regexp: RegExp = /(?<=has\s*)\w+/i;

  parse(text: string): Partial<ITableField> | null {
    const match = text.match(this.regexp);
    if (match) {
      return { name: match[0] };
    }
    return null;
  }
}
