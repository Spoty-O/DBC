import { IFieldParser, ITableField } from 'src/shared/interfaces/nlp.interface';

export class AutoIncrementParser implements IFieldParser {
  readonly regexp = /autoIncrement/i;

  parse(text: string): Partial<ITableField> | null {
    const match = text.match(this.regexp);
    if (match) {
      return { autoIncrement: true };
    }
    return null;
  }
}
