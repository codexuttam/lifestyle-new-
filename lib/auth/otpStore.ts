import { createHmac, timingSafeEqual } from "crypto";

/**
 * Stateless WhatsApp OTP verification.
 *
 * Serverless platforms (Vercel) run each request on a possibly different instance,
 * so an in-memory Map loses the OTP between /send and /verify. Instead, /send issues
 * an HttpOnly cookie containing `phone.expiresAt.signature`, where the signature is
 * an HMAC of phone + OTP + expiry. /verify recomputes the HMAC from the entered OTP.
 * The OTP itself is never stored in the cookie.
 */

export const OTP_COOKIE = "lh_otp";
export const OTP_TTL_MS = 5 * 60 * 1000;

function getSecret(): string {
  const secret =
    process.env.OTP_SECRET ||
    process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_CRM_WEBHOOK_SECRET ||
    process.env.VITE_WHATSAPP_ACCESS_TOKEN;
  if (!secret) {
    throw new Error("OTP_SECRET is not configured on the server.");
  }
  return secret;
}

const last10 = (phone: string) => phone.replace(/\D/g, "").slice(-10);

function sign(phone: string, otp: string, expiresAt: number): string {
  return createHmac("sha256", getSecret())
    .update(`${phone}|${otp.trim()}|${expiresAt}`)
    .digest("base64url");
}

/** Returns the cookie value to set after sending an OTP. */
export function createOtpToken(phone: string, otp: string): string {
  const clean = last10(phone);
  const expiresAt = Date.now() + OTP_TTL_MS;
  return `${clean}.${expiresAt}.${sign(clean, otp, expiresAt)}`;
}

export function verifyOtpToken(
  token: string | undefined,
  phone: string,
  enteredOtp: string
): { valid: boolean; reason?: string } {
  if (!token) {
    return { valid: false, reason: "No OTP found. Please request a new verification code." };
  }

  const [tokenPhone, expiresRaw, signature] = token.split(".");
  const expiresAt = Number(expiresRaw);
  const clean = last10(phone);

  if (!tokenPhone || !signature || !Number.isFinite(expiresAt) || tokenPhone !== clean) {
    return { valid: false, reason: "No OTP found for this number. Please request a new code." };
  }

  if (Date.now() > expiresAt) {
    return { valid: false, reason: "Verification code expired. Please request a new code." };
  }

  const expected = Buffer.from(sign(clean, enteredOtp, expiresAt));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return { valid: false, reason: "Invalid code. Please check your WhatsApp and try again." };
  }

  return { valid: true };
}
