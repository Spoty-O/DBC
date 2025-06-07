import { IRenderUtil, ITableField } from 'src/shared/interfaces';

export class NullableRender implements IRenderUtil {
  async render(field: ITableField): Promise<string | null> {
    if (field.nullable) {
      return null;
    }
    return `NOT NULL`;
  }
}
