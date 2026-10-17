import { verifyStoredOtp } from "@/lib/auth/otpStore";
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

    const verification = verifyStoredOtp(cleanDigits, otp);
    if (!verification.valid) {
      return Response.json({ error: verification.reason || "Invalid OTP code." }, { status: 400 });
    }

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
    const adminEmail = (process.env.VITE_CRM_ADMIN_EMAIL || "admin@lifestylehomespaces.com").toLowerCase();

    const isAdmin = Boolean(
      cleanDigits === ownerPhone ||
      cleanDigits.endsWith("8318768905") ||
      cleanDigits.endsWith("9730768982") ||
      cleanDigits.endsWith("7498256708") ||
      (resolvedEmail && resolvedEmail.toLowerCase() === adminEmail)
    );

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

    // 2. Alert the owner
    notifyOwnerOnWhatsApp({
      type: "sign_in",
      name: resolvedName,
      phone: normPhone,
      email: resolvedEmail,
      referenceId: crmResult.referenceId,
    }).catch((e) => console.warn("Owner alert error:", e));

    // 3. Deliver official Aura by Lifestyle PDF brochure directly to the customer on WhatsApp
    sendAuraBrochureOnWhatsApp(normPhone, resolvedName).catch((e) =>
      console.warn("User brochure WhatsApp delivery error:", e)
    );

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
