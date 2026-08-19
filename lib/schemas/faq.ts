import { z } from "zod";

import { recordMetaSchema } from "./project";

export const faqSchema = z
  .object({
    id: z.string().min(1),
    question: z.string().min(1),
    answer: z.string().min(1),
  })
  .extend(recordMetaSchema.shape);

export type FaqRecord = z.infer<typeof faqSchema>;
export const faqInputSchema = faqSchema.omit({ id: true });
