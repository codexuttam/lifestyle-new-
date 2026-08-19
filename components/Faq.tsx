"use client";

import { useId, useState } from "react";
import type { FaqRecord } from "@/lib/schemas/faq";
import type { HomeRecord } from "@/lib/schemas/home";
import styles from "./Faq.module.css";


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

export default function Faq({
  faqs,
  content,
}: {
  faqs: FaqRecord[];
  content: HomeRecord["faq"];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section className={styles.section} id="faq-section">
      <div className={styles.container}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} aria-hidden="true" />
          <span className={styles.badgeText}>{content.badge}</span>
        </div>

        <div className={styles.header}>
          <h2 className={styles.title}>{content.title}</h2>
        </div>

        <div className={styles.list}>
          {faqs.map((faq, i) => {
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
