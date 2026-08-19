import { z } from "zod";

import { SERVICE_CATEGORIES, SERVICE_ICON_KEYS } from "@/data/services";

import { recordMetaSchema } from "./project";

export const serviceSchema = z
  .object({
    id: z
      .string()
      .min(1)
      .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only"),
    title: z.string().min(1),
    category: z.enum(SERVICE_CATEGORIES),
    icon: z.enum(SERVICE_ICON_KEYS),
    text: z.string().min(1),
    includes: z.array(z.string().min(1)).min(1),
    startingAt: z.string().min(1),
    timeline: z.string().min(1),
    featured: z.boolean().optional(),
  })
  .extend(recordMetaSchema.shape);

export type ServiceRecord = z.infer<typeof serviceSchema>;

export const serviceInputSchema = serviceSchema.omit({ id: true });
