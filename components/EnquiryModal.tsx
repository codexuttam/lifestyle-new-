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
          background: "rgba(13, 15, 13, 0.98)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "24px",
          padding: "2.25rem 2rem",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(191, 149, 63, 0.15)",
          color: "#ffffff",
          position: "relative",
          animation: "modalFadeIn 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <style>{`
          @keyframes modalFadeIn {
            from { opacity: 0; transform: scale(0.95) translateY(16px); }
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
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            color: "rgba(255, 255, 255, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#c5a880";
            e.currentTarget.style.borderColor = "#c5a880";
            e.currentTarget.style.color = "#101216";
            e.currentTarget.style.transform = "rotate(90deg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
            e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
            e.currentTarget.style.transform = "rotate(0deg)";
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
                background: "rgba(22, 163, 74, 0.15)",
                border: "1px solid rgba(22, 163, 74, 0.35)",
                color: "#16a34a",
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
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#ffffff",
                marginBottom: "0.5rem",
              }}
            >
              Enquiry Received!
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "1rem", fontFamily: "var(--font-montserrat), sans-serif" }}>
              Your enquiry has been registered in our central real estate system under Reference ID:
            </p>
            <div
              style={{
                display: "inline-block",
                padding: "0.45rem 1.25rem",
                borderRadius: "8px",
                background: "rgba(197, 168, 128, 0.12)",
                border: "1px solid rgba(197, 168, 128, 0.3)",
                color: "#c5a880",
                fontWeight: 700,
                letterSpacing: "1px",
                marginBottom: "1.25rem",
                fontSize: "1rem",
                fontFamily: "var(--font-montserrat), sans-serif",
              }}
            >
              {referenceId}
            </div>
            <p style={{ color: "#64748b", fontSize: "0.82rem", marginBottom: "1.5rem", fontFamily: "var(--font-montserrat), sans-serif" }}>
              Our sales team will connect with you shortly regarding {projectTitle}. 🤝
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
                  borderRadius: "12px",
                  background: "#16a34a",
                  color: "#ffffff",
                  fontFamily: "var(--font-montserrat), sans-serif",
                  fontWeight: 700,
                  fontSize: "11px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  boxShadow: "0 6px 20px rgba(22, 163, 74, 0.3)",
                }}
              >
                <i className="fa-brands fa-whatsapp" style={{ fontSize: "1rem" }} /> Chat on WhatsApp Now
              </a>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: "10px",
                  borderRadius: "12px",
                  background: "transparent",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#94a3b8",
                  fontFamily: "var(--font-montserrat), sans-serif",
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
                  padding: "3px 10px",
                  borderRadius: "9999px",
                  background: "rgba(191, 149, 63, 0.12)",
                  border: "1px solid rgba(191, 149, 63, 0.25)",
                  color: "#c5a880",
                  fontSize: "9.5px",
                  fontWeight: 700,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  marginBottom: "0.5rem",
                  fontFamily: "var(--font-montserrat), sans-serif",
                }}
              >
                Instant Enquiry
              </span>
              <h3
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontSize: "1.45rem",
                  fontWeight: 700,
                  color: "#ffffff",
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                Connect with Sales Team
              </h3>
              <p style={{ color: "#94a3b8", fontSize: "0.82rem", marginTop: "0.35rem", fontFamily: "var(--font-montserrat), sans-serif" }}>
                For {projectTitle} &middot; Amravati
              </p>
            </div>

            {/* Exactly 3 Fields: Name (required), Phone (required), Email (optional) */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: "var(--font-montserrat), sans-serif",
                    fontSize: "9.5px",
                    fontWeight: 700,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    marginBottom: "0.4rem",
                  }}
                >
                  Full Name <span style={{ color: "#c5a880" }}>*</span>
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
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    color: "#ffffff",
                    fontSize: "0.88rem",
                    fontFamily: "var(--font-montserrat), sans-serif",
                    outline: "none",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#c5a880";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(191, 149, 63, 0.18)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: "var(--font-montserrat), sans-serif",
                    fontSize: "9.5px",
                    fontWeight: 700,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    marginBottom: "0.4rem",
                  }}
                >
                  Mobile Number <span style={{ color: "#c5a880" }}>*</span>
                </label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <div
                    style={{
                      padding: "10px 12px",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: "12px",
                      color: "#c5a880",
                      fontWeight: 700,
                      fontSize: "0.88rem",
                      fontFamily: "var(--font-montserrat), sans-serif",
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
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      color: "#ffffff",
                      fontSize: "0.88rem",
                      fontFamily: "var(--font-montserrat), sans-serif",
                      outline: "none",
                      transition: "all 0.2s ease",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#c5a880";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(197, 168, 128, 0.18)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: "var(--font-montserrat), sans-serif",
                    fontSize: "9.5px",
                    fontWeight: 700,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    marginBottom: "0.4rem",
                  }}
                >
                  Email Address <span style={{ color: "#64748b", textTransform: "none" }}>(Optional)</span>
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
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    color: "#ffffff",
                    fontSize: "0.88rem",
                    fontFamily: "var(--font-montserrat), sans-serif",
                    outline: "none",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#c5a880";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(197, 168, 128, 0.18)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
                    e.currentTarget.style.boxShadow = "none";
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
                    fontFamily: "var(--font-montserrat), sans-serif",
                  }}
                >
                  {error}
                </div>
              )}

              {/* Refined Champagne Bronze Primary CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  padding: "12px 20px",
                  borderRadius: "12px",
                  background: "#c5a880",
                  color: "#101216",
                  fontFamily: "var(--font-montserrat), sans-serif",
                  fontWeight: 700,
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  border: "none",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  boxShadow: "0 8px 24px rgba(197, 168, 128, 0.25)",
                  opacity: isSubmitting ? 0.75 : 1,
                  transition: "all 0.2s ease",
                  marginTop: "0.25rem",
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.background = "#d6be9f";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#c5a880";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {isSubmitting ? "Connecting to sales desk..." : "Submit Enquiry ↗"}
              </button>

              <p
                style={{
                  marginTop: "0.4rem",
                  fontSize: "0.74rem",
                  color: "#64748b",
                  textAlign: "center",
                  fontFamily: "var(--font-montserrat), sans-serif",
                }}
              >
                🔒 MahaRERA Registered. Your information is securely handled.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
