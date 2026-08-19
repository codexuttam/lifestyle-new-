import "server-only";

import { hasFirebaseAdminEnv } from "@/lib/env.server";
import { adminDb } from "@/lib/firebase/admin";
import { mediaSchema, type MediaRecord } from "@/lib/schemas/media";

/**
 * Not cached through `unstable_cache`: the library is only read inside the
 * admin, which is force-dynamic anyway, and a freshly uploaded file must show
 * up immediately.
 */
export async function getMedia(): Promise<MediaRecord[]> {
  if (!hasFirebaseAdminEnv()) return [];

  try {
    const snapshot = await adminDb()
      .collection("media")
      .orderBy("createdAt", "desc")
      .limit(500)
      .get();

    const records: MediaRecord[] = [];
    for (const doc of snapshot.docs) {
      const parsed = mediaSchema.safeParse({ id: doc.id, ...doc.data() });
      if (parsed.success) records.push(parsed.data);
    }
    return records;
  } catch (error) {
    console.error("[media] could not list:", error);
    return [];
  }
}
