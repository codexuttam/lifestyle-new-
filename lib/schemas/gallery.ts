import { z } from "zod";

import { recordMetaSchema } from "./project";

export const gallerySchema = z
  .object({
    id: z.string().min(1),
    src: z.string().min(1),
    alt: z.string().min(1),
    caption: z.string().min(1),
  })
  .extend(recordMetaSchema.shape);

export type GalleryRecord = z.infer<typeof gallerySchema>;
export const galleryInputSchema = gallerySchema.omit({ id: true });
