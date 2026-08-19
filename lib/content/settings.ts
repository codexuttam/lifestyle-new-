import "server-only";

import { SITE_SETTINGS } from "@/data/settings";
import { settingsSchema, type SettingsRecord } from "@/lib/schemas/settings";

import { CONTENT_TAGS, cachedDocument } from "./repository";

const FALLBACK: SettingsRecord = SITE_SETTINGS;

export const getSettings = cachedDocument({
  path: ["siteContent", "settings"],
  tag: CONTENT_TAGS.settings,
  schema: settingsSchema,
  fallback: FALLBACK,
});
