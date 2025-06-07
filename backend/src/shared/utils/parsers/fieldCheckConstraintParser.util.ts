import { IFieldParser, ITableField } from 'src/shared/interfaces';

export class CheckConstraintParser implements IFieldParser {
  readonly regexp: RegExp = /(?<=check\s*=?\s*)\(([^)]+)\)/i;

  async parse(text: string): Promise<Partial<ITableField> | null> {
    const match = text.match(this.regexp);
    if (!match) {
      return null;
    }

    const checkConstraint = match[0].trim();
    return {
      check: checkConstraint,
    };
  }
}
