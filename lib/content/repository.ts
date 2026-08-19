import "server-only";

import { unstable_cache } from "next/cache";
import type { z } from "zod";

import { hasFirebaseAdminEnv } from "@/lib/env.server";
import { adminDb } from "@/lib/firebase/admin";

/** Cache tags, revalidated by the admin routes after every write. */
export const CONTENT_TAGS = {
  projects: "projects",
  services: "services",
  company: "company",
  testimonials: "testimonials",
  faqs: "faqs",
  gallery: "gallery",
  media: "media",
  settings: "settings",
  home: "home",
  pages: "pages",
} as const;

export type ContentTag = (typeof CONTENT_TAGS)[keyof typeof CONTENT_TAGS];

/** One hour, then a background refresh. Writes revalidate by tag immediately. */
const REVALIDATE_SECONDS = 3600;

type Sortable = { order?: number; title?: string };

function byOrder(a: Sortable, b: Sortable) {
  const delta = (a.order ?? 0) - (b.order ?? 0);
  if (delta !== 0) return delta;
  return (a.title ?? "").localeCompare(b.title ?? "");
}

/**
 * Read a collection, falling back to the static seed in `data/` whenever
 * Firestore cannot answer — no credentials, empty collection, or an outage.
 * The public site therefore keeps rendering on a machine with no `.env.local`,
 * and a Firestore incident degrades to last-known-good content instead of a
 * 500.
 *
 * Filtering and sorting happen in memory rather than in the query: these
 * collections hold tens of documents, and it avoids maintaining a composite
 * index for every `where` + `orderBy` pair.
 */
async function readCollection<T extends Sortable>(
  collection: string,
  schema: z.ZodType<T>,
  fallback: T[]
): Promise<T[]> {
  if (!hasFirebaseAdminEnv()) return fallback;

  try {
    const snapshot = await adminDb().collection(collection).get();
    if (snapshot.empty) return fallback;

    const records: T[] = [];
    for (const doc of snapshot.docs) {
      const parsed = schema.safeParse({ id: doc.id, ...doc.data() });
      if (parsed.success) {
        records.push(parsed.data);
      } else {
        console.warn(
          `[content] skipping malformed ${collection}/${doc.id}:`,
          parsed.error.issues.map((issue) => issue.path.join(".")).join(", ")
        );
      }
    }

    if (records.length === 0) return fallback;
    return records.sort(byOrder);
  } catch (error) {
    console.error(`[content] falling back to seed data for ${collection}:`, error);
    return fallback;
  }
}

/** Same contract as `readCollection`, wrapped in the Next data cache. */
export function cachedCollection<T extends Sortable>(options: {
  collection: string;
  tag: ContentTag;
  schema: z.ZodType<T>;
  fallback: T[];
}) {
  return unstable_cache(
    () => readCollection(options.collection, options.schema, options.fallback),
    ["content", options.collection],
    { tags: [options.tag], revalidate: REVALIDATE_SECONDS }
  );
}

/** Singleton documents (company facts, site settings, homepage composition). */
export function cachedDocument<T>(options: {
  path: [collection: string, doc: string];
  tag: ContentTag;
  schema: z.ZodType<T>;
  fallback: T;
}) {
  const [collection, docId] = options.path;

  return unstable_cache(
    async (): Promise<T> => {
      if (!hasFirebaseAdminEnv()) return options.fallback;

      try {
        const snapshot = await adminDb().collection(collection).doc(docId).get();
        if (!snapshot.exists) return options.fallback;

        const parsed = options.schema.safeParse(snapshot.data());
        if (!parsed.success) {
          console.warn(
            `[content] malformed ${collection}/${docId}, using seed:`,
            parsed.error.issues.map((issue) => issue.path.join(".")).join(", ")
          );
          return options.fallback;
        }
        return parsed.data;
      } catch (error) {
        console.error(`[content] falling back to seed for ${collection}/${docId}:`, error);
        return options.fallback;
      }
    },
    ["content", collection, docId],
    { tags: [options.tag], revalidate: REVALIDATE_SECONDS }
  );
}
