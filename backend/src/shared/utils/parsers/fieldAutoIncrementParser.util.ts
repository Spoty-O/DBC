import { IFieldParser, ITableField } from 'src/shared/interfaces';

export class AutoIncrementParser implements IFieldParser {
  readonly regexp = /autoIncrement/i;

  async parse(text: string): Promise<Partial<ITableField> | null> {
    const match = text.match(this.regexp);
    if (match) {
      return { autoIncrement: true };
    }
    return { autoIncrement: false };
  }
}
