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
          background: "linear-gradient(135deg, rgba(212, 175, 55, 0.12), rgba(232, 67, 147, 0.08))",
          border: "1px solid rgba(212, 175, 55, 0.35)",
          borderRadius: "16px",
          padding: "2rem",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            margin: "0 auto 1.25rem",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #d4af37, #e84393)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.75rem",
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
        <p style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1rem" }}>
          Your enquiry has been registered in our Real Estate CRM under Reference ID:
        </p>
        <div
          style={{
            display: "inline-block",
            padding: "0.4rem 1.2rem",
            borderRadius: "8px",
            background: "rgba(212, 175, 55, 0.15)",
            border: "1px solid rgba(212, 175, 55, 0.4)",
            color: "#f5d77f",
            fontWeight: 700,
            letterSpacing: "1px",
            marginBottom: "1.5rem",
          }}
        >
          {referenceId}
        </div>
        <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.88rem", marginBottom: "1.5rem" }}>
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
            padding: "0.85rem 1.75rem",
            borderRadius: "9999px",
            background: "#25D366",
            color: "#ffffff",
            fontWeight: 600,
            textDecoration: "none",
            boxShadow: "0 8px 24px rgba(37, 211, 102, 0.3)",
          }}
        >
          <i className="fa-brands fa-whatsapp" /> Chat on WhatsApp Now
        </a>
      </div>
    );
  }

  return (
    <form id="booking-form" onSubmit={handleSubmit}>
      {/* Honeypot: off-screen and skipped by tab order, so only bots fill it. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
      />

      <div className="form-group" style={{ marginBottom: "1.25rem" }}>
        <label
          htmlFor="name"
          style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.8)", fontWeight: 500 }}
        >
          Full Name <span style={{ color: "#e84393" }}>*</span>
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
            padding: "0.9rem 1.1rem",
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(212, 175, 55, 0.3)",
            borderRadius: "10px",
            color: "#ffffff",
            fontSize: "0.95rem",
          }}
        />
      </div>

      <div className="form-group" style={{ marginBottom: "1.25rem" }}>
        <label
          htmlFor="phone"
          style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.8)", fontWeight: 500 }}
        >
          Phone Number <span style={{ color: "#e84393" }}>*</span>
        </label>
        <input
          type="tel"
          id="phone"
          placeholder="10-digit Mobile Number"
          value={values.phone}
          onChange={(event) => set("phone", event.target.value)}
          required
          style={{
            width: "100%",
            padding: "0.9rem 1.1rem",
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(212, 175, 55, 0.3)",
            borderRadius: "10px",
            color: "#ffffff",
            fontSize: "0.95rem",
          }}
        />
      </div>

      <div className="form-group" style={{ marginBottom: "1.75rem" }}>
        <label
          htmlFor="email"
          style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.7)", fontWeight: 500 }}
        >
          Email Address <span style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "0.8rem" }}>(Optional)</span>
        </label>
        <input
          type="email"
          id="email"
          placeholder="e.g. rajesh@example.com"
          value={values.email}
          onChange={(event) => set("email", event.target.value)}
          style={{
            width: "100%",
            padding: "0.9rem 1.1rem",
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(212, 175, 55, 0.2)",
            borderRadius: "10px",
            color: "#ffffff",
            fontSize: "0.95rem",
          }}
        />
      </div>

      {error && (
        <div
          role="alert"
          style={{
            marginBottom: "1.25rem",
            padding: "0.75rem 1rem",
            background: "rgba(232, 67, 147, 0.15)",
            border: "1px solid rgba(232, 67, 147, 0.4)",
            borderRadius: "8px",
            color: "#ff7675",
            fontSize: "0.88rem",
          }}
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        style={{
          width: "100%",
          padding: "1rem 1.5rem",
          borderRadius: "9999px",
          background: "linear-gradient(135deg, #d4af37 0%, #e84393 100%)",
          color: "#0a0a0c",
          fontWeight: 700,
          fontSize: "1rem",
          border: "none",
          cursor: status === "sending" ? "not-allowed" : "pointer",
          boxShadow: "0 8px 24px rgba(212, 175, 55, 0.25)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          opacity: status === "sending" ? 0.7 : 1,
        }}
      >
        {status === "sending" ? "Submitting to CRM..." : "Request Exclusive Callback & Visit"}
      </button>

      <p
        style={{
          marginTop: "1rem",
          fontSize: "0.78rem",
          color: "rgba(255, 255, 255, 0.5)",
          textAlign: "center",
        }}
      >
        🔒 Official MahaRERA Registered Developer. Your information is securely registered in our CRM.
      </p>
    </form>
  );
}
