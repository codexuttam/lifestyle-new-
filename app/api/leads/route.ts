import { FieldValue } from "firebase-admin/firestore";

import { clientIp, rateLimit } from "@/lib/api/rateLimit";
import { hasFirebaseAdminEnv } from "@/lib/env.server";
import { adminDb } from "@/lib/firebase/admin";
import { leadInputSchema } from "@/lib/schemas/lead";
import { captureLeadInCRM } from "@/lib/services/crmLeadService";
import { notifyOwnerOnWhatsApp } from "@/lib/services/whatsappService";

/**
 * Public endpoint for short enquiry submissions:
 * - Saves lead directly into the Real Estate CRM & Supabase dual-org database
 * - Sends instant WhatsApp notification to the owner
 * - Optionally archives to Firestore if Firebase Admin is configured
 */
export async function POST(request: Request) {
  const limit = rateLimit({
    key: `leads:${clientIp(request)}`,
    limit: 10,
    windowMs: 60_000,
  });

  if (!limit.allowed) {
    return Response.json(
      { error: "Too many submissions. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = leadInputSchema.safeParse(body);

  if (!parsed.success) {
    const errorMsg =
      parsed.error.issues[0]?.message || "Please check the highlighted fields and try again.";
    return Response.json({ error: errorMsg }, { status: 400 });
  }

  // Honeypot check for spam bots
  if (parsed.data.website) {
    return Response.json({ ok: true });
  }

  const { name, phone, email, project, preference, message } = parsed.data;

  // 1. Ingest lead directly into Real Estate CRM & Supabase dual-org
  const crmResult = await captureLeadInCRM({
    name,
    phone,
    email: email || undefined,
    project: project || "Aura by Lifestyle",
    preference: preference || "2 & 3 BHK Luxury Residences",
    message: message || undefined,
    source: "Website Enquiry Form",
  });

  // 2. Alert the owner directly on WhatsApp (non-blocking)
  notifyOwnerOnWhatsApp({
    type: "enquiry",
    name,
    phone,
    email: email || undefined,
    project: project || "Aura by Lifestyle",
    preference: preference || "Luxury Residence",
    referenceId: crmResult.referenceId,
  }).catch((err) => console.warn("[leads] Owner WhatsApp alert:", err));

  // 3. Optional Firestore archive if configured
  if (hasFirebaseAdminEnv()) {
    try {
      await adminDb()
        .collection("leads")
        .add({
          name,
          phone,
          email: email || null,
          project: project || "Aura by Lifestyle",
          referenceId: crmResult.referenceId,
          status: "new",
          source: "website",
          createdAt: FieldValue.serverTimestamp(),
        });
    } catch (e) {
      console.warn("[leads] Firestore optional backup skipped:", e);
    }
  }

  return Response.json(
    {
      ok: true,
      referenceId: crmResult.referenceId,
      message: crmResult.message || "Thank you! Your enquiry has been received.",
    },
    { status: 201 }
  );
}
