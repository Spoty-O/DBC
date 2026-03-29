import { z } from 'zod';

export const RequirementsSchema = z.object({
  domain: z.string(),
  actors: z.array(z.string()),
  use_cases: z.array(z.string()),
  entities: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      attributes: z.array(
        z.object({
          name: z.string(),
          meaning: z.string(),
          hints: z.array(z.string()),
        }),
      ),
    }),
  ),
  business_rules: z.array(z.string()),
  nonfunctional: z.array(z.string()),
  assumptions: z.array(z.string()),
  open_questions: z.array(z.string()),
});

export type TRequirements = z.infer<typeof RequirementsSchema>;
