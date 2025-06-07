import { IRenderUtil, ITableField } from 'src/shared/interfaces';

export class CheckConstraintRender implements IRenderUtil {
  async render(field: ITableField): Promise<string | null> {
    if (field.check) {
      return `CHECK ${field.check}`;
    }
    return null;
  }
}
