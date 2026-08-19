import "server-only";

import { HOME_CONTENT } from "@/data/home";
import { homeSchema, type HomeRecord } from "@/lib/schemas/home";

import { CONTENT_TAGS, cachedDocument } from "./repository";

export const getHome = cachedDocument({
  path: ["siteContent", "home"],
  tag: CONTENT_TAGS.home,
  schema: homeSchema,
  fallback: HOME_CONTENT as HomeRecord,
});
