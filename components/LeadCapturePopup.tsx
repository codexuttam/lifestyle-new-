"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { submitLead } from "@/lib/leads/submitLead";
import styles from "./LeadCapturePopup.module.css";

interface LeadCapturePopupProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called once the lead has been accepted by the server. */
  onSubmitted?: () => void;
  project: string;
  preference?: string;
  /** Recorded in the CRM notes, e.g. "VSL Popup (Home Page)". */
  source: string;
  title?: string;
  subtitle?: string;
  submitLabel?: string;
}

/**
 * Short "Book Your Site Visit" form shown after (or during) the VSL.
 * Name + mobile + consent only — no unnecessary personal data.
 */
export default function LeadCapturePopup({
  isOpen,
  onClose,
  onSubmitted,
  project,
  preference,
  source,
  title = "Book Your Site Visit",
  subtitle = "Interested in finding your new home? Leave your details and our team will contact you.",
  submitLabel = "Request a Callback",
}: LeadCapturePopupProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const isSubmittingRef = useRef(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    // Focus the first field for keyboard / screen-reader users.
    const t = setTimeout(() => nameInputRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmittingRef.current) return;

    const digits = phone.replace(/\D/g, "");
    if (name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (digits.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!consent) {
      setError("Please agree to be contacted so our team can call you back.");
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setError(null);

    const form = new FormData(event.currentTarget);

    try {
      // submitLead fires Meta "Lead" only after the CRM confirms the save.
      const result = await submitLead({
        name: name.trim(),
        phone: digits,
        project,
        preference,
        source,
        consent: true,
        website: String(form.get("website") ?? ""),
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setReferenceId(result.referenceId || "Received");
      onSubmitted?.();
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-popup-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.card}>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
          ✕
        </button>

        {referenceId ? (
          <div className={styles.success} role="status" aria-live="polite">
            <div className={styles.successIcon} aria-hidden="true">
              ✓
            </div>
            <h3 className={styles.title}>Thank you!</h3>
            <p className={styles.subtitle}>
              Your request has been received
              {referenceId !== "Received" ? (
                <>
                  {" "}
                  under Reference ID <strong>{referenceId}</strong>
                </>
              ) : null}
              . Our team will call you shortly to schedule your visit.
            </p>
            <button type="button" className={styles.submit} onClick={onClose}>
              Continue Browsing
            </button>
          </div>
        ) : (
          <>
            <span className={styles.eyebrow}>{project}</span>
            <h3 id="lead-popup-title" className={styles.title}>
              {title}
            </h3>
            <p className={styles.subtitle}>{subtitle}</p>

            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              <label className={styles.label}>
                Full name
                <input
                  ref={nameInputRef}
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.input}
                  placeholder="Your full name"
                  maxLength={120}
                />
              </label>

              <label className={styles.label}>
                Mobile number
                <input
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^\d+\s-]/g, ""))}
                  className={styles.input}
                  placeholder="10-digit mobile number"
                  maxLength={16}
                />
              </label>

              {/* Honeypot: hidden from real visitors */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                className={styles.honeypot}
                aria-hidden="true"
              />

              <label className={styles.consent}>
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <span>
                  I agree to be contacted by Lifestyle Home Spaces by phone/WhatsApp about this
                  enquiry. See our <a href="/privacy">Privacy Policy</a>.
                </span>
              </label>

              {error && (
                <p className={styles.error} role="alert">
                  {error}
                </p>
              )}

              <button type="submit" className={styles.submit} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : submitLabel}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

