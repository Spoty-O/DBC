import { ITableField } from './table.interface';

export interface IRenderUtil {
  render(field: ITableField): Promise<string | null>;
}
