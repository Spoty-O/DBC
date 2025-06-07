import { IRenderUtil } from './render.util.interface';
import { ITableSchema } from './table.interface';

export interface IRenderService {
  readonly utils: IRenderUtil[];
  renderTable(table: ITableSchema): Promise<string>;
  render(tables: ITableSchema[]): Promise<string>;
}
