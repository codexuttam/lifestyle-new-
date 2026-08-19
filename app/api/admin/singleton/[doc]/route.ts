import { revalidateTag } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";
import type { ZodType } from "zod";

import { withAdmin } from "@/lib/auth/requireAdmin";
import { CONTENT_TAGS, type ContentTag } from "@/lib/content/repository";
import { adminDb } from "@/lib/firebase/admin";
import { companySchema } from "@/lib/schemas/company";
import { homeSchema } from "@/lib/schemas/home";
import { settingsSchema } from "@/lib/schemas/settings";

type Entry = { tag: ContentTag; schema: ZodType<object> };

/** Allowlist of editable singleton documents under `siteContent`. */
const SINGLETONS: Record<string, Entry> = {
  company: { tag: CONTENT_TAGS.company, schema: companySchema },
  settings: { tag: CONTENT_TAGS.settings, schema: settingsSchema },
  home: { tag: CONTENT_TAGS.home, schema: homeSchema },
};

type Context = { params: Promise<{ doc: string }> };

export async function PUT(request: Request, { params }: Context) {
  return withAdmin(async () => {
    const { doc } = await params;
    const entry = Object.hasOwn(SINGLETONS, doc) ? SINGLETONS[doc] : null;
    if (!entry) {
      return Response.json({ error: "Unknown document" }, { status: 404 });
    }

    const parsed = entry.schema.safeParse(
      await request.json().catch(() => null)
    );
    if (!parsed.success) {
      return Response.json(
        { error: "Invalid content", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    await adminDb()
      .collection("siteContent")
      .doc(doc)
      .set({
        ...(parsed.data as object),
        updatedAt: FieldValue.serverTimestamp(),
      });

    revalidateTag(entry.tag);
    return Response.json({ ok: true });
  });
}
