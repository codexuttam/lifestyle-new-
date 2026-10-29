"use client";

import { useId, useState } from "react";
import type { FaqRecord } from "@/lib/schemas/faq";
import type { HomeRecord } from "@/lib/schemas/home";
import styles from "./Faq.module.css";

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
        <div className={styles.header}>
          <div className={styles.eyebrowRow}>
            <span className={styles.flank} aria-hidden="true" />
            <span className={styles.eyebrow}>{content.badge || "FREQUENTLY ASKED"}</span>
            <span className={styles.flank} aria-hidden="true" />
          </div>
          <h2 className={styles.title}>{content.title}</h2>
        </div>

        <div className={styles.list}>
          {faqs.map((faq, i) => {
            const open = openIndex === i;
            const panelId = `${baseId}-panel-${i}`;
            const triggerId = `${baseId}-trigger-${i}`;
            return (
              <div className={`${styles.item}${open ? ` ${styles.itemOpen}` : ""}`} key={faq.question}>
                <button
                  type="button"
                  className={styles.trigger}
                  id={triggerId}
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(open ? null : i)}
                >
                  <span className={styles.faqIndex}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={styles.question}>{faq.question}</span>
                  <span className={`${styles.plusBadge}${open ? ` ${styles.plusBadgeOpen}` : ""}`} aria-hidden="true">
                    +
                  </span>
                </button>

                <div
                  className={`${styles.animator}${open ? ` ${styles.animatorOpen}` : ""}`}
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                >
                  <div className={styles.animatorInner}>
                    <p className={styles.answerText}>{faq.answer}</p>
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
