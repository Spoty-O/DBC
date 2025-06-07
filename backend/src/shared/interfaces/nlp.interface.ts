import { IFieldParser } from './parser.util.interface';
import { ITableSchema } from './table.interface';

export interface INlpService {
  readonly fieldParsers: IFieldParser[];

  parseTemplateText(text: string): Promise<ITableSchema[]>;
}
