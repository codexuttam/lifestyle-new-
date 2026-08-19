import type { ZodType } from "zod";

import { CONTENT_TAGS, type ContentTag } from "@/lib/content/repository";
import { faqInputSchema, faqSchema } from "@/lib/schemas/faq";
import { galleryInputSchema, gallerySchema } from "@/lib/schemas/gallery";
import { projectInputSchema, projectSchema } from "@/lib/schemas/project";
import { serviceInputSchema, serviceSchema } from "@/lib/schemas/service";
import {
  testimonialInputSchema,
  testimonialSchema,
} from "@/lib/schemas/testimonial";

type Entry = {
  tag: ContentTag;
  /** Full record, id included — used on create. */
  schema: ZodType<{ id: string }>;
  /** Record without id — used on update, where the id is in the URL. */
  inputSchema: ZodType<object>;
};

/**
 * The collections the generic CRUD routes will act on. Anything not listed here
 * is rejected, so `/api/admin/content/<anything>` cannot be used to write to an
 * arbitrary Firestore collection.
 */
export const COLLECTIONS: Record<string, Entry> = {
  projects: {
    tag: CONTENT_TAGS.projects,
    schema: projectSchema,
    inputSchema: projectInputSchema,
  },
  services: {
    tag: CONTENT_TAGS.services,
    schema: serviceSchema,
    inputSchema: serviceInputSchema,
  },
  testimonials: {
    tag: CONTENT_TAGS.testimonials,
    schema: testimonialSchema,
    inputSchema: testimonialInputSchema,
  },
  faqs: {
    tag: CONTENT_TAGS.faqs,
    schema: faqSchema,
    inputSchema: faqInputSchema,
  },
  gallery: {
    tag: CONTENT_TAGS.gallery,
    schema: gallerySchema,
    inputSchema: galleryInputSchema,
  },
};

export function lookup(collection: string): Entry | null {
  return Object.hasOwn(COLLECTIONS, collection)
    ? COLLECTIONS[collection]
    : null;
}
