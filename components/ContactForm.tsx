"use client";

import { useState, type FormEvent } from "react";

import { CONSTRUCTION_TYPES, PACKAGES } from "@/lib/schemas/lead";

type Status = "idle" | "sending" | "sent" | "error";

const BLANK = {
  name: "",
  phone: "",
  email: "",
  city: "",
  plotSize: "",
  type: "",
  package: "",
  startDate: "",
  message: "",
};

export default function ContactForm() {
  const [values, setValues] = useState(BLANK);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  function set(key: keyof typeof BLANK, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError(null);

    const form = new FormData(event.currentTarget);

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        // Hidden from real users; only a bot fills it in.
        website: String(form.get("website") ?? ""),
      }),
    }).catch(() => null);

    if (!response?.ok) {
      const body = await response?.json().catch(() => ({}));
      setError(
        body?.error ?? "Something went wrong. Please call or WhatsApp us."
      );
      setStatus("error");
      return;
    }

    setValues(BLANK);
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <p id="form-success" className="form-success" role="status" aria-live="polite">
        Thank you! Our team will contact you within 24 hours to schedule your
        free site visit.
      </p>
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

      <div className="form-group">
        <input
          type="text"
          id="name"
          placeholder="Full Name"
          value={values.name}
          onChange={(event) => set("name", event.target.value)}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <input
            type="tel"
            id="phone"
            placeholder="Phone Number"
            value={values.phone}
            onChange={(event) => set("phone", event.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            id="email"
            placeholder="Email Address"
            value={values.email}
            onChange={(event) => set("email", event.target.value)}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <input
            type="text"
            id="city"
            placeholder="City / Plot Location"
            value={values.city}
            onChange={(event) => set("city", event.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            id="plot-size"
            placeholder="Plot Size (sq yards)"
            value={values.plotSize}
            onChange={(event) => set("plotSize", event.target.value)}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <select
            id="type"
            required
            value={values.type}
            onChange={(event) => set("type", event.target.value)}
          >
            <option value="" disabled>
              Construction Type
            </option>
            {CONSTRUCTION_TYPES.map((type) => (
              <option key={type} value={type}>
                {
                  {
                    new: "New House Construction",
                    renovation: "Renovation",
                    commercial: "Commercial",
                    plot: "Plot Development",
                  }[type]
                }
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <select
            id="package"
            required
            value={values.package}
            onChange={(event) => set("package", event.target.value)}
          >
            <option value="" disabled>
              Preferred Package
            </option>
            {PACKAGES.map((option) => (
              <option key={option} value={option}>
                {
                  {
                    essential: "Essential",
                    premium: "Premium",
                    luxury: "Luxury",
                    unsure: "Not Sure Yet",
                  }[option]
                }
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <input
          type="date"
          id="date"
          placeholder="Expected Start Date"
          value={values.startDate}
          onChange={(event) => set("startDate", event.target.value)}
        />
      </div>

      <div className="form-group">
        <textarea
          id="message"
          rows={4}
          placeholder="Message / Additional Requirements"
          value={values.message}
          onChange={(event) => set("message", event.target.value)}
        />
      </div>

      <button
        type="submit"
        className="cta-button solid full-width"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending…" : "Book Free Site Visit"}
      </button>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
