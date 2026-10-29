/**
 * Browser-side helper shared by every lead form (enquiry modal, contact form,
 * VSL popup, chatbot, blog enquiry).
 *
 * Rules:
 * - The lead is POSTed to our own /api/leads route (never straight to the CRM,
 *   so no CRM credentials ever reach the browser).
 * - Meta's standard `Lead` event fires ONLY when the server confirms the CRM
 *   actually saved the lead (`crmSaved: true` + a referenceId).
 * - Failed requests, validation errors and honeypot (bot) submissions never fire `Lead`.
 */

export interface LeadSubmission {
  name: string;
  phone: string;
  email?: string;
  project?: string;
  preference?: string;
  message?: string;
  source?: string;
  consent?: boolean;
  /** Honeypot field: always empty for real visitors. */
  website?: string;
}

export type LeadSubmitResult =
  | { ok: true; referenceId: string; message?: string; crmSaved: boolean }
  | { ok: false; error: string };

const LEAD_SUBMITTED_KEY = "lifestyle_lead_submitted";

type FbqWindow = Window & { fbq?: (...args: unknown[]) => void };

/** Fires Meta Pixel's standard Lead event, if the pixel is loaded. */
export function trackMetaLead(): void {
  if (typeof window === "undefined") return;
  const { fbq } = window as FbqWindow;
  if (typeof fbq === "function") {
    fbq("track", "Lead");
  }
}

/** True if this browser has already submitted a lead (used to avoid re-showing popups). */
export function hasSubmittedLead(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(LEAD_SUBMITTED_KEY) === "1";
  } catch {
    return false;
  }
}

export function markLeadSubmitted(): void {
  try {
    localStorage.setItem(LEAD_SUBMITTED_KEY, "1");
  } catch {
    /* storage unavailable (private mode) — safe to ignore */
  }
}

export async function submitLead(payload: LeadSubmission): Promise<LeadSubmitResult> {
  try {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data?.ok === false) {
      return {
        ok: false,
        error: data?.error || "We couldn't save your enquiry. Please try again.",
      };
    }

    const referenceId: string = data?.referenceId || "";
    const crmSaved = data?.crmSaved === true && Boolean(referenceId);

    // Fire only after the CRM confirms the save.
    if (crmSaved) {
      trackMetaLead();
    }

    markLeadSubmitted();
    return { ok: true, referenceId, message: data?.message, crmSaved };
  } catch {
    return {
      ok: false,
      error: "Network connection issue. Please check your internet and try again.",
    };
  }
}

