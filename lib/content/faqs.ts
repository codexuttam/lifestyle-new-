import "server-only";

import { FAQS } from "@/data/faqs";
import { faqSchema, type FaqRecord } from "@/lib/schemas/faq";

import { CONTENT_TAGS, cachedCollection } from "./repository";

const FALLBACK: FaqRecord[] = FAQS.map((row, index) => ({
  ...row,
  order: index,
  published: true,
}));

const read = cachedCollection({
  collection: "faqs",
  tag: CONTENT_TAGS.faqs,
  schema: faqSchema,
  fallback: FALLBACK,
});

export async function getFaqs(): Promise<FaqRecord[]> {
  return (await read()).filter((row) => row.published);
}

export async function getAllFaqs(): Promise<FaqRecord[]> {
  return read();
}
