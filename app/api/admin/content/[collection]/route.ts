import { revalidateTag } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";

import { withAdmin } from "@/lib/auth/requireAdmin";
import { lookup } from "@/lib/api/registry";
import { adminDb } from "@/lib/firebase/admin";

type Context = { params: Promise<{ collection: string }> };

/** Create a record. The `id` becomes the document name. */
export async function POST(request: Request, { params }: Context) {
  return withAdmin(async () => {
    const { collection } = await params;
    const entry = lookup(collection);
    if (!entry) {
      return Response.json({ error: "Unknown collection" }, { status: 404 });
    }

    const parsed = entry.schema.safeParse(
      await request.json().catch(() => null)
    );
    if (!parsed.success) {
      return Response.json(
        { error: "Invalid record", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const { id, ...fields } = parsed.data as { id: string } & object;
    const doc = adminDb().collection(collection).doc(id);

    if ((await doc.get()).exists) {
      return Response.json(
        { error: `Something with the id "${id}" already exists.` },
        { status: 409 }
      );
    }

    await doc.set({ ...fields, updatedAt: FieldValue.serverTimestamp() });
    revalidateTag(entry.tag);

    return Response.json({ ok: true, id }, { status: 201 });
  });
}
