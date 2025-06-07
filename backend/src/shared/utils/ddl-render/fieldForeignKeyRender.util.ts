import { IRenderUtil, ITableField } from 'src/shared/interfaces';

export class ForeignKeyRender implements IRenderUtil {
  async render(field: ITableField): Promise<string | null> {
    if (field.foreignKey) {
      const { tableName, columnName } = field.foreignKey;
      return `FOREIGN KEY (${field.name}) REFERENCES ${tableName}(${columnName})`;
    }
    return null;
  }
}
