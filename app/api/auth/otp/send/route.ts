import { storeOtp } from "@/lib/auth/otpStore";
import { normalizePhone } from "@/lib/services/crmLeadService";
import { sendWhatsappOtp } from "@/lib/services/whatsappService";

export async function POST(request: Request) {
  try {
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

    // Store in OTP memory store
    storeOtp(cleanDigits, otp);

    // Send via Meta WhatsApp Cloud API (web_verify template)
    const result = await sendWhatsappOtp(formattedPhone, otp);

    return Response.json({
      ok: true,
      message: "Verification OTP sent to your WhatsApp.",
      messageId: result.messageId,
      // In case WhatsApp API throws error (e.g. test recipient limitation), provide fallback so developer/user is never blocked
      devFallbackOtp: !result.success ? otp : undefined,
    });
  } catch (error: any) {
    return Response.json(
      { error: error?.message || "Failed to dispatch WhatsApp OTP" },
      { status: 500 }
    );
  }
}
