"use client";

import { useState } from "react";
import styles from "./HomeContactSection.module.css";
import type { SettingsRecord } from "@/lib/schemas/settings";

export default function HomeContactSection({ settings }: { settings?: SettingsRecord }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setErrorMsg("Please provide your name and phone number.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          project: "Aura by Lifestyle",
          preference: "2 & 3 BHK Luxury Residences",
          message: formData.message || "Enquiry from SOL HAUS Contact Section",
          source: "SOL HAUS Contact Section",
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
        setFormData({ name: "", phone: "", email: "", message: "" });
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || "Unable to submit enquiry. Please try again.");
      }
    } catch {
      setErrorMsg("A network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.contact} id="contact" aria-label="Contact Aura by Lifestyle">
      <div className={styles.grid}>
        {/* Left: Narrative Column */}
        <div className={styles.narrativeCol}>
          <span className={styles.sectionLabel}>CONTACT US</span>
          <h2 className={styles.title}>
            LET&apos;S BEGIN A
            <br />
            <span className={styles.swashInitial}>C</span>ONVERSATION
          </h2>
          <p className={styles.bodyText}>
            Tell us more about your ideal residence, your timeline, and your aspirations.
            We&apos;ll guide you through the next steps with care and intention.
          </p>
        </div>

        {/* Right: Minimal Underline Form */}
        <form onSubmit={handleSubmit} className={styles.formCol}>
          {isSuccess ? (
            <div className={styles.successMsg}>
              Thank you. Your request has been received. Our team will reach out to you shortly.
            </div>
          ) : (
            <>
              <input
                type="text"
                placeholder="Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={styles.lineInput}
                required
              />

              <div className={styles.twoColRow}>
                <input
                  type="tel"
                  placeholder="Phone *"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={styles.lineInput}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={styles.lineInput}
                />
              </div>

              <textarea
                placeholder="Message / Preferred Residence"
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className={styles.textArea}
              />

              {errorMsg && <div className={styles.errorMsg}>{errorMsg}</div>}

              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitBtn}
                aria-label="Send Request"
              >
                <span>{isSubmitting ? "SENDING..." : "SEND REQUEST"}</span>
                <span className={styles.arrow}>→</span>
              </button>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
