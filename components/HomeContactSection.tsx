"use client";

import { useState } from "react";
import styles from "./HomeContactSection.module.css";
import type { SettingsRecord } from "@/lib/schemas/settings";

const PREFERENCES = [
  "3 BHK Sky Suite (1,850 SQFT)",
  "2 BHK Luxury Suite (1,150 SQFT)",
  "Crown Level 15 Sky Oasis",
  "Schedule Private Site Visit",
];

export default function HomeContactSection({ settings }: { settings?: SettingsRecord }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [selectedPref, setSelectedPref] = useState(PREFERENCES[0]);
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
          preference: selectedPref,
          message: formData.message || `Interest in ${selectedPref}`,
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
            <span className={styles.nowrapWord}>
              <span className={styles.swashInitial}>C</span>ONVERSATION
            </span>
          </h2>
          <p className={styles.bodyText}>
            Tell us more about your ideal residence, your timeline, and your aspirations.
            Our residential desk will guide you through floor plans, pricing, and private site previews.
          </p>

          <div className={styles.channelDetails}>
            <div>
              <strong>Sales Gallery:</strong> Congress Nagar Road, Camp, Amravati
            </div>
            <div>
              <strong>Direct Desk:</strong>{" "}
              <a href="tel:+917498256708" className={styles.channelLink}>
                +91 74982 56708
              </a>
            </div>
            <div>
              <strong>Official Email:</strong>{" "}
              <a href="mailto:sales@lifestylehomespaces.com" className={styles.channelLink}>
                sales@lifestylehomespaces.com
              </a>
            </div>
          </div>
        </div>

        {/* Right: Minimal Underline Form */}
        <form onSubmit={handleSubmit} className={styles.formCol}>
          {isSuccess ? (
            <div className={styles.successMsg}>
              Thank you. Your request for <strong>{selectedPref}</strong> has been received. Our senior residential advisor will reach out to you shortly.
            </div>
          ) : (
            <>
              {/* Configuration Quick Pills */}
              <div className={styles.prefPillsRow} role="radiogroup" aria-label="Preferred Residence">
                {PREFERENCES.map((pref) => (
                  <button
                    key={pref}
                    type="button"
                    role="radio"
                    aria-checked={selectedPref === pref}
                    className={`${styles.prefPill} ${selectedPref === pref ? styles.prefPillActive : ""}`}
                    onClick={() => setSelectedPref(pref)}
                  >
                    {pref}
                  </button>
                ))}
              </div>

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
                placeholder="Message / Specific Requirements"
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
