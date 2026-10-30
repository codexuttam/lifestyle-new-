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
export const OFFICIAL_LIFESTYLE_WHATSAPP = getEnv("VITE_LIFESTYLE_WHATSAPP_NUMBER", "917498256708");

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

    console.warn("Lifestyle WhatsApp template response not OK, attempting direct text fallback:", result);

    // 2. Direct text message fallback via official Lifestyle phone ID
    const textUrl = `https://graph.facebook.com/v20.0/${configuredPhoneId}/messages`;
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
      console.log(`WhatsApp OTP delivered via direct text on Phone ID ${configuredPhoneId}:`, textResult.messages[0].id);
      return {
        success: true,
        messageId: textResult.messages[0].id,
      };
    }

    return {
      success: false,
      error: textResult?.error?.message || result?.error?.message || "Failed to dispatch WhatsApp OTP",
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

  const textMessage = `🏛️ *LIFESTYLE & AURA LEAD REPORT*\n\n• *Event*: ${eventLabel}\n• *Customer*: ${params.name || "Customer"}\n• *Phone*: ${params.phone}${emailLine}\n• *Details*: ${detailParam}\n• *Reference ID*: ${refParam}\n• *Timestamp*: ${nowIST} IST\n\n_Auto-registered in Real Estate CRM & Supabase Database._`;

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
              { type: "text", text: `${params.name || "Customer"} (${params.phone})` },
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

    return { success: false, error: dData?.error?.message || tData?.error?.message || "Delivery failed" };
  } catch (err: any) {
    console.warn("Owner WhatsApp notification error (non-blocking):", err);
    return { success: false, error: err?.message };
  }
}

/**
 * Generates direct click-to-chat WhatsApp link with Lifestyle Sales Desk
 */
export function getLifestyleConciergeWhatsAppUrl(customMessage?: string): string {
  const defaultText =
    "Hello Lifestyle Homes team, I would like to schedule a site visit and receive the official brochure.";
  const text = encodeURIComponent(customMessage || defaultText);
  return `https://wa.me/${OFFICIAL_LIFESTYLE_WHATSAPP}?text=${text}`;
}

export const AURA_BROCHURE_URL =
  "https://scymbepzlkfqtkkwnxne.supabase.co/storage/v1/object/public/brochures/Aura-by-Lifestyle-Brochure.pdf";
export const AURA_BROCHURE_MEDIA_ID = "1607495040856667";

/**
 * Sends the official Aura by Lifestyle PDF brochure directly to the customer's WhatsApp
 * upon login, sign-up, or enquiry submission.
 *
 * Uses Meta's approved 'property_brochure' template with a Document Header.
 * This guarantees delivery to all users on WhatsApp, even outside the 24-hr service window.
 */
export async function sendAuraBrochureOnWhatsApp(
  userPhone: string,
  customerName?: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  let cleanPhone = userPhone.replace(/\D/g, "");
  if (!cleanPhone) return { success: false, error: "Invalid phone number" };
  if (cleanPhone.length === 10) {
    cleanPhone = "91" + cleanPhone;
  }

  const configuredPhoneId = getEnv("VITE_WHATSAPP_PHONE_ID", "1344656402070032");
  const recipientName = customerName?.trim() || "Valued Client";

  try {
    // 1. Primary Attempt: Official Approved Lifestyle Meta Template 'property_brochure' (Utility)
    // with Document Header. Meta GUARANTEES delivery to ANY user outside the 24h window.
    const templatePayload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: cleanPhone,
      type: "template",
      template: {
        name: "property_brochure",
        language: { code: "en" },
        components: [
          {
            type: "header",
            parameters: [
              {
                type: "document",
                document: {
                  link: AURA_BROCHURE_URL,
                  filename: "Aura_by_Lifestyle_Brochure.pdf",
                },
              },
            ],
          },
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: recipientName,
              },
            ],
          },
        ],
      },
    };

    const res = await fetch(`https://graph.facebook.com/v20.0/${configuredPhoneId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(templatePayload),
    });

    const data = await res.json();
    if (res.ok && data.messages?.[0]?.id) {
      console.log(`Brochure PDF delivered to ${cleanPhone} via approved template property_brochure:`, data.messages[0].id);
      return { success: true, messageId: data.messages[0].id };
    }

    console.warn("property_brochure template with link returned non-OK:", data);

    // 2. Secondary Attempt: Same approved template using pre-uploaded Meta Media ID
    const templateMediaPayload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: cleanPhone,
      type: "template",
      template: {
        name: "property_brochure",
        language: { code: "en" },
        components: [
          {
            type: "header",
            parameters: [
              {
                type: "document",
                document: {
                  id: AURA_BROCHURE_MEDIA_ID,
                  filename: "Aura_by_Lifestyle_Brochure.pdf",
                },
              },
            ],
          },
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: recipientName,
              },
            ],
          },
        ],
      },
    };

    const mediaRes = await fetch(`https://graph.facebook.com/v20.0/${configuredPhoneId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(templateMediaPayload),
    });

    const mData = await mediaRes.json();
    if (mediaRes.ok && mData.messages?.[0]?.id) {
      console.log(`Brochure PDF delivered to ${cleanPhone} via approved template with media ID:`, mData.messages[0].id);
      return { success: true, messageId: mData.messages[0].id };
    }

    console.warn("Template with media ID returned non-OK:", mData);

    // 3. Tertiary Attempt: Direct text message with download link
    const textRes = await fetch(`https://graph.facebook.com/v20.0/${configuredPhoneId}/messages`, {
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
          preview_url: true,
          body: `🏛️ *Welcome to Aura by Lifestyle!*\n\nDear ${recipientName}, thank you for your interest. You can download and review the official architectural brochure and floor plans here:\n${AURA_BROCHURE_URL}\n\n_Lifestyle Home Spaces · MahaRERA: P5030002502915_`,
        },
      }),
    });

    const tData = await textRes.json();
    if (textRes.ok && tData.messages?.[0]?.id) {
      console.log(`Brochure link delivered to ${cleanPhone} via direct text:`, tData.messages[0].id);
      return { success: true, messageId: tData.messages[0].id };
    }

    return { success: false, error: mData?.error?.message || data?.error?.message || "Delivery failed" };
  } catch (err: any) {
    console.error("Failed to dispatch WhatsApp brochure PDF:", err);
    return { success: false, error: err?.message };
  }
}
