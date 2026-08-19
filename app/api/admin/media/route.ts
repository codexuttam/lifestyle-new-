import { revalidateTag } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";

import { withAdmin } from "@/lib/auth/requireAdmin";
import { cdnUrl } from "@/lib/bunny";
import { CONTENT_TAGS } from "@/lib/content/repository";
import { adminDb } from "@/lib/firebase/admin";
import { mediaInputSchema } from "@/lib/schemas/media";

/** Record an upload that has already landed in the storage zone. */
export async function POST(request: Request) {
  return withAdmin(async () => {
    const parsed = mediaInputSchema.safeParse(
      await request.json().catch(() => null)
    );
    if (!parsed.success) {
      return Response.json(
        { error: "Invalid media", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const id = crypto.randomUUID();
    const url = cdnUrl(parsed.data.path);

    await adminDb()
      .collection("media")
      .doc(id)
      .set({ ...parsed.data, url, createdAt: FieldValue.serverTimestamp() });

    revalidateTag(CONTENT_TAGS.media);
    return Response.json({ ok: true, id, url }, { status: 201 });
  });
}
