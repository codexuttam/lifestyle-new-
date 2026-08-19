import { z } from "zod";

import { withAdmin } from "@/lib/auth/requireAdmin";
import { adminDb } from "@/lib/firebase/admin";
import { LEAD_STATUSES } from "@/lib/schemas/lead";

type Context = { params: Promise<{ id: string }> };

/** Only the fields the owner is allowed to change after the fact. */
const patchSchema = z.object({
  status: z.enum(LEAD_STATUSES).optional(),
  notes: z.string().max(4000).optional(),
});

export async function PATCH(request: Request, { params }: Context) {
  return withAdmin(async () => {
    const { id } = await params;
    const parsed = patchSchema.safeParse(
      await request.json().catch(() => null)
    );

    if (!parsed.success) {
      return Response.json({ error: "Invalid update" }, { status: 400 });
    }

    await adminDb().collection("leads").doc(id).update(parsed.data);
    // Leads are not part of the cached public content, so nothing to revalidate.
    return Response.json({ ok: true });
  });
}

export async function DELETE(_request: Request, { params }: Context) {
  return withAdmin(async () => {
    const { id } = await params;
    await adminDb().collection("leads").doc(id).delete();
    return Response.json({ ok: true });
  });
}
