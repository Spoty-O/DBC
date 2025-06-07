import { IRenderUtil, ITableField } from 'src/shared/interfaces';

export class PrimaryKeyRender implements IRenderUtil {
  async render(field: ITableField): Promise<string | null> {
    if (field.primaryKey) {
      return `PRIMARY KEY (${field.name})`;
    }
    return null;
  }
}
