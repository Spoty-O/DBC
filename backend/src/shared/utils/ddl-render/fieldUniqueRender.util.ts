import { IRenderUtil, ITableField } from 'src/shared/interfaces';

export class UniqueRender implements IRenderUtil {
  async render(field: ITableField): Promise<string | null> {
    if (field.unique) {
      return `UNIQUE`;
    }
    return null;
  }
}
