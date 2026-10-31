"use client";

import React, { useState, useEffect, useRef } from "react";
import { getLifestyleConciergeWhatsAppUrl } from "@/lib/services/whatsappService";
import { submitLead } from "@/lib/leads/submitLead";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle?: string;
  defaultPreference?: string;
  source?: string;
}

export default function EnquiryModal({
  isOpen,
  onClose,
  projectTitle = "Aura by Lifestyle",
  defaultPreference = "2 & 3 BHK Luxury Residences",
  source = "Website Enquiry Form",
}: EnquiryModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setReferenceId(null);
      // Pre-fill from verified session if available
      try {
        const saved = localStorage.getItem("lifestyle_verified_user");
        if (saved) {
          const user = JSON.parse(saved);
          if (user.name) setName(user.name);
          if (user.phone) setPhone(user.phone.replace(/\D/g, "").slice(-10));
          if (user.email) setEmail(user.email);
        }
      } catch {}
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Prevent duplicate submissions while a request is in progress.
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await submitLead({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        project: projectTitle,
        preference: defaultPreference,
        source: source || "Website Enquiry Form",
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      // Meta "Lead" is fired inside submitLead, only after the CRM confirms the save.
      setReferenceId(result.referenceId || "LHS-2026-VIP");
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  const waUrl = getLifestyleConciergeWhatsAppUrl(
    `Hello Lifestyle Homes team, I submitted an enquiry for ${projectTitle} under Ref ID ${referenceId || ""}. Please share pricing & walkthrough details.`
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100005,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(4, 6, 10, 0.78)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        padding: "1rem",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          background: "#201005",
          border: "1px solid rgba(184, 174, 166, 0.28)",
          borderRadius: "24px",
          padding: "2.25rem 2rem",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(184, 174, 166, 0.12)",
          color: "#F8F5F3",
          position: "relative",
          animation: "modalFadeIn 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <style>{`
          @keyframes modalFadeIn {
            from { opacity: 0; transform: scale(0.96) translateY(12px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>

        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close dialog"
          style={{
            position: "absolute",
            top: "1.2rem",
            right: "1.2rem",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "rgba(184, 174, 166, 0.08)",
            border: "1px solid rgba(184, 174, 166, 0.2)",
            color: "#AEA399",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#B8AEA6";
            e.currentTarget.style.borderColor = "#B8AEA6";
            e.currentTarget.style.color = "#201005";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(184, 174, 166, 0.08)";
            e.currentTarget.style.borderColor = "rgba(184, 174, 166, 0.2)";
            e.currentTarget.style.color = "#AEA399";
          }}
        >
          ✕
        </button>

        {referenceId ? (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                margin: "0 auto 1.25rem",
                borderRadius: "50%",
                background: "rgba(184, 174, 166, 0.15)",
                border: "1px solid rgba(184, 174, 166, 0.35)",
                color: "#F8F5F3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.6rem",
              }}
            >
              ✓
            </div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.6rem",
                fontWeight: 500,
                color: "#F8F5F3",
                marginBottom: "0.5rem",
                textTransform: "uppercase",
              }}
            >
              Enquiry Received
            </h3>
            <p style={{ color: "#AEA399", fontSize: "0.85rem", marginBottom: "1rem", fontFamily: "var(--font-sans)" }}>
              Your enquiry has been registered in our central real estate system under Reference ID:
            </p>
            <div
              style={{
                display: "inline-block",
                padding: "0.45rem 1.25rem",
                borderRadius: "8px",
                background: "rgba(184, 174, 166, 0.12)",
                border: "1px solid rgba(184, 174, 166, 0.3)",
                color: "#F8F5F3",
                fontWeight: 700,
                letterSpacing: "1px",
                marginBottom: "1.25rem",
                fontSize: "1rem",
                fontFamily: "var(--font-sans)",
              }}
            >
              {referenceId}
            </div>
            <p style={{ color: "rgba(248, 245, 243, 0.72)", fontSize: "0.82rem", marginBottom: "1.5rem", fontFamily: "var(--font-sans)" }}>
              Our sales team will connect with you shortly regarding {projectTitle}.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "12px 20px",
                  borderRadius: "9999px",
                  background: "#B8AEA6",
                  color: "#201005",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 600,
                  fontSize: "11px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                Chat on WhatsApp Now
              </a>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: "10px",
                  borderRadius: "9999px",
                  background: "transparent",
                  border: "1px solid rgba(184, 174, 166, 0.25)",
                  color: "#AEA399",
                  fontFamily: "var(--font-sans)",
                  fontSize: "11px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: "1.5rem" }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  borderRadius: "9999px",
                  background: "rgba(184, 174, 166, 0.12)",
                  border: "1px solid rgba(184, 174, 166, 0.3)",
                  color: "#AEA399",
                  fontSize: "9.5px",
                  fontWeight: 600,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  marginBottom: "0.5rem",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Official Project Enquiry
              </span>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.6rem",
                  fontWeight: 500,
                  color: "#F8F5F3",
                  margin: 0,
                  lineHeight: 1.1,
                  textTransform: "uppercase",
                }}
              >
                Connect with Sales Team
              </h3>
              <p style={{ color: "#AEA399", fontSize: "0.82rem", marginTop: "0.35rem", fontFamily: "var(--font-sans)" }}>
                For {projectTitle} &middot; Amravati
              </p>
            </div>

            {/* Exactly 3 Fields: Name (required), Phone (required), Email (optional) */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: "var(--font-sans)",
                    fontSize: "9.5px",
                    fontWeight: 600,
                    color: "#AEA399",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    marginBottom: "0.4rem",
                  }}
                >
                  Full Name <span style={{ color: "#B8AEA6" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "12px",
                    background: "rgba(248, 245, 243, 0.05)",
                    border: "1px solid rgba(184, 174, 166, 0.22)",
                    color: "#F8F5F3",
                    fontSize: "0.88rem",
                    fontFamily: "var(--font-sans)",
                    outline: "none",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#B8AEA6";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(184, 174, 166, 0.22)";
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: "var(--font-sans)",
                    fontSize: "9.5px",
                    fontWeight: 600,
                    color: "#AEA399",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    marginBottom: "0.4rem",
                  }}
                >
                  Mobile Number <span style={{ color: "#B8AEA6" }}>*</span>
                </label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <div
                    style={{
                      padding: "10px 12px",
                      background: "rgba(184, 174, 166, 0.08)",
                      border: "1px solid rgba(184, 174, 166, 0.22)",
                      borderRadius: "12px",
                      color: "#AEA399",
                      fontWeight: 600,
                      fontSize: "0.88rem",
                      fontFamily: "var(--font-sans)",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    +91
                  </div>
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    style={{
                      flex: 1,
                      padding: "10px 14px",
                      borderRadius: "12px",
                      background: "rgba(248, 245, 243, 0.05)",
                      border: "1px solid rgba(184, 174, 166, 0.22)",
                      color: "#F8F5F3",
                      fontSize: "0.88rem",
                      fontFamily: "var(--font-sans)",
                      outline: "none",
                      transition: "all 0.2s ease",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#B8AEA6";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(184, 174, 166, 0.22)";
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: "var(--font-sans)",
                    fontSize: "9.5px",
                    fontWeight: 600,
                    color: "#AEA399",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    marginBottom: "0.4rem",
                  }}
                >
                  Email Address <span style={{ color: "rgba(248, 245, 243, 0.45)", textTransform: "none" }}>(Optional)</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "12px",
                    background: "rgba(248, 245, 243, 0.05)",
                    border: "1px solid rgba(184, 174, 166, 0.22)",
                    color: "#F8F5F3",
                    fontSize: "0.88rem",
                    fontFamily: "var(--font-sans)",
                    outline: "none",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#B8AEA6";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(184, 174, 166, 0.22)";
                  }}
                />
              </div>

              {error && (
                <div
                  style={{
                    padding: "8px 12px",
                    background: "rgba(239, 68, 68, 0.12)",
                    border: "1px solid rgba(239, 68, 68, 0.35)",
                    borderRadius: "8px",
                    color: "#ef4444",
                    fontSize: "0.82rem",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  padding: "13px 20px",
                  borderRadius: "9999px",
                  background: "#B8AEA6",
                  color: "#201005",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 600,
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  border: "none",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  opacity: isSubmitting ? 0.75 : 1,
                  transition: "all 0.2s ease",
                  marginTop: "0.25rem",
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.background = "#F8F5F3";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#B8AEA6";
                }}
              >
                {isSubmitting ? "Connecting to sales desk..." : "Submit Enquiry →"}
              </button>

              <p
                style={{
                  marginTop: "0.4rem",
                  fontSize: "0.74rem",
                  color: "#AEA399",
                  textAlign: "center",
                  fontFamily: "var(--font-sans)",
                }}
              >
                MahaRERA Registered. Your information is securely handled.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
