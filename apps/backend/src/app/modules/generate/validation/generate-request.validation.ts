import { z } from 'zod';

export const GenerateRequestZod = z.object({
  text: z
    .string()
    .max(50_000, 'text is too long')
    .transform((s) => s.trim())
    .pipe(z.string().min(1, 'text is required')),
  resultType: z.enum(['sql', 'typeorm', 'prisma']),
});

export type ValidatedGenerateRequest = z.infer<typeof GenerateRequestZod>;
