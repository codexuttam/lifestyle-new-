export interface SendOtpResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface OwnerNotificationParams {
  type: "sign_in" | "enquiry";
  name: string;
  phone: string;
  email?: string;
  project?: string;
  preference?: string;
  referenceId?: string;
}

const getEnv = (key: string, fallback = "") => {
  if (typeof process !== "undefined" && process.env) {
    if (process.env[key]) return process.env[key]!;
    if (process.env[`NEXT_PUBLIC_${key.replace(/^VITE_/, "")}`]) {
      return process.env[`NEXT_PUBLIC_${key.replace(/^VITE_/, "")}`]!;
    }
  }
  return fallback;
};

const TOKEN = getEnv(
  "VITE_WHATSAPP_ACCESS_TOKEN",
  "EAAU6uBLPyowBRZB635p73IoYSJusGBYeJPNezLQWnPmjnr5i2ZB7ZCNZCmZCkvvjGuvqSFVb6ejubUsH1hgt95joyIxi7emH2NlfxCT5sIAwtisWs9HQZBKURg79rqKa20cYRi2KQ0mLRXE7hhIRJ3vjlfrsDUFD0mk6pW3DGwMoR5AItC2OwZAFqzhMMHQwYfyHQZDZD"
);
const PHONE_NUMBER_ID = getEnv("VITE_WHATSAPP_PHONE_ID", "1344656402070032");
export const OFFICIAL_LIFESTYLE_WHATSAPP = "918530763405";

/**
 * Sends a verified 6-digit OTP code to the customer's WhatsApp using Meta WhatsApp Cloud API.
 * Uses the pre-approved 'web_verify' template with automatic direct message fallback.
 */
export async function sendWhatsappOtp(
  phone: string,
  otp: string
): Promise<SendOtpResult> {
  let cleanPhone = phone.replace(/\D/g, "");
  if (cleanPhone.length === 10) {
    cleanPhone = "91" + cleanPhone; // Default to India (+91)
  }

  const url = `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    to: cleanPhone,
    type: "template",
    template: {
      name: "web_verify",
      language: {
        code: "en",
      },
      components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: otp,
            },
          ],
        },
        {
          type: "button",
          sub_type: "url",
          index: "0",
          parameters: [
            {
              type: "text",
              text: otp,
            },
          ],
        },
      ],
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.warn("WhatsApp Cloud API template response not OK:", result);

      // Attempt fallback direct text message via configured Phone ID and active Phone ID
      const targetPhoneIds = [PHONE_NUMBER_ID, "744188362103708"].filter(
        (id, index, self) => Boolean(id) && self.indexOf(id) === index
      );

      for (const pid of targetPhoneIds) {
        try {
          const textUrl = `https://graph.facebook.com/v20.0/${pid}/messages`;
          const textRes = await fetch(textUrl, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messaging_product: "whatsapp",
              recipient_type: "individual",
              to: cleanPhone,
              type: "text",
              text: {
                preview_url: false,
                body: `*LIFESTYLE & AURA RESIDENCES*\n\nYour login verification OTP is: *${otp}*\n\nValid for 10 minutes. Do not share this OTP with anyone.\n\nLifestyle Home Spaces · Amravati`,
              },
            }),
          });
          const textResult = await textRes.json();
          if (textRes.ok && textResult.messages?.[0]?.id) {
            console.log(`WhatsApp OTP delivered via Phone ID ${pid}:`, textResult.messages[0].id);
            return {
              success: true,
              messageId: textResult.messages[0].id,
            };
          }
        } catch (fallbackErr) {
          console.warn(`Direct text fallback on ${pid} encountered error:`, fallbackErr);
        }
      }

      return {
        success: false,
        error: result.error?.message || "Failed to dispatch WhatsApp OTP",
      };
    }

    const messageId = result.messages?.[0]?.id;
    return {
      success: true,
      messageId,
    };
  } catch (error: any) {
    console.error("Error invoking WhatsApp Cloud API:", error);
    return {
      success: false,
      error: error?.message || "Network error communicating with WhatsApp API",
    };
  }
}

