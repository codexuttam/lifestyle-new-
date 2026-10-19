import { cookies } from "next/headers";

import { clientIp, rateLimit } from "@/lib/api/rateLimit";
import { OTP_COOKIE, OTP_TTL_MS, createOtpToken } from "@/lib/auth/otpStore";
import { normalizePhone } from "@/lib/services/crmLeadService";
import { sendWhatsappOtp } from "@/lib/services/whatsappService";

export async function POST(request: Request) {
  try {
    const limit = rateLimit({ key: `otp-send:${clientIp(request)}`, limit: 5, windowMs: 10 * 60_000 });
    if (!limit.allowed) {
      return Response.json(
        { error: "Too many OTP requests. Please wait a few minutes and try again." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
      );
    }

    const { phone } = await request.json().catch(() => ({}));
    const cleanDigits = (phone || "").replace(/\D/g, "");

    if (cleanDigits.length < 10) {
      return Response.json(
        { error: "Please enter a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    const formattedPhone = normalizePhone(phone);
    // Generate secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Send via Meta WhatsApp Cloud API
    const result = await sendWhatsappOtp(formattedPhone, otp);
    if (!result.success) {
      return Response.json(
        { error: result.error || "Failed to send WhatsApp OTP. Please try again." },
        { status: 502 }
      );
    }

    // Signed, HttpOnly cookie so verification works on any serverless instance
    (await cookies()).set(OTP_COOKIE, createOtpToken(cleanDigits, otp), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth/otp",
      maxAge: Math.floor(OTP_TTL_MS / 1000),
    });

    return Response.json({
      ok: true,
      message: "Verification OTP sent to your WhatsApp.",
      messageId: result.messageId,
    });
  } catch (error: any) {
    return Response.json(
      { error: error?.message || "Failed to dispatch WhatsApp OTP" },
      { status: 500 }
    );
  }
}
