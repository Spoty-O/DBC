import { z } from "zod";

export const generateFormSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "Enter business rules before generating."),
  resultType: z.enum(["typeorm", "prisma", "sql"]),
});

export type GenerateFormValues = z.infer<typeof generateFormSchema>;
