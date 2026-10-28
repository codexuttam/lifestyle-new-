"use client";

import { useState, type FormEvent } from "react";
import { getLifestyleConciergeWhatsAppUrl } from "@/lib/services/whatsappService";

type Status = "idle" | "sending" | "sent" | "error";

const BLANK = {
  name: "",
  phone: "",
  email: "",
};

export default function ContactForm() {
  const [values, setValues] = useState(BLANK);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [referenceId, setReferenceId] = useState<string>("");

  function set(key: keyof typeof BLANK, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError(null);

    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          phone: values.phone.trim(),
          email: values.email.trim() || undefined,
          project: "Aura by Lifestyle",
          preference: "2 & 3 BHK Luxury Residences",
          // Hidden from real users; only a bot fills it in.
          website: String(form.get("website") ?? ""),
        }),
      });

      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(
          body?.error ?? "Something went wrong. Please connect with us directly on WhatsApp."
        );
        setStatus("error");
        return;
      }

      // Track Meta Pixel Lead event after successful CRM lead creation
      if (typeof window !== "undefined" && typeof (window as any).fbq === "function") {
        (window as any).fbq("track", "Lead");
      }

      setReferenceId(body.referenceId || "LHS-2026-VIP");
      setValues(BLANK);
      setStatus("sent");
    } catch {
      setError("Network connection issue. Please connect with us directly on WhatsApp.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    const waUrl = getLifestyleConciergeWhatsAppUrl(
      `Hello Lifestyle Homes team, I submitted an enquiry for Aura by Lifestyle under Ref ID ${referenceId || ""}. Please share pricing details.`
    );

    return (
      <div
        id="form-success"
        className="form-success"
        role="status"
        aria-live="polite"
        style={{
          background: "rgba(17, 21, 30, 0.95)",
          border: "1px solid rgba(194, 26, 34, 0.3)",
          borderRadius: "20px",
          padding: "2.5rem 2rem",
          textAlign: "center",
          color: "#fff",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(194, 26, 34, 0.15)",
        }}
      >
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
            fontSize: "1.6rem",
            fontWeight: 700,
            color: "#ffffff",
            marginBottom: "0.5rem",
          }}
        >
          Enquiry Received!
        </h3>
        <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1rem", fontFamily: "var(--font-montserrat), sans-serif" }}>
          Your enquiry has been registered in our Real Estate CRM under Reference ID:
        </p>
        <div
          style={{
            display: "inline-block",
            padding: "0.45rem 1.25rem",
            borderRadius: "8px",
            background: "rgba(194, 26, 34, 0.12)",
            border: "1px solid rgba(194, 26, 34, 0.3)",
            color: "#c21a22",
            fontWeight: 700,
            letterSpacing: "1px",
            marginBottom: "1.5rem",
            fontFamily: "var(--font-montserrat), sans-serif",
          }}
        >
          {referenceId}
        </div>
        <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "1.5rem", fontFamily: "var(--font-montserrat), sans-serif" }}>
          Our sales director and engineering team will reach out to schedule your personalized site walkthrough.
        </p>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.6rem",
            padding: "12px 24px",
            borderRadius: "12px",
            background: "#16a34a",
            color: "#ffffff",
            fontFamily: "var(--font-montserrat), sans-serif",
            fontWeight: 700,
            fontSize: "11px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            textDecoration: "none",
            boxShadow: "0 8px 24px rgba(22, 163, 74, 0.3)",
          }}
        >
          <i className="fa-brands fa-whatsapp" style={{ fontSize: "1rem" }} /> Chat on WhatsApp Now
        </a>
      </div>
    );
  }

  return (
    <form id="booking-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
      {/* Honeypot: off-screen and skipped by tab order, so only bots fill it. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
      />

      {/* Field 1: Full Name (Required) */}
      <div className="form-group">
        <label
          htmlFor="name"
          style={{
            display: "block",
            marginBottom: "0.4rem",
            fontSize: "9.5px",
            color: "#94a3b8",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            fontFamily: "var(--font-montserrat), sans-serif",
          }}
        >
          Full Name <span style={{ color: "#c21a22" }}>*</span>
        </label>
        <input
          type="text"
          id="name"
          placeholder="e.g. Rajesh Sharma"
          value={values.name}
          onChange={(event) => set("name", event.target.value)}
          required
          style={{
            width: "100%",
            padding: "11px 14px",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "12px",
            color: "#ffffff",
            fontSize: "0.9rem",
            fontFamily: "var(--font-montserrat), sans-serif",
            outline: "none",
            transition: "all 0.2s ease",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#c21a22";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(194, 26, 34, 0.18)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
      </div>

      {/* Field 2: Mobile Number (Required) */}
      <div className="form-group">
        <label
          htmlFor="phone"
          style={{
            display: "block",
            marginBottom: "0.4rem",
            fontSize: "9.5px",
            color: "#94a3b8",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            fontFamily: "var(--font-montserrat), sans-serif",
          }}
        >
          Mobile Number <span style={{ color: "#c21a22" }}>*</span>
        </label>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <div
            style={{
              padding: "11px 12px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "12px",
              color: "#c21a22",
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
            id="phone"
            placeholder="10-digit Mobile Number"
            value={values.phone}
            onChange={(event) => set("phone", event.target.value)}
            required
            style={{
              flex: 1,
              padding: "11px 14px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "12px",
              color: "#ffffff",
              fontSize: "0.9rem",
              fontFamily: "var(--font-montserrat), sans-serif",
              outline: "none",
              transition: "all 0.2s ease",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#c21a22";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(194, 26, 34, 0.18)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>
      </div>

      {/* Field 3: Email Address (Optional) */}
      <div className="form-group">
        <label
          htmlFor="email"
          style={{
            display: "block",
            marginBottom: "0.4rem",
            fontSize: "9.5px",
            color: "#94a3b8",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            fontFamily: "var(--font-montserrat), sans-serif",
          }}
        >
          Email Address <span style={{ color: "#64748b", textTransform: "none" }}>(Optional)</span>
        </label>
        <input
          type="email"
          id="email"
          placeholder="e.g. rajesh@example.com"
          value={values.email}
          onChange={(event) => set("email", event.target.value)}
          style={{
            width: "100%",
            padding: "11px 14px",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "12px",
            color: "#ffffff",
            fontSize: "0.9rem",
            fontFamily: "var(--font-montserrat), sans-serif",
            outline: "none",
            transition: "all 0.2s ease",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#c21a22";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(194, 26, 34, 0.18)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
      </div>

      {error && (
        <div
          role="alert"
          style={{
            padding: "8px 12px",
            background: "rgba(239, 68, 68, 0.12)",
            border: "1px solid rgba(239, 68, 68, 0.35)",
            borderRadius: "8px",
            color: "#ef4444",
            fontSize: "0.85rem",
            fontFamily: "var(--font-montserrat), sans-serif",
          }}
        >
          {error}
        </div>
      )}

      {/* Lotlite SIEC Wine Primary CTA */}
      <button
        type="submit"
        disabled={status === "sending"}
        style={{
          width: "100%",
          padding: "14px 20px",
          borderRadius: "12px",
          background: "#c21a22",
          color: "#ffffff",
          fontFamily: "var(--font-montserrat), sans-serif",
          fontWeight: 700,
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          border: "none",
          cursor: status === "sending" ? "not-allowed" : "pointer",
          boxShadow: "0 8px 24px rgba(194, 26, 34, 0.3)",
          transition: "all 0.2s ease",
          opacity: status === "sending" ? 0.75 : 1,
          marginTop: "0.25rem",
        }}
        onMouseEnter={(e) => {
          if (status !== "sending") {
            e.currentTarget.style.background = "#9e1218";
            e.currentTarget.style.transform = "translateY(-1px)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#c21a22";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {status === "sending" ? "Submitting to CRM..." : "Request Exclusive Callback & Visit"}
      </button>

      <p
        style={{
          marginTop: "0.4rem",
          fontSize: "0.75rem",
          color: "#64748b",
          textAlign: "center",
          fontFamily: "var(--font-montserrat), sans-serif",
        }}
      >
        🔒 Official MahaRERA Registered Developer. Your information is securely registered in our CRM.
      </p>
    </form>
  );
}
