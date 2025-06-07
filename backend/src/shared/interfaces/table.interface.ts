export interface ITableField {
  name: string;
  type: string;
  defaultValue?: string | number;
  nullable: boolean;
  unique?: boolean;
  primaryKey?: boolean;
  autoIncrement?: boolean;
  foreignKey?: { tableName: string; columnName: string };
  check?: string;
  index?: boolean;
}

export interface ITableSchema {
  name: string;
  fields: ITableField[];
}
