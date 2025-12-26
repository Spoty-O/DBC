import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.email({ error: "Invalid email." }),
    password: z.string().min(2).max(20),
    confirmPassword: z.string().min(2).max(20),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type IRegisterSchema = z.infer<typeof registerSchema>;
