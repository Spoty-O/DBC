import { IFieldParser, ITableField } from 'src/shared/interfaces';

export class DefaultValueParser implements IFieldParser {
  readonly regexp =
    /(?<=default\s*=?\s*)(-?\d+(\.\d+)?|'[^']*'|"[^"]*"|\btrue\b|\bfalse\b|\bnull\b)/i;

  async parse(text: string): Promise<Partial<ITableField> | null> {
    const match = text.match(this.regexp);
    if (!match) return null;
    const textWithoutQuotes = match[0].replace(/^["']|["']$/g, '');
    const lowerText = textWithoutQuotes.toLowerCase();

    if (lowerText === 'true') return { defaultValue: `TRUE` };
    if (lowerText === 'false') return { defaultValue: `FALSE` };
    if (lowerText === 'null') return { defaultValue: `NULL` };
    if (!isNaN(Number(lowerText))) return { defaultValue: Number(lowerText) };
    return { defaultValue: `'${textWithoutQuotes}'` };
  }
}
