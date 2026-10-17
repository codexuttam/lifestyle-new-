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
  "EABAPJDHtQEABShEt6D8x9xA6EGkA3ToQBanxh1SpfQzPI18My0L4v5BDo9gZAfmZBOBajHhQpSwxySONbjgAc2P3LImZCloZCDtGdL5JQWtMK4cZBzPP4FM1mfWQPHrAJw9lew5n5gMqIil6VU0pamR8zgynZC7ZCZAknI6zkpZACJfmzX403penOHcB4CTad2AZDZD"
);
const PHONE_NUMBER_ID = getEnv("VITE_WHATSAPP_PHONE_ID", "1344656402070032");
export const OFFICIAL_LIFESTYLE_WHATSAPP = "918530763405";

/**
 * Sends a verified 6-digit OTP code to the customer's WhatsApp using Meta WhatsApp Cloud API.
 * Uses the pre-approved Lifestyle 'estateflow_lead_acknowledgment' template with automatic fallbacks.
 */
export async function sendWhatsappOtp(
  phone: string,
  otp: string
): Promise<SendOtpResult> {
  let cleanPhone = phone.replace(/\D/g, "");
  if (cleanPhone.length === 10) {
    cleanPhone = "91" + cleanPhone; // Default to India (+91)
  }

  const configuredPhoneId = getEnv("VITE_WHATSAPP_PHONE_ID", "1344656402070032");
  const bitlancePhoneId = getEnv("VITE_BITLANCE_WHATSAPP_PHONE_ID", "744188362103708");
  const bitlanceToken = getEnv("VITE_BITLANCE_WHATSAPP_TOKEN", TOKEN);

  // 1. Primary Attempt: Approved Lifestyle Home Spaces template (estateflow_lead_acknowledgment - en)
  const primaryUrl = `https://graph.facebook.com/v20.0/${configuredPhoneId}/messages`;
  const primaryPayload = {
    messaging_product: "whatsapp",
    to: cleanPhone,
    type: "template",
    template: {
      name: "estateflow_lead_acknowledgment",
      language: {
        code: "en",
      },
      components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: `Valued Client (Your Aura & Lifestyle verification code is: ${otp})`,
            },
          ],
        },
      ],
    },
  };

  try {
    const response = await fetch(primaryUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(primaryPayload),
    });

    const result = await response.json();

    if (response.ok && result.messages?.[0]?.id) {
      console.log(
        "WhatsApp OTP delivered via Lifestyle Home Spaces template estateflow_lead_acknowledgment:",
        result.messages[0].id
      );
      return {
        success: true,
        messageId: result.messages[0].id,
      };
    }

    console.warn("Lifestyle WhatsApp template response not OK:", result);

    // 2. High-Priority Fallback: Approved Real Estate Template on Bitlance AI (Phone ID 744188362103708)
    // Meta WhatsApp Cloud API strictly requires an APPROVED TEMPLATE to reach users outside the 24-hr customer service window.
    // estateflow_lead_acknowledgment is approved and active.
    try {
      const templateFallbackUrl = `https://graph.facebook.com/v20.0/${bitlancePhoneId}/messages`;
      const templateFallbackPayload = {
        messaging_product: "whatsapp",
        to: cleanPhone,
        type: "template",
        template: {
          name: "estateflow_lead_acknowledgment",
          language: { code: "en_US" },
          components: [
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  text: `Valued Client (Your Aura & Lifestyle verification code is: ${otp})`,
                },
              ],
            },
          ],
        },
      };

      const tfRes = await fetch(templateFallbackUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${bitlanceToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(templateFallbackPayload),
      });

      const tfData = await tfRes.json();
      if (tfRes.ok && tfData.messages?.[0]?.id) {
        console.log(
          `WhatsApp OTP delivered via approved template estateflow_lead_acknowledgment on Phone ID ${bitlancePhoneId}:`,
          tfData.messages[0].id
        );
        return {
          success: true,
          messageId: tfData.messages[0].id,
        };
      }
      console.warn("Bitlance template fallback response not OK:", tfData);
    } catch (tfErr) {
      console.warn("Bitlance template fallback error:", tfErr);
    }

    // 3. Fallback: Direct text message (for recipients who have an active 24h conversation window)
    const targetPhoneIds = [bitlancePhoneId, configuredPhoneId].filter(
      (id, index, self) => Boolean(id) && self.indexOf(id) === index
    );

    for (const pid of targetPhoneIds) {
      try {
        const textUrl = `https://graph.facebook.com/v20.0/${pid}/messages`;
        const textRes = await fetch(textUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${bitlanceToken}`,
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
  } catch (error: any) {
    console.error("Error invoking WhatsApp Cloud API:", error);
    return {
      success: false,
      error: error?.message || "Network error communicating with WhatsApp API",
    };
  }
}

/**
 * Sends a real-time WhatsApp notification directly to the CEO/owner number (configured in .env)
 * whenever a user logs in or submits an enquiry form.
 */
export async function notifyOwnerOnWhatsApp(
  params: OwnerNotificationParams
): Promise<{ success: boolean; error?: string }> {
  const configuredPhoneId = getEnv("VITE_WHATSAPP_PHONE_ID", "1344656402070032");
  const bitlancePhoneId = getEnv("VITE_BITLANCE_WHATSAPP_PHONE_ID", "744188362103708");
  const bitlanceToken = getEnv("VITE_BITLANCE_WHATSAPP_TOKEN", TOKEN);

  const rawCeoPhone =
    getEnv("VITE_OWNER_WHATSAPP_NUMBER") ||
    getEnv("NEXT_PUBLIC_OWNER_WHATSAPP_NUMBER") ||
    "919730768982";
  const digits = rawCeoPhone.replace(/\D/g, "");
  const cleanOwnerTo = digits.length === 10 ? "91" + digits : digits;

  const nowIST = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const eventLabel =
    params.type === "sign_in"
      ? "Member Sign-In / Login"
      : "New Property Enquiry";

  const detailParam =
    params.type === "sign_in"
      ? "Portal Access"
      : `${params.project || "Aura by Lifestyle"} (${params.preference || "Residence"})`;

  const refParam = params.referenceId || `LHS-MEMBER-${params.phone.replace(/\D/g, "").slice(-4)}`;
  const emailLine = params.email?.trim() ? `\n• *Email*: ${params.email.trim()}` : "";

  const textMessage = `🏛️ *LIFESTYLE & AURA LEAD REPORT*\n\n• *Event*: ${eventLabel}\n• *Customer*: ${params.name || "Valued Client"}\n• *Phone*: ${params.phone}${emailLine}\n• *Details*: ${detailParam}\n• *Reference ID*: ${refParam}\n• *Timestamp*: ${nowIST} IST\n\n_Auto-registered in Real Estate CRM & Supabase Database._`;

  try {
    // 1. Primary Attempt: Approved Meta Template (estateflow_lead_ai_summary) via Lifestyle Home Spaces
    // Guaranteed delivery outside 24-hr window
    const templatePayload = {
      messaging_product: "whatsapp",
      to: cleanOwnerTo,
      type: "template",
      template: {
        name: "estateflow_lead_ai_summary",
        language: { code: "en" },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: `${params.name || "Client"} (${params.phone})` },
              { type: "text", text: eventLabel },
              { type: "text", text: `${detailParam} · Ref: ${refParam} · ${nowIST} IST` },
            ],
          },
        ],
      },
    };

    const templateRes = await fetch(`https://graph.facebook.com/v20.0/${configuredPhoneId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(templatePayload),
    });

    const tData = await templateRes.json();
    if (templateRes.ok && tData.messages?.[0]?.id) {
      console.log(`CEO Alert delivered to ${cleanOwnerTo} via approved template:`, tData.messages[0].id);

      // Also fire direct detailed text message for richer reading experience
      fetch(`https://graph.facebook.com/v20.0/${configuredPhoneId}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: cleanOwnerTo,
          type: "text",
          text: { preview_url: false, body: textMessage },
        }),
      }).catch(() => {});

      return { success: true };
    }

    console.warn("Lifestyle template alert response not OK:", tData);

    // 2. Direct text message fallback
    const directRes = await fetch(`https://graph.facebook.com/v20.0/${configuredPhoneId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: cleanOwnerTo,
        type: "text",
        text: { preview_url: false, body: textMessage },
      }),
    });

    const dData = await directRes.json();
    if (directRes.ok && dData.messages?.[0]?.id) {
      console.log(`CEO Alert delivered to ${cleanOwnerTo} via direct text:`, dData.messages[0].id);
      return { success: true };
    }

    // 3. Fallback to Bitlance AI channel
    const bitlanceRes = await fetch(`https://graph.facebook.com/v20.0/${bitlancePhoneId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${bitlanceToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: cleanOwnerTo,
        type: "text",
        text: { preview_url: false, body: textMessage },
      }),
    });

    return { success: bitlanceRes.ok };
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
