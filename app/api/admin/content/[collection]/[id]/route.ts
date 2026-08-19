import { revalidateTag } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";

import { withAdmin } from "@/lib/auth/requireAdmin";
import { lookup } from "@/lib/api/registry";
import { adminDb } from "@/lib/firebase/admin";

type Context = { params: Promise<{ collection: string; id: string }> };

export async function PUT(request: Request, { params }: Context) {
  return withAdmin(async () => {
    const { collection, id } = await params;
    const entry = lookup(collection);
    if (!entry) {
      return Response.json({ error: "Unknown collection" }, { status: 404 });
    }

    const parsed = entry.inputSchema.safeParse(
      await request.json().catch(() => null)
    );
    if (!parsed.success) {
      return Response.json(
        { error: "Invalid record", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const doc = adminDb().collection(collection).doc(id);
    if (!(await doc.get()).exists) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    await doc.set({
      ...(parsed.data as object),
      updatedAt: FieldValue.serverTimestamp(),
    });
    revalidateTag(entry.tag);

    return Response.json({ ok: true });
  });
}

export async function DELETE(_request: Request, { params }: Context) {
  return withAdmin(async () => {
    const { collection, id } = await params;
    const entry = lookup(collection);
    if (!entry) {
      return Response.json({ error: "Unknown collection" }, { status: 404 });
    }

    await adminDb().collection(collection).doc(id).delete();
    revalidateTag(entry.tag);
    return Response.json({ ok: true });
  });
}
