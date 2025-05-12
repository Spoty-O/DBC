export interface ITableField {
  name: string;
  type?: string;
  defaultValue?: string | number | boolean | null;
  nullable?: boolean;
  unique?: boolean;
  primaryKey?: boolean;
  autoIncrement?: boolean;
  foreignKey?: boolean;
  check?: string;
  enum?: string[];
  index?: boolean;
  length?: number;
}

export interface ITableSchema {
  name: string;
  fields: ITableField[];
}

export interface IFieldParser {
  readonly regexp: RegExp;
  parse(text: string): Partial<ITableField> | null;
}
