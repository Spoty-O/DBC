import { z } from 'zod';

export const DatabaseFieldTypeSchema = z.enum([
  'string',
  'text',
  'number',
  'integer',
  'boolean',
  'date',
  'datetime',
  'uuid',
]);

export const DatabaseFieldReferenceSchema = z.object({
  table: z.string().min(1),
  field: z.string().min(1),
});

export const DatabaseFieldSchema = z.object({
  name: z.string().min(1),
  type: DatabaseFieldTypeSchema,
  nullable: z.boolean(),
  primary: z.boolean(),
  unique: z.boolean(),
  references: DatabaseFieldReferenceSchema.optional(),
});

export const DatabaseTableSchema = z.object({
  name: z.string().min(1),
  fields: z.array(DatabaseFieldSchema).min(1),
});

export const DatabaseSchemaSchema = z.object({
  tables: z.array(DatabaseTableSchema).min(1),
});

export type DatabaseFieldType = z.infer<typeof DatabaseFieldTypeSchema>;
export type DatabaseFieldReference = z.infer<typeof DatabaseFieldReferenceSchema>;
export type DatabaseField = z.infer<typeof DatabaseFieldSchema>;
export type DatabaseTable = z.infer<typeof DatabaseTableSchema>;
export type DatabaseSchema = z.infer<typeof DatabaseSchemaSchema>;
