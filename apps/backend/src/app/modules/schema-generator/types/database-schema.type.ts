export type DatabaseFieldType =
  | 'string'
  | 'text'
  | 'number'
  | 'integer'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'uuid';

export interface DatabaseFieldReference {
  table: string;
  field: string;
}

export interface DatabaseField {
  name: string;
  type: DatabaseFieldType;
  nullable: boolean;
  primary: boolean;
  unique: boolean;
  references?: DatabaseFieldReference;
}

export interface DatabaseTable {
  name: string;
  fields: DatabaseField[];
}

export interface DatabaseSchema {
  tables: DatabaseTable[];
}
