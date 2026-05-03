/** Output format for generated schema text (SQL DDL, TypeORM, or Prisma). */
export const SchemaResultType = {
  SQL: 'sql',
  TYPEORM: 'typeorm',
  PRISMA: 'prisma',
} as const;

export type SchemaResultType =
  (typeof SchemaResultType)[keyof typeof SchemaResultType];

/** @deprecated Use SchemaResultType — same values, kept for internal renderer switches. */
export const DatabaseOutputMode = SchemaResultType;
export type DatabaseOutputMode = SchemaResultType;

/** Field object inside LLM-generated database schema JSON (shared contract for API/FE). */
export interface IGeneratedDatabaseSchemaField {
  name: string;
  type: string;
  nullable: boolean;
  primary: boolean;
  unique: boolean;
  references?: { table: string; field: string };
}

export interface IGeneratedDatabaseSchemaTable {
  name: string;
  fields: IGeneratedDatabaseSchemaField[];
}

/**
 * Validated database schema JSON produced by the LLM + validation pipeline.
 * Structural mirror of backend Zod `DatabaseSchema`.
 */
export type GeneratedSchema = {
  tables: IGeneratedDatabaseSchemaTable[];
};

export type GeneratedDatabaseSchema = GeneratedSchema;

export interface DatabaseOutputRequest {
  userPrompt: string;
  schema: GeneratedDatabaseSchema;
  resultType?: SchemaResultType;
}

/** Internal result from renderers (warnings optional for diagnostics). */
export interface DatabaseOutputResult {
  schema: string;
  description: string;
  warnings?: string[];
}

/** Public generation API — natural language business rules → schema text + brief technical summary. */
export interface GenerateRequest {
  /** Natural-language business rules / requirements. */
  text: string;
  resultType: SchemaResultType;
}

/**
 * Strict API payload: generated schema as a single string, plus a short technical description.
 * JSON keys: "schema", "description".
 */
export interface GenerateResponse {
  schema: string;
  description: string;
}
