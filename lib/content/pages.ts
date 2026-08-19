import "server-only";

import { PAGES_CONTENT } from "@/data/pages";
import { pagesSchema, type PagesRecord } from "@/lib/schemas/pages";

import { CONTENT_TAGS, cachedDocument } from "./repository";

export const getPages = cachedDocument({
  path: ["siteContent", "pages"],
  tag: CONTENT_TAGS.pages,
  schema: pagesSchema,
  fallback: PAGES_CONTENT as PagesRecord,
});
