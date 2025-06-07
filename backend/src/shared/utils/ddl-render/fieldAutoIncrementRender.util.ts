import { IRenderUtil, ITableField } from 'src/shared/interfaces';

export class AutoIncrementRender implements IRenderUtil {
  async render(field: ITableField): Promise<string | null> {
    if (field.autoIncrement) {
      return `AUTO_INCREMENT`;
    }
    return null;
  }
}
