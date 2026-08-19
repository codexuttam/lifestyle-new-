import { z } from "zod";

import { recordMetaSchema } from "./project";

export const testimonialSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    role: z.string().min(1),
    avatar: z.string().min(1),
    quote: z.string().min(1),
  })
  .extend(recordMetaSchema.shape);

export type TestimonialRecord = z.infer<typeof testimonialSchema>;
export const testimonialInputSchema = testimonialSchema.omit({ id: true });
