import { z } from 'zod';

export const ColumnTypeSchema = z.enum([
  'uuid',
  'text',
  'varchar',
  'int',
  'bigint',
  'numeric',
  'boolean',
  'timestamptz',
  'date',
  'jsonb',
]);

export const DbSchemaSchema = z.object({
  db: z.literal('postgres'),
  conventions: z.object({
    id_type: z.literal('uuid'),
    timestamps: z.boolean(),
    soft_delete: z.boolean(),
  }),
  tables: z.array(
    z.object({
      name: z.string(),
      columns: z.array(
        z.object({
          name: z.string(),
          type: ColumnTypeSchema,
          not_null: z.boolean(),
          pk: z.boolean(),
          unique: z.boolean(),
          default: z.string().nullable(),
        }),
      ),
      indexes: z.array(
        z.object({
          name: z.string(),
          columns: z.array(z.string()),
          unique: z.boolean(),
        }),
      ),
    }),
  ),
  relations: z.array(
    z.object({
      type: z.enum([
        'one-to-many',
        'many-to-one',
        'one-to-one',
        'many-to-many',
      ]),
      from: z.string(),
      to: z.string(),
      on_delete: z.enum(['cascade', 'restrict', 'set_null']),
    }),
  ),
  enums: z.array(
    z.object({
      name: z.string(),
      values: z.array(z.string()),
    }),
  ),
  notes: z.array(z.string()),
  assumptions: z.array(z.string()),
});

export type TDbSchema = z.infer<typeof DbSchemaSchema>;