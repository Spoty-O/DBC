import { IFieldParser, ITableField } from 'src/shared/interfaces/nlp.interface';

export class NullableParser implements IFieldParser {
  readonly regexp = /nullable/i;

  parse(text: string): Partial<ITableField> | null {
    const match = text.match(this.regexp);
    if (match) {
      return { nullable: true };
    }
    return null;
  }
}
