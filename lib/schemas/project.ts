import { z } from "zod";

import { PROJECT_CATEGORIES } from "@/data/projects";

/** Fields every CMS-managed record carries on top of its own content. */
export const recordMetaSchema = z.object({
  order: z.number().int().nonnegative().default(0),
  published: z.boolean().default(true),
});

export const projectSchema = z
  .object({
    id: z
      .string()
      .min(1)
      .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only"),
    title: z.string().min(1),
    category: z.enum(PROJECT_CATEGORIES),
    status: z.enum(["Delivered", "In Progress"]),
    location: z.string().min(1),
    year: z.string().min(1),
    price: z.string().min(1),
    beds: z.string().min(1),
    baths: z.string().min(1),
    area: z.string().min(1),
    img: z.string().min(1),
    video: z.string().url().optional(),
    summary: z.string().min(1),
  })
  .extend(recordMetaSchema.shape);

export type ProjectRecord = z.infer<typeof projectSchema>;

/** The form payload — `id` is assigned by the route on create. */
export const projectInputSchema = projectSchema.omit({ id: true });
