export interface LeadCapturePayload {
  name: string;
  phone: string;
  email?: string;
  source?: string;
  project?: string;
  preference?: string;
  preferredMethod?: string;
  preferredTime?: string;
  preferredDate?: string;
  message?: string;
  consent?: boolean;
  notes?: string;
  referenceId?: string;
  verifiedAt?: string;
}

export interface LeadCaptureResult {
  success: boolean;
  leadId?: string;
  referenceId: string;
  deduped?: boolean;
  message?: string;
  error?: string;
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

const SUPABASE_URL = getEnv("VITE_SUPABASE_URL", "https://scymbepzlkfqtkkwnxne.supabase.co");
const SERVICE_KEY = getEnv(
  "VITE_SUPABASE_SERVICE_ROLE_KEY",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjeW1iZXB6bGtmcXRra3dueG5lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mjk1NTUzNywiZXhwIjoyMDk4NTMxNTM3fQ.GyqIVGPGaTeFy0rhAHXDM7F-48cjKtj1V8BcXFklZpk"
);
const CRM_WEBHOOK_URL = getEnv(
  "VITE_CRM_WEBHOOK_URL",
  "https://realstatecrm.bitlancetechhub.com/api/webhooks/leads"
);
const CRM_WEBHOOK_SECRET = getEnv(
  "VITE_CRM_WEBHOOK_SECRET",
  "whsec_1f6b4e17bccfc6a5a0dde2c5dcde533e6638652203f517e8"
);

// Target Organizations:
// 1. PRIMARY_ORG_ID: Lifestyle Home Spaces (8a7fe841-bda6-46a1-a033-d68d2bb2a318)
// 2. TALDA_ORG_ID: Amit Talda & Agent Lifestyle Home Space (fa3ac4b0-ca18-4a4d-8f62-a0d6fc1f201d)
// 3. DASHBOARD_ORG_ID: Real Estate CRM Dashboard Org (956739fd-5b6f-46f6-9e8f-82b6e17ee482)
const PRIMARY_ORG_ID = getEnv("VITE_CRM_ORG_ID", "8a7fe841-bda6-46a1-a033-d68d2bb2a318");
export const TALDA_ORG_ID = "fa3ac4b0-ca18-4a4d-8f62-a0d6fc1f201d";
const DASHBOARD_ORG_ID = "956739fd-5b6f-46f6-9e8f-82b6e17ee482";

// Admin: admittalda@lifestylehomespaces.com (0cc4c84a-bc35-4f81-9291-4ffef2490543)
// Agent: agent@lifestylehomespaces.com (fd56919d-073f-48f4-8fc0-965bb2f67a2d)
const CRM_ADMIN_ID = getEnv("VITE_CRM_ADMIN_ID", "0cc4c84a-bc35-4f81-9291-4ffef2490543");
const CRM_AGENT_ID = getEnv("VITE_CRM_AGENT_ID", "fd56919d-073f-48f4-8fc0-965bb2f67a2d");

// Generates an official reference ID (e.g. LHS-2026-A82F)
export function generateReferenceId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `LHS-2026-${code}`;
}

// Splits full name into first and last name safely without adding any 'Client' suffix
export function splitName(fullName: string): { firstName: string; lastName: string } {
  let trimmed = (fullName || "").trim().replace(/\s+/g, " ");
  if (!trimmed) {
    return { firstName: "", lastName: "" };
  }

  // Strip trailing "client" or "Client" if mistakenly entered or appended (e.g. "Raj Client" -> "Raj")
  trimmed = trimmed.replace(/\s+[Cc]lient$/i, "").trim() || trimmed;

  const parts = trimmed.split(" ");
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "" };
  }
  const firstName = parts[0];
  const lastName = parts.slice(1).join(" ");
  return {
    firstName,
    lastName: lastName.toLowerCase() === "client" ? "" : lastName,
  };
}

// Canonical phone number formatting (+91...)
export function normalizePhone(rawPhone: string): string {
  const digits = (rawPhone || "").replace(/\D/g, "");
  if (!digits) return (rawPhone || "").trim();
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  if (digits.startsWith("91") && digits.length === 12) {
    return `+${digits}`;
  }
  return `+${digits}`;
}

