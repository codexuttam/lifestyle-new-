"use client";

import React, { useState, useEffect } from "react";
import { getLifestyleConciergeWhatsAppUrl } from "@/lib/services/whatsappService";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle?: string;
  defaultPreference?: string;
}

export default function EnquiryModal({
  isOpen,
  onClose,
  projectTitle = "Aura by Lifestyle",
  defaultPreference = "2 & 3 BHK Luxury Residences",
}: EnquiryModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [referenceId, setReferenceId] = useState<string | null>(null);

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
          if (user.phone) setPhone(user.phone);
          if (user.email) setEmail(user.email);
        }
      } catch {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          project: projectTitle,
          preference: defaultPreference,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Failed to submit enquiry. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setReferenceId(data.referenceId || "LHS-2026-VIP");
      setIsSubmitting(false);
    } catch {
      setError("Network connection issue. Please connect with us directly on WhatsApp.");
      setIsSubmitting(false);
    }
  }

  const waUrl = getLifestyleConciergeWhatsAppUrl(
    `Hello Lifestyle Homes team, I submitted an enquiry for ${projectTitle} under Ref ID ${referenceId || ""}. Please share pricing details.`
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(6, 9, 14, 0.85)",
        backdropFilter: "blur(12px)",
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
          maxWidth: "460px",
          background: "linear-gradient(135deg, #11141b 0%, #0a0d13 100%)",
          border: "1px solid rgba(212, 175, 55, 0.35)",
          borderRadius: "20px",
          padding: "2rem",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(212, 175, 55, 0.15)",
          color: "#ffffff",
          position: "relative",
          animation: "modalFadeIn 0.25s ease-out",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close"
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            color: "#ffffff",
            fontSize: "1.2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          ✕
        </button>

        {referenceId ? (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <div
              style={{
                width: "60px",
                height: "60px",
                margin: "0 auto 1.25rem",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #d4af37, #e84393)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.8rem",
              }}
            >
              ✓
            </div>
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                background: "linear-gradient(135deg, #f5d77f, #e84393)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "0.5rem",
              }}
            >
              Enquiry Received!
            </h3>
            <p style={{ color: "rgba(255, 255, 255, 0.75)", fontSize: "0.92rem", marginBottom: "1rem" }}>
              Your enquiry has been saved directly in our Real Estate CRM under Reference ID:
            </p>
            <div
              style={{
                display: "inline-block",
                padding: "0.5rem 1.4rem",
                borderRadius: "8px",
                background: "rgba(212, 175, 55, 0.15)",
                border: "1px solid rgba(212, 175, 55, 0.45)",
                color: "#f5d77f",
                fontWeight: 700,
                letterSpacing: "1px",
                marginBottom: "1.5rem",
                fontSize: "1.1rem",
              }}
            >
              {referenceId}
            </div>
            <p style={{ color: "rgba(255, 255, 255, 0.65)", fontSize: "0.85rem", marginBottom: "1.75rem" }}>
              Our sales concierge will connect with you shortly regarding {projectTitle}.
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
                  padding: "0.85rem 1.5rem",
                  borderRadius: "9999px",
                  background: "#25D366",
                  color: "#ffffff",
                  fontWeight: 600,
                  textDecoration: "none",
                  boxShadow: "0 6px 20px rgba(37, 211, 102, 0.3)",
                }}
              >
                <i className="fa-brands fa-whatsapp" /> Chat on WhatsApp Now
              </a>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: "0.75rem 1.5rem",
                  borderRadius: "9999px",
                  background: "transparent",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "rgba(255, 255, 255, 0.75)",
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
                  padding: "0.25rem 0.75rem",
                  borderRadius: "9999px",
                  background: "linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(232, 67, 147, 0.15))",
                  border: "1px solid rgba(212, 175, 55, 0.35)",
                  color: "#f5d77f",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  marginBottom: "0.6rem",
                }}
              >
                Instant Enquiry
              </span>
              <h3
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  color: "#ffffff",
                  margin: 0,
                }}
              >
                Connect with Sales Team
              </h3>
              <p style={{ color: "rgba(255, 255, 255, 0.65)", fontSize: "0.85rem", marginTop: "0.3rem" }}>
                For {projectTitle} &middot; Amravati
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "1.1rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    color: "rgba(255, 255, 255, 0.8)",
                    marginBottom: "0.35rem",
                    fontWeight: 500,
                  }}
                >
                  Full Name <span style={{ color: "#e84393" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Patil"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "0.85rem 1rem",
                    borderRadius: "10px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(212, 175, 55, 0.3)",
                    color: "#ffffff",
                    fontSize: "0.95rem",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ marginBottom: "1.1rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    color: "rgba(255, 255, 255, 0.8)",
                    marginBottom: "0.35rem",
                    fontWeight: 500,
                  }}
                >
                  Mobile Number <span style={{ color: "#e84393" }}>*</span>
                </label>
                <input
                  type="tel"
                  placeholder="10-digit Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "0.85rem 1rem",
                    borderRadius: "10px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(212, 175, 55, 0.3)",
                    color: "#ffffff",
                    fontSize: "0.95rem",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    color: "rgba(255, 255, 255, 0.7)",
                    marginBottom: "0.35rem",
                    fontWeight: 500,
                  }}
                >
                  Email Address <span style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "0.78rem" }}>(Optional)</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. rahul@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.85rem 1rem",
                    borderRadius: "10px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(212, 175, 55, 0.2)",
                    color: "#ffffff",
                    fontSize: "0.95rem",
                    outline: "none",
                  }}
                />
              </div>

              {error && (
                <div
                  style={{
                    marginBottom: "1rem",
                    padding: "0.65rem 0.9rem",
                    background: "rgba(232, 67, 147, 0.15)",
                    border: "1px solid rgba(232, 67, 147, 0.4)",
                    borderRadius: "8px",
                    color: "#ff7675",
                    fontSize: "0.85rem",
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
                  padding: "0.95rem 1.5rem",
                  borderRadius: "9999px",
                  background: "linear-gradient(135deg, #d4af37 0%, #e84393 100%)",
                  color: "#0a0a0c",
                  fontWeight: 700,
                  fontSize: "0.98rem",
                  border: "none",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  boxShadow: "0 8px 24px rgba(212, 175, 55, 0.25)",
                  opacity: isSubmitting ? 0.7 : 1,
                  transition: "all 0.2s ease",
                }}
              >
                {isSubmitting ? "Submitting to CRM..." : "Submit Enquiry"}
              </button>

              <p
                style={{
                  marginTop: "0.9rem",
                  fontSize: "0.75rem",
                  color: "rgba(255, 255, 255, 0.45)",
                  textAlign: "center",
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
