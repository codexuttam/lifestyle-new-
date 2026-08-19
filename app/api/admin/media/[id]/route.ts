import { revalidateTag } from "next/cache";

import { withAdmin } from "@/lib/auth/requireAdmin";
import { deleteObject } from "@/lib/bunny";
import { CONTENT_TAGS } from "@/lib/content/repository";
import { adminDb } from "@/lib/firebase/admin";

type Context = { params: Promise<{ id: string }> };

/** Remove the record and the underlying object. */
export async function DELETE(_request: Request, { params }: Context) {
  return withAdmin(async () => {
    const { id } = await params;
    const doc = adminDb().collection("media").doc(id);
    const snapshot = await doc.get();

    if (!snapshot.exists) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const path = snapshot.data()?.path as string | undefined;
    if (path) {
      // Storage is the source of truth for bytes; if this fails the record
      // stays put so the orphan is visible rather than silently leaked.
      await deleteObject(path);
    }

    await doc.delete();
    revalidateTag(CONTENT_TAGS.media);
    return Response.json({ ok: true });
  });
}
