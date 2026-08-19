import Link from "next/link";

import type { HomeRecord } from "@/lib/schemas/home";
import styles from "./About.module.css";


export default function About({ content }: { content: HomeRecord["about"] }) {
  return (
    <section className={styles.about} id="about-us-section">
      <div className={styles.headerRow}>
        <div className={styles.label}>
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.labelText}>{content.label}</span>
        </div>

        <div className={styles.statement}>
          <h2 className={styles.heading}>{content.statement}</h2>
          <Link href="/about" className={styles.btnMore}>
            {content.ctaLabel}
          </Link>
        </div>
      </div>

      <div className={styles.grid}>
        {content.cards.map((card) => (
          <div className={styles.card} key={card.label}>
            <div className={styles.cardTop}>
              <img
                src={card.img}
                alt={card.alt}
                className={styles.cardImage}
              />
              <div className={styles.cardStat}>
                <span className={styles.cardNumber}>
                  {card.prefix}
                  <span className="counter" data-target={card.target}>
                    0
                  </span>
                  {card.suffix}
                </span>
                <span className={styles.cardLabel}>{card.label}</span>
              </div>
            </div>
            <div className={styles.divider} />
            <p className={styles.cardDesc}>{card.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
