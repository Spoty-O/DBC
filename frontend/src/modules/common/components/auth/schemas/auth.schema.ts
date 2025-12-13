import { z } from "zod";

export const authSchema = z.object({
  email: z.email({ error: "Invalid email." }),
  password: z.string().min(2).max(20),
});

export type IAuthSchema = z.infer<typeof authSchema>
