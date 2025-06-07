import { IFieldParser, ITableField } from 'src/shared/interfaces';

export class NullableParser implements IFieldParser {
  readonly regexp = /not null/i;

  async parse(text: string): Promise<Partial<ITableField> | null> {
    const match = text.match(this.regexp);
    if (match) {
      return { nullable: false };
    }
    return { nullable: false };
  }
}
