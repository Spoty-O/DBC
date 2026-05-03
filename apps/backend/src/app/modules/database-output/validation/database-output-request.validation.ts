import { z } from 'zod';
import { DatabaseSchemaSchema } from '../../schema-generator/schemas/database-schema.type';

export const DatabaseOutputRequestZod = z.object({
  userPrompt: z.string().min(1),
  schema: DatabaseSchemaSchema,
  resultType: z.enum(['sql', 'typeorm', 'prisma']).optional(),
});
