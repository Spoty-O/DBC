import { z } from "zod";

export const chatSchema = z.object({
  text: z.string().min(2).max(20),
});

export type IChatSchema = z.infer<typeof chatSchema>;
