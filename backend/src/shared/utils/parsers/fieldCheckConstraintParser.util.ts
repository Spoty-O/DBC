import { IFieldParser, ITableField } from 'src/shared/interfaces/nlp.interface';

export class CheckConstraintParser implements IFieldParser {
  readonly regexp: RegExp = /(?<=check\s*=?\s*)\(([^)]+)\)/i;

  parse(text: string): Partial<ITableField> | null {
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
