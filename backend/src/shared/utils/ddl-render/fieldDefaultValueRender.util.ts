import { IRenderUtil, ITableField } from 'src/shared/interfaces';

export class DefaultValueRender implements IRenderUtil {
  async render(field: ITableField): Promise<string | null> {
    if (field.defaultValue) {
      return `DEFAULT ${field.defaultValue}`;
    }
    return null;
  }
}
