import { cookies } from "next/headers";
import { after } from "next/server";

import { clientIp, rateLimit } from "@/lib/api/rateLimit";
import { OTP_COOKIE, verifyOtpToken } from "@/lib/auth/otpStore";
import { captureLeadInCRM, normalizePhone } from "@/lib/services/crmLeadService";
import { notifyOwnerOnWhatsApp, sendAuraBrochureOnWhatsApp } from "@/lib/services/whatsappService";

export async function POST(request: Request) {
  try {
    const { phone, otp, name, email } = await request.json().catch(() => ({}));
    const cleanDigits = (phone || "").replace(/\D/g, "");

    if (!cleanDigits || !otp) {
      return Response.json(
        { error: "Phone number and OTP code are required." },
        { status: 400 }
      );
    }

    const limit = rateLimit({ key: `otp-verify:${clientIp(request)}`, limit: 10, windowMs: 10 * 60_000 });
    if (!limit.allowed) {
      return Response.json(
        { error: "Too many attempts. Please wait a few minutes and request a new code." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
      );
    }

    const cookieStore = await cookies();
    const verification = verifyOtpToken(cookieStore.get(OTP_COOKIE)?.value, cleanDigits, String(otp));
    if (!verification.valid) {
      return Response.json({ error: verification.reason || "Invalid OTP code." }, { status: 400 });
    }
    // One-time use
    cookieStore.delete({ name: OTP_COOKIE, path: "/api/auth/otp" });

    const normPhone = normalizePhone(phone);
    let resolvedName = (name || "").trim();

    if (!resolvedName || resolvedName.toLowerCase() === "lifestyle resident") {
      try {
        const phoneDigits10 = cleanDigits.slice(-10);
        const searchRes = await fetch(
          `${process.env.VITE_SUPABASE_URL || "https://scymbepzlkfqtkkwnxne.supabase.co"}/rest/v1/leads?phone=like.*${phoneDigits10}*&select=first_name,last_name&order=updated_at.desc&limit=1`,
          {
            headers: {
              apikey: process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || "",
              Authorization: `Bearer ${process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || ""}`,
            },
          }
        );
        if (searchRes.ok) {
          const rows = await searchRes.json();
          if (Array.isArray(rows) && rows.length > 0 && rows[0].first_name) {
            const foundFirst = rows[0].first_name.trim();
            const foundLast = (rows[0].last_name || "").trim();
            if (foundFirst.toLowerCase() !== "lifestyle") {
              resolvedName = [foundFirst, foundLast].filter(Boolean).join(" ").trim();
            }
          }
        }
      } catch (lookupErr) {
        console.warn("Could not lookup existing lead name:", lookupErr);
      }
    }

    if (!resolvedName || resolvedName.toLowerCase() === "lifestyle resident") {
      resolvedName = "Applicant";
    }

    const resolvedEmail = (email || "").trim() || undefined;

    const ownerPhone = (process.env.VITE_OWNER_WHATSAPP_NUMBER || "919730768982").replace(/\D/g, "");

    // Admin access is granted only to numbers listed in ADMIN_PHONE_NUMBERS (comma-separated,
    // server-only env var). Falls back to the owner number when unset.
    const adminPhones = (process.env.ADMIN_PHONE_NUMBERS || ownerPhone)
      .split(",")
      .map((p) => p.replace(/\D/g, "").slice(-10))
      .filter((p) => p.length === 10);

    const isAdmin = adminPhones.includes(cleanDigits.slice(-10));

    const verifiedAt = new Date().toISOString();

    // 1. Sync with Real Estate CRM
    const crmResult = await captureLeadInCRM({
      name: resolvedName,
      phone: normPhone,
      email: resolvedEmail,
      project: "Aura by Lifestyle",
      preference: "Exclusive Resident Access",
      source: "WhatsApp OTP Sign-In",
      verifiedAt,
      consent: true,
    });

    // 2 & 3. Owner alert + brochure delivery run after the response is sent.
    // after() keeps the serverless function alive until they finish (required on Vercel).
    after(async () => {
      await Promise.allSettled([
        notifyOwnerOnWhatsApp({
          type: "sign_in",
          name: resolvedName,
          phone: normPhone,
          email: resolvedEmail,
          referenceId: crmResult.referenceId,
        }).then((r) => !r.success && console.warn("Owner alert failed:", r.error)),
        sendAuraBrochureOnWhatsApp(normPhone, resolvedName).then(
          (r) => !r.success && console.warn("Brochure delivery failed:", r.error)
        ),
      ]);
    });

    return Response.json({
      ok: true,
      user: {
        phone: normPhone,
        name: resolvedName,
        email: resolvedEmail,
        verified: true,
        verifiedAt,
        isAdmin,
        referenceId: crmResult.referenceId,
      },
    });
  } catch (error: any) {
    return Response.json(
      { error: error?.message || "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
