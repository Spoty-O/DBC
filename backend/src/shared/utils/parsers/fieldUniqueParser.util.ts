import { IFieldParser, ITableField } from 'src/shared/interfaces/nlp.interface';

export class UniqueParser implements IFieldParser {
  readonly regexp = /unique/i;

  parse(text: string): Partial<ITableField> | null {
    const match = text.match(this.regexp);
    if (match) {
      return { unique: true };
    }
    return null;
  }
}
