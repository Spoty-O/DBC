import { ITableField } from './table.interface';

export interface IFieldParser {
  readonly regexp: RegExp;
  parse(text: string): Promise<Partial<ITableField> | null>;
}
