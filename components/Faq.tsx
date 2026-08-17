"use client";

import { useId, useState } from "react";
import styles from "./Faq.module.css";

const FAQS = [
  {
    question: "What types of homes do you build?",
    answer:
      "We build turnkey residential projects across Delhi NCR — independent houses, villas and bungalows, plus renovations and floor additions on existing plots. Every build is engineered to IS code with premium TMT steel and M25 concrete.",
  },
  {
    question: "How does the construction process work?",
    answer:
      "It runs in six stages: site visit and assessment, design and planning, contract and municipal approvals, foundation and structure, finishing and interiors, then handover. You get a fixed-price contract up front and a dedicated site manager throughout.",
  },
  {
    question: "Can I schedule a site visit?",
    answer:
      "Yes. Call or WhatsApp us and we will visit your plot to study orientation, soil and surroundings, then walk you through what is feasible and what it will cost — before you commit to anything.",
  },
  {
    question: "Do you handle approvals and provide a warranty?",
    answer:
      "We handle municipal approvals as part of the contract, and every build carries a 30-month structural warranty. Final walkthrough and snagging are cleared before we hand over the keys.",
  },
];

function ChevronDown({ open }: { open: boolean }) {
  return (
    <div className={`${styles.chevron}${open ? ` ${styles.chevronOpen}` : ""}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  );
}

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section className={styles.section} id="faq-section">
      <div className={styles.container}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} aria-hidden="true" />
          <span className={styles.badgeText}>FAQ</span>
        </div>

        <div className={styles.header}>
          <h2 className={styles.title}>Frequently Asked Questions</h2>
        </div>

        <div className={styles.list}>
          {FAQS.map((faq, i) => {
            const open = openIndex === i;
            const panelId = `${baseId}-panel-${i}`;
            const triggerId = `${baseId}-trigger-${i}`;
            return (
              <div className={styles.item} key={faq.question}>
                <button
                  type="button"
                  className={styles.trigger}
                  id={triggerId}
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(open ? null : i)}
                >
                  <span className={styles.question}>{faq.question}</span>
                  <ChevronDown open={open} />
                </button>

                <div
                  className={`${styles.animator}${open ? ` ${styles.animatorOpen}` : ""}`}
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                >
                  <div className={styles.animatorInner}>
                    <div className={styles.answerWrapper}>
                      <div className={styles.answerInner}>
                        <p className={styles.answerText}>{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
