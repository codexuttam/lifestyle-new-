import { FieldValue } from "firebase-admin/firestore";

import { clientIp, rateLimit } from "@/lib/api/rateLimit";
import { hasFirebaseAdminEnv } from "@/lib/env.server";
import { adminDb } from "@/lib/firebase/admin";
import { leadInputSchema } from "@/lib/schemas/lead";

/**
 * Public endpoint — the only unauthenticated write in the app.
 *
 * It is deliberately narrow: the schema whitelists exactly the fields the form
 * sends, nothing is echoed back, and submissions are capped per IP so the
 * collection cannot be flooded.
 */

export async function POST(request: Request) {
  const limit = rateLimit({
    key: `leads:${clientIp(request)}`,
    limit: 5,
    windowMs: 60_000,
  });

  if (!limit.allowed) {
    return Response.json(
      { error: "Too many submissions. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  const parsed = leadInputSchema.safeParse(
    await request.json().catch(() => null)
  );

  if (!parsed.success) {
    return Response.json(
      { error: "Please check the highlighted fields and try again." },
      { status: 400 }
    );
  }

  // Bots fill the hidden field. Answer as though it worked so they stop retrying.
  if (parsed.data.website) {
    return Response.json({ ok: true });
  }

  if (!hasFirebaseAdminEnv()) {
    console.error("[leads] dropped a submission — Firestore is not configured");
    return Response.json(
      { error: "We could not record that just now. Please call or WhatsApp us." },
      { status: 503 }
    );
  }

  const { website: _honeypot, ...lead } = parsed.data;

  try {
    await adminDb()
      .collection("leads")
      .add({
        ...lead,
        status: "new",
        notes: "",
        source: "website",
        createdAt: FieldValue.serverTimestamp(),
      });
  } catch (error) {
    console.error("[leads] could not store submission:", error);
    return Response.json(
      { error: "We could not record that just now. Please call or WhatsApp us." },
      { status: 500 }
    );
  }

  return Response.json({ ok: true }, { status: 201 });
}
