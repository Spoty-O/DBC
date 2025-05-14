import { IFieldParser, ITableField } from 'src/shared/interfaces/nlp.interface';

export class DefaultValueParser implements IFieldParser {
  readonly regexp =
    /(?<=default\s*=?\s*)(-?\d+(\.\d+)?|'[^']*'|"[^"]*"|\btrue\b|\bfalse\b|\bnull\b)/i;

  parse(text: string): Partial<ITableField> | null {
    const match = text.match(this.regexp);
    if (!match) return null;
    const textWithoutQuotes = match[0].replace(/^["']|["']$/g, '');
    const lowerText = textWithoutQuotes.toLowerCase();

    if (lowerText === 'true') return { defaultValue: true };
    if (lowerText === 'false') return { defaultValue: false };
    if (lowerText === 'null') return { defaultValue: null };
    if (!isNaN(Number(lowerText))) return { defaultValue: Number(lowerText) };
    return { defaultValue: textWithoutQuotes };
  }
}
