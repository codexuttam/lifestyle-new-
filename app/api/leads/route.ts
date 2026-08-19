import { FieldValue } from "firebase-admin/firestore";

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

/** Naive per-instance throttle. Enough for a brochure site; not a WAF. */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((at) => now - at < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  // Keep the map from growing without bound on a long-lived instance.
  if (hits.size > 5000) hits.clear();

  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (rateLimited(ip)) {
    return Response.json(
      { error: "Too many submissions. Please try again shortly." },
      { status: 429 }
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
