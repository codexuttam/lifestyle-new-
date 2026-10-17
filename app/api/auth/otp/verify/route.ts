import { verifyStoredOtp } from "@/lib/auth/otpStore";
import { captureLeadInCRM, normalizePhone } from "@/lib/services/crmLeadService";
import { notifyOwnerOnWhatsApp } from "@/lib/services/whatsappService";

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
    const resolvedName = (name || "").trim() || "Lifestyle Resident";
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
