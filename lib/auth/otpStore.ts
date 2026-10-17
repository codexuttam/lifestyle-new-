interface OtpEntry {
  otp: string;
  expiresAt: number;
  attempts: number;
}

// Global in-memory singleton store for WhatsApp OTPs
const globalForOtp = globalThis as unknown as {
  lifestyleOtpStore?: Map<string, OtpEntry>;
};

export const otpStore = globalForOtp.lifestyleOtpStore || new Map<string, OtpEntry>();
globalForOtp.lifestyleOtpStore = otpStore;

export function storeOtp(phone: string, otp: string): void {
  const clean = phone.replace(/\D/g, "").slice(-10);
  // 5 minutes expiry
  otpStore.set(clean, {
    otp: otp.trim(),
    expiresAt: Date.now() + 5 * 60 * 1000,
    attempts: 0,
  });
}

export function verifyStoredOtp(phone: string, enteredOtp: string): { valid: boolean; reason?: string } {
  const clean = phone.replace(/\D/g, "").slice(-10);
  const entry = otpStore.get(clean);

  if (!entry) {
    return { valid: false, reason: "No OTP found. Please request a new verification code." };
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(clean);
    return { valid: false, reason: "Verification code expired. Please request a new code." };
  }

  if (entry.attempts >= 5) {
    otpStore.delete(clean);
    return { valid: false, reason: "Maximum attempts exceeded. Please request a new code." };
  }

  entry.attempts += 1;

  if (entry.otp.trim() === enteredOtp.trim()) {
    otpStore.delete(clean);
    return { valid: true };
  }

  const remaining = 5 - entry.attempts;
  return { valid: false, reason: `Invalid code. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.` };
}