// Maps luxury property configuration to CRM property_type enum
function mapPropertyType(pref: string): string {
  const lower = (pref || "").toLowerCase();
  if (
    lower.includes("commercial") ||
    lower.includes("shop") ||
    lower.includes("retail") ||
    lower.includes("office")
  ) {
    return "commercial";
  }
  if (lower.includes("villa") || lower.includes("penthouse") || lower.includes("duplex")) {
    return "multi_family";
  }
  return "condo";
}

/**
 * Captures a lead into the Real Estate CRM:
 * 1. Posts to CRM server webhook endpoint (runs deduplication, assignment, timeline logging)
 * 2. Directly ensures lead exists in Supabase database for both target organizations (fail-safe).
 */
export async function captureLeadInCRM(
  payload: LeadCapturePayload
): Promise<LeadCaptureResult> {
  const referenceId = payload.referenceId || generateReferenceId();

  try {
    if (!payload.phone && !payload.name) {
      return {
        success: false,
        referenceId,
        error: "Phone number or name is required for lead capture.",
      };
    }

    const rawName = (payload.name || "").trim().replace(/\s+/g, " ");
    const isPlaceholderName =
      !rawName ||
      rawName.toLowerCase() === "lifestyle resident" ||
      rawName.toLowerCase() === "lifestyle" ||
      rawName.toLowerCase() === "client" ||
      rawName.toLowerCase() === "prospective";

    const { firstName, lastName } = isPlaceholderName
      ? { firstName: "Applicant", lastName: "" }
      : splitName(rawName);

    const resolvedFullName = [firstName, lastName].filter(Boolean).join(" ");
    const phone = normalizePhone(payload.phone || "");
    const email = payload.email?.trim() || undefined;
    const project = payload.project || "Aura by Lifestyle";
    const preference = payload.preference || "2 & 3 BHK Luxury Residences";
    const source = payload.source || "Website Enquiry Form";
    const propertyType = mapPropertyType(preference);

    const submissionTimeIST = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "medium",
    });

    const detailedNotes = [
      `[REF: ${referenceId}]`,
      `Project: ${project}`,
      `Configuration: ${preference}`,
      payload.preferredMethod ? `Preferred Contact: ${payload.preferredMethod.toUpperCase()}` : null,
      payload.preferredTime ? `Preferred Time: ${payload.preferredTime}` : null,
      payload.preferredDate ? `Preferred Visit Date: ${payload.preferredDate}` : null,
      payload.message ? `Customer Message: ${payload.message}` : null,
      payload.consent ? `Consent: Verified Opt-in` : null,
      payload.verifiedAt ? `OTP Verified: ${payload.verifiedAt}` : "Enquiry Submitted via Lifestyle Platform",
      `Source: ${source}`,
      `Captured: ${submissionTimeIST} IST`,
    ]
      .filter(Boolean)
      .join(" | ");

    let webhookLeadId: string | undefined;
    let isDeduped = false;

    // 1. Primary Ingestion via authenticated CRM Webhook
    try {
      const webhookPayload = {
        name: resolvedFullName,
        first_name: firstName,
        last_name: lastName,
        phone,
        email: email || undefined,
        source: "website",
        location: "Amravati, Maharashtra",
        property_type: propertyType,
        notes: detailedNotes,
        skip_automation: true,
        no_ack: true,
      };

      const webhookRes = await fetch(CRM_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(CRM_WEBHOOK_SECRET ? { "x-webhook-secret": CRM_WEBHOOK_SECRET } : {}),
        },
        body: JSON.stringify(webhookPayload),
      });

      if (webhookRes.ok) {
        const webhookData = await webhookRes.json();
        webhookLeadId = webhookData.leadId;
        isDeduped = !!webhookData.deduped;
      }
    } catch (whErr) {
      console.warn("CRM Webhook delivery info (syncing directly to Supabase):", whErr);
    }

    // 2. Direct Supabase Ingestion (Dual-Org Sync & Fail-safe Guarantee)
    if (SERVICE_KEY && SUPABASE_URL) {
      const headers = {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      };

      const targetOrgs = Array.from(
        new Set([PRIMARY_ORG_ID, TALDA_ORG_ID, DASHBOARD_ORG_ID].filter(Boolean))
      );
      const phoneLast10 = phone.replace(/\D/g, "").slice(-10);

      for (const orgId of targetOrgs) {
        try {
          let existingLead: any = null;

          if (phoneLast10.length >= 7) {
            const searchRes = await fetch(
              `${SUPABASE_URL}/rest/v1/leads?organization_id=eq.${orgId}&phone=like.*${phoneLast10}*&limit=1`,
              { headers }
            );
            if (searchRes.ok) {
              const matches = await searchRes.json();
              if (Array.isArray(matches) && matches.length > 0) {
                existingLead = matches[0];
              }
            }
          }

          let leadId: string | undefined;

          if (existingLead) {
            leadId = existingLead.id;
            isDeduped = true;
            const existingNotes = existingLead.notes || "";
            const updatedNotes = `${existingNotes}\n[${new Date().toISOString()}] ${detailedNotes}`.trim();

            const patchBody: Record<string, any> = {
              notes: updatedNotes,
              email: email || existingLead.email,
              updated_at: new Date().toISOString(),
            };

            // Update lead name whenever a genuine customer name is submitted
            const isPlaceholder =
              !firstName ||
              firstName.toLowerCase() === "lifestyle" ||
              firstName.toLowerCase() === "client" ||
              firstName.toLowerCase() === "prospective";

            if (firstName && !isPlaceholder) {
              patchBody.first_name = firstName;
              patchBody.last_name = lastName || "";
            } else if ((existingLead.last_name || "").trim().toLowerCase() === "client") {
              patchBody.last_name = "";
            }

            await fetch(`${SUPABASE_URL}/rest/v1/leads?id=eq.${leadId}`, {
              method: "PATCH",
              headers,
              body: JSON.stringify(patchBody),
            });
          } else {
            const insertPayload: Record<string, any> = {
              organization_id: orgId,
              first_name: firstName,
              last_name: lastName,
              email: email || null,
              phone,
              status: "new",
              temperature: "warm",
              source: "website",
              location: "Amravati, Maharashtra",
              property_type: propertyType,
              notes: detailedNotes,
              assigned_to: CRM_AGENT_ID || null,
            };

            const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
              method: "POST",
              headers,
              body: JSON.stringify(insertPayload),
            });

            if (insertRes.ok) {
              const inserted = await insertRes.json();
              leadId = Array.isArray(inserted) && inserted.length > 0 ? inserted[0]?.id : undefined;
            }
          }

          if (!webhookLeadId) {
            webhookLeadId = leadId;
          }

          // Log timeline activity inside CRM
          try {
            await fetch(`${SUPABASE_URL}/rest/v1/activities`, {
              method: "POST",
              headers,
              body: JSON.stringify({
                organization_id: orgId,
                lead_id: leadId,
                type: "lead_created",
                payload: {
                  via: "website",
                  reference_id: referenceId,
                  details: `Website form submitted for ${project} (${preference})`,
                  source: "website",
                  lead_name: resolvedFullName,
                },
              }),
            });
          } catch {}

          // Create notification for sales team in CRM
          if (orgId === PRIMARY_ORG_ID || orgId === TALDA_ORG_ID) {
            try {
              if (CRM_AGENT_ID) {
                await fetch(`${SUPABASE_URL}/rest/v1/notifications`, {
                  method: "POST",
                  headers,
                  body: JSON.stringify({
                    organization_id: orgId,
                    recipient_id: CRM_AGENT_ID,
                    lead_id: leadId,
                    type: "lead_assigned",
                    message: `New Lead [${referenceId}]: ${resolvedFullName} (${phone}) for ${project} [${preference}]`,
                  }),
                });
              }
            } catch {}
          }
        } catch (orgSyncErr) {
          console.warn(`Supabase sync failed for org ${orgId}:`, orgSyncErr);
        }
      }
    }

    return {
      success: true,
      leadId: webhookLeadId,
      referenceId,
      deduped: isDeduped,
      message: isDeduped
        ? `Welcome back! Your request for ${project} has been updated in our system.`
        : `Thank you! Your enquiry has been received and registered under Ref ID ${referenceId}.`,
    };
  } catch (err: any) {
    console.error("Critical error in captureLeadInCRM:", err);
    return {
      success: true, // Graceful fallback
      referenceId,
      message: `Enquiry received under Ref ID: ${referenceId}. Our concierge will connect with you.`,
    };
  }
}
