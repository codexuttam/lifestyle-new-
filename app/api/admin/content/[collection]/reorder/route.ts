import { revalidateTag } from "next/cache";
import { z } from "zod";

import { withAdmin } from "@/lib/auth/requireAdmin";
import { lookup } from "@/lib/api/registry";
import { adminDb } from "@/lib/firebase/admin";

type Context = { params: Promise<{ collection: string }> };

const bodySchema = z.object({ ids: z.array(z.string().min(1)).min(1) });

/** Persist display order — position in `ids` becomes the `order` field. */
export async function POST(request: Request, { params }: Context) {
  return withAdmin(async () => {
    const { collection } = await params;
    const entry = lookup(collection);
    if (!entry) {
      return Response.json({ error: "Unknown collection" }, { status: 404 });
    }

    const parsed = bodySchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return Response.json({ error: "Expected a list of ids." }, { status: 400 });
    }

    const db = adminDb();
    const batch = db.batch();
    parsed.data.ids.forEach((id, index) => {
      batch.update(db.collection(collection).doc(id), { order: index });
    });

    await batch.commit();
    revalidateTag(entry.tag);

    return Response.json({ ok: true });
  });
}
