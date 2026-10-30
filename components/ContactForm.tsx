"use client";

import { useState, useRef, type FormEvent } from "react";
import { getLifestyleConciergeWhatsAppUrl } from "@/lib/services/whatsappService";
import { submitLead } from "@/lib/leads/submitLead";

type Status = "idle" | "sending" | "sent" | "error";

const BLANK = {
  name: "",
  phone: "",
  email: "",
  project: "Aura by Lifestyle",
  configuration: "2 & 3 BHK Luxury Residences",
  message: "",
};

export default function ContactForm() {
  const [values, setValues] = useState(BLANK);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [referenceId, setReferenceId] = useState<string>("");
  const [submitIntent, setSubmitIntent] = useState<"enquiry" | "visit">("enquiry");
  const isSubmittingRef = useRef(false);

  function set(key: keyof typeof BLANK, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setStatus("sending");
    setError(null);

    const form = new FormData(event.currentTarget);

    try {
      const result = await submitLead({
        name: values.name.trim(),
        phone: values.phone.trim(),
        email: values.email.trim() || undefined,
        project: values.project,
        preference: `${values.configuration}${values.message ? ` · Note: ${values.message.trim()}` : ""}`,
        source: submitIntent === "visit" ? "Book A Site Visit Form" : "Enquire About Aura Form",
        website: String(form.get("website") ?? ""),
      });

      if (!result.ok) {
        setError(result.error);
        setStatus("error");
        return;
      }

      setReferenceId(result.referenceId || "AURA-2026-VIP");
      setValues(BLANK);
      setStatus("sent");
    } finally {
      isSubmittingRef.current = false;
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
          background: "#0d0f0d",
          border: "1px solid rgba(191, 149, 63, 0.42)",
          borderRadius: "22px",
          padding: "2.4rem 2rem",
          textAlign: "center",
          color: "#f7efdc",
        }}
      >
        <div
          style={{
            width: "52px",
            height: "52px",
            margin: "0 auto 1.15rem",
            borderRadius: "50%",
            background: "rgba(191, 149, 63, 0.14)",
            border: "1px solid rgba(191, 149, 63, 0.45)",
            color: "#d5bd87",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.4rem",
          }}
        >
          ✓
        </div>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "2rem",
            fontWeight: 600,
            textTransform: "uppercase",
            color: "#f7efdc",
            marginBottom: "0.45rem",
          }}
        >
          Enquiry Registered
        </h3>
        <p style={{ color: "rgba(247, 239, 220, 0.7)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1rem" }}>
          Your request has been logged with our advisory desk under Reference ID:
        </p>
        <div
          style={{
            display: "inline-block",
            padding: "0.45rem 1.25rem",
            borderRadius: "9999px",
            background: "rgba(191, 149, 63, 0.12)",
            border: "1px solid rgba(191, 149, 63, 0.4)",
            color: "#d5bd87",
            fontWeight: 700,
            letterSpacing: "0.1em",
            marginBottom: "1.35rem",
          }}
        >
          {referenceId}
        </div>
        <p style={{ color: "rgba(247, 239, 220, 0.55)", fontSize: "0.84rem", marginBottom: "1.4rem" }}>
          Our senior property team will reach out shortly to coordinate your site walkthrough.
        </p>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.55rem",
            padding: "12px 24px",
            borderRadius: "9999px",
            background: "#c5a880",
            color: "#080808",
            fontWeight: 700,
            fontSize: "11px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          <i className="fa-brands fa-whatsapp" style={{ fontSize: "1rem" }} /> Connect on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form id="booking-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
      />

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label
          htmlFor="name"
          style={{
            display: "block",
            marginBottom: "0.45rem",
            fontSize: "10px",
            color: "#d5bd87",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
          }}
        >
          Full Name <span style={{ color: "#c5a880" }}>*</span>
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
            padding: "12px 15px",
            background: "rgba(247, 239, 220, 0.04)",
            border: "1px solid rgba(247, 239, 220, 0.14)",
            borderRadius: "12px",
            color: "#f7efdc",
            fontSize: "0.92rem",
          }}
        />
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label
          htmlFor="phone"
          style={{
            display: "block",
            marginBottom: "0.45rem",
            fontSize: "10px",
            color: "#d5bd87",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
          }}
        >
          Mobile Number <span style={{ color: "#c5a880" }}>*</span>
        </label>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <div
            style={{
              padding: "12px 13px",
              background: "rgba(191, 149, 63, 0.1)",
              border: "1px solid rgba(191, 149, 63, 0.3)",
              borderRadius: "12px",
              color: "#d5bd87",
              fontWeight: 700,
              fontSize: "0.88rem",
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
              padding: "12px 15px",
              background: "rgba(247, 239, 220, 0.04)",
              border: "1px solid rgba(247, 239, 220, 0.14)",
              borderRadius: "12px",
              color: "#f7efdc",
              fontSize: "0.92rem",
            }}
          />
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label
          htmlFor="email"
          style={{
            display: "block",
            marginBottom: "0.45rem",
            fontSize: "10px",
            color: "#AEA399",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
          }}
        >
          Email Address <span style={{ color: "rgba(248, 245, 243, 0.45)", textTransform: "none" }}>(Optional)</span>
        </label>
        <input
          type="email"
          id="email"
          placeholder="e.g. rajesh@example.com"
          value={values.email}
          onChange={(event) => set("email", event.target.value)}
          style={{
            width: "100%",
            padding: "12px 15px",
            background: "rgba(248, 245, 243, 0.04)",
            border: "1px solid rgba(184, 174, 166, 0.22)",
            borderRadius: "12px",
            color: "#F8F5F3",
            fontSize: "0.92rem",
          }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label
            htmlFor="project"
            style={{
              display: "block",
              marginBottom: "0.45rem",
              fontSize: "10px",
              color: "#AEA399",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
            }}
          >
            Interested Project
          </label>
          <select
            id="project"
            value={values.project}
            onChange={(event) => set("project", event.target.value)}
            style={{
              width: "100%",
              padding: "12px 14px",
              background: "#201005",
              border: "1px solid rgba(184, 174, 166, 0.22)",
              borderRadius: "12px",
              color: "#F8F5F3",
              fontSize: "0.88rem",
            }}
          >
            <option value="Aura by Lifestyle">Aura by Lifestyle (Camp)</option>
            <option value="Lifestyle Home Spaces">Lifestyle Home Spaces (DPS Rd)</option>
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label
            htmlFor="configuration"
            style={{
              display: "block",
              marginBottom: "0.45rem",
              fontSize: "10px",
              color: "#AEA399",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
            }}
          >
            Configuration
          </label>
          <select
            id="configuration"
            value={values.configuration}
            onChange={(event) => set("configuration", event.target.value)}
            style={{
              width: "100%",
              padding: "12px 14px",
              background: "#201005",
              border: "1px solid rgba(184, 174, 166, 0.22)",
              borderRadius: "12px",
              color: "#F8F5F3",
              fontSize: "0.88rem",
            }}
          >
            <option value="2 BHK Luxury Residence">2 BHK Luxury Residence</option>
            <option value="3 BHK Luxury Residence">3 BHK Luxury Residence</option>
            <option value="Commercial / Retail Space">Commercial / Retail Space</option>
          </select>
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label
          htmlFor="message"
          style={{
            display: "block",
            marginBottom: "0.45rem",
            fontSize: "10px",
            color: "#AEA399",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
          }}
        >
          Message / Requirement <span style={{ color: "rgba(248, 245, 243, 0.45)", textTransform: "none" }}>(Optional)</span>
        </label>
        <textarea
          id="message"
          rows={2}
          placeholder="Preferred floor, move-in timeline, or specific questions..."
          value={values.message}
          onChange={(event) => set("message", event.target.value)}
          style={{
            width: "100%",
            padding: "10px 14px",
            background: "rgba(248, 245, 243, 0.04)",
            border: "1px solid rgba(184, 174, 166, 0.22)",
            borderRadius: "12px",
            color: "#F8F5F3",
            fontSize: "0.88rem",
            resize: "none",
          }}
        />
      </div>

      {error && (
        <div
          role="alert"
          style={{
            padding: "10px 14px",
            background: "rgba(229, 72, 77, 0.12)",
            border: "1px solid rgba(229, 72, 77, 0.38)",
            borderRadius: "10px",
            color: "#f87171",
            fontSize: "0.85rem",
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "0.35rem" }}>
        <button
          type="submit"
          disabled={status === "sending"}
          onClick={() => setSubmitIntent("enquiry")}
          style={{
            width: "100%",
            padding: "13px 18px",
            borderRadius: "9999px",
            background: "#B8AEA6",
            color: "#201005",
            fontWeight: 700,
            fontSize: "10.5px",
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            border: "1px solid #B8AEA6",
            cursor: status === "sending" ? "not-allowed" : "pointer",
            opacity: status === "sending" ? 0.72 : 1,
            transition: "all 0.2s ease",
          }}
        >
          {status === "sending" && submitIntent === "enquiry"
            ? "Sending..."
            : "Enquire About Aura →"}
        </button>

        <button
          type="submit"
          disabled={status === "sending"}
          onClick={() => setSubmitIntent("visit")}
          style={{
            width: "100%",
            padding: "13px 18px",
            borderRadius: "9999px",
            background: "transparent",
            color: "#F8F5F3",
            fontWeight: 700,
            fontSize: "10.5px",
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            border: "1px solid rgba(184, 174, 166, 0.4)",
            cursor: status === "sending" ? "not-allowed" : "pointer",
            opacity: status === "sending" ? 0.72 : 1,
            transition: "all 0.2s ease",
          }}
        >
          {status === "sending" && submitIntent === "visit"
            ? "Scheduling..."
            : "Book A Site Visit"}
        </button>
      </div>

      <p
        style={{
          marginTop: "0.25rem",
          fontSize: "0.75rem",
          color: "#AEA399",
          textAlign: "center",
        }}
      >
        MahaRERA Reg. No. P5030002502915 · Official Developer Advisory Desk
      </p>
    </form>
  );
}
