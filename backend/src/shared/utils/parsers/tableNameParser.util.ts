import { IFieldParser, ITableField } from 'src/shared/interfaces/nlp.interface';

export class TableNameParser implements IFieldParser {
  readonly regexp: RegExp = /^\w+(?=\s*has)/i;

  parse(text: string): Partial<ITableField> | null {
    const match = text.match(this.regexp);
    if (match) {
      return { name: match[0] };
    }
    return null;
  }
}
