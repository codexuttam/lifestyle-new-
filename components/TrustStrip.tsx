import styles from "./TrustStrip.module.css";

const CREDENTIALS = [
  {
    code: "MahaRERA · P5030002502915",
    label: "Aura by Lifestyle Official Registration",
  },
  {
    code: "15 STOREYS · CAMP",
    label: "Congress Nagar Road Flagship Highrise",
  },
  {
    code: "2 & 3 BHK SKY SUITES",
    label: "1,150 – 1,850 Sqft · 100% Vastu Aligned",
  },
  {
    code: "LEVEL 15 SKY OASIS",
    label: "Infinity Pool, Kids Pool & Multi-Sports Turf",
  },
  {
    code: "DELIVERED TRACK RECORD",
    label: "Lifestyle Home Spaces · DPS Road (P50300054447)",
  },
  {
    code: "4 HIGH-SPEED ELEVATORS",
    label: "Generator Backup & Double-Height Arrival Lobby",
  },
];

export default function TrustStrip() {
  const repeated = [...CREDENTIALS, ...CREDENTIALS];

  return (
    <section className={styles.section} aria-label="Project credentials and highlights">
      <div className={styles.header}>
        <div className={styles.eyebrowRow}>
          <span className={styles.flankLine} aria-hidden="true" />
          <span className={styles.eyebrow}>VERIFIED PROJECT CREDENTIALS</span>
          <span className={styles.flankLine} aria-hidden="true" />
        </div>
        <p className={styles.subhead}>
          CRAFTED WITH TRANSPARENT MAHARERA DOCUMENTATION, DELIVERED PROVENANCE &amp; BENCHMARK ENGINEERING
        </p>
      </div>

      <div className={styles.marqueeBand}>
        <div className={styles.marqueeTrack}>
          {repeated.map((item, idx) => (
            <div className={styles.cell} key={`${item.code}-${idx}`}>
              <span className={styles.diamond} aria-hidden="true">✦</span>
              <div className={styles.cellText}>
                <span className={styles.cellCode}>{item.code}</span>
                <span className={styles.cellLabel}>{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

