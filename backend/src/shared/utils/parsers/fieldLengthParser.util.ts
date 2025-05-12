import { IFieldParser, ITableField } from 'src/shared/interfaces/nlp.interface';

export class LengthParser implements IFieldParser {
  readonly regexp: RegExp = /(?<=(length|len)\s*=?\s*)\d+/i;

  parse(text: string): Partial<ITableField> | null {
    const match = text.match(this.regexp);
    if (match) {
      return { length: parseInt(match[0], 10) };
    }
    return null;
  }
}