/**
 * Sends a real-time WhatsApp notification directly to the owner number (918530763405)
 * using Bitlance AI (Phone ID 744188362103708) from Real Estate CRM.
 */
export async function notifyOwnerOnWhatsApp(
  params: OwnerNotificationParams
): Promise<{ success: boolean; error?: string }> {
  const bitlancePhoneId = getEnv("VITE_BITLANCE_WHATSAPP_PHONE_ID", "744188362103708");
  const bitlanceToken = getEnv(
    "VITE_BITLANCE_WHATSAPP_TOKEN",
    "EAAU6uBLPyowBRZB635p73IoYSJusGBYeJPNezLQWnPmjnr5i2ZB7ZCNZCmZCkvvjGuvqSFVb6ejubUsH1hgt95joyIxi7emH2NlfxCT5sIAwtisWs9HQZBKURg79rqKa20cYRi2KQ0mLRXE7hhIRJ3vjlfrsDUFD0mk6pW3DGwMoR5AItC2OwZAFqzhMMHQwYfyHQZDZD"
  );

  const ownerRecipient = getEnv("VITE_OWNER_WHATSAPP_NUMBER", "918530763405").replace(/\D/g, "");
  const cleanOwnerTo = ownerRecipient.length === 10 ? "91" + ownerRecipient : ownerRecipient;

  const nowIST = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const actionText =
    params.type === "sign_in"
      ? "signed in to the client portal"
      : "submitted a new property enquiry";

  const detailParam =
    params.type === "sign_in"
      ? "Member Portal Access"
      : `${params.project || "Aura by Lifestyle"} (${params.preference || "Residence"})`;

  const refParam = params.referenceId || `LHS-MEMBER-${params.phone.replace(/\D/g, "").slice(-4)}`;
  const emailLine = params.email?.trim() ? `\n• Email: ${params.email.trim()}` : "";

  const textMessage = `Hello Lifestyle Team,\n\nA customer has ${actionText} on the official website.\n\n*Customer Details:*\n• Name: ${params.name || "Valued Client"}\n• Phone: ${params.phone}${emailLine}\n• Details / Project: ${detailParam}\n• Reference ID: ${refParam}\n• Time: ${nowIST} IST\n\nPlease follow up with the customer promptly.`;

  try {
    const url = `https://graph.facebook.com/v19.0/${bitlancePhoneId}/messages`;

    // Try sending template lifestyle_lead_alert first
    const templatePayload = {
      messaging_product: "whatsapp",
      to: cleanOwnerTo,
      type: "template",
      template: {
        name: "lifestyle_lead_alert",
        language: { code: "en" },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: params.name || "Valued Customer" },
              { type: "text", text: params.phone },
              { type: "text", text: detailParam },
              { type: "text", text: refParam },
            ],
          },
        ],
      },
    };

    const templateRes = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${bitlanceToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(templatePayload),
    });

    if (templateRes.ok) {
      return { success: true };
    }

    // Fallback: standard direct text message
    const directPayload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: cleanOwnerTo,
      type: "text",
      text: { body: textMessage },
    };

    const directRes = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${bitlanceToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(directPayload),
    });

    return { success: directRes.ok };
  } catch (err: any) {
    console.warn("Owner WhatsApp notification error (non-blocking):", err);
    return { success: false, error: err?.message };
  }
}

/**
 * Generates direct click-to-chat WhatsApp link with Lifestyle Concierge
 */
export function getLifestyleConciergeWhatsAppUrl(customMessage?: string): string {
  const defaultText =
    "Hello Lifestyle Team, I would like to schedule an exclusive VIP site visit and receive the architectural brochure.";
  const text = encodeURIComponent(customMessage || defaultText);
  return `https://wa.me/${OFFICIAL_LIFESTYLE_WHATSAPP}?text=${text}`;
}
