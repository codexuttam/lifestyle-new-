import "server-only";

import { TESTIMONIALS } from "@/data/testimonials";
import { testimonialSchema, type TestimonialRecord } from "@/lib/schemas/testimonial";

import { CONTENT_TAGS, cachedCollection } from "./repository";

const FALLBACK: TestimonialRecord[] = TESTIMONIALS.map((row, index) => ({
  ...row,
  order: index,
  published: true,
}));

const read = cachedCollection({
  collection: "testimonials",
  tag: CONTENT_TAGS.testimonials,
  schema: testimonialSchema,
  fallback: FALLBACK,
});

export async function getTestimonials(): Promise<TestimonialRecord[]> {
  return (await read()).filter((row) => row.published);
}

export async function getAllTestimonials(): Promise<TestimonialRecord[]> {
  return read();
}
