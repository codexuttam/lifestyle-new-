import Link from "next/link";
import styles from "./DeveloperSection.module.css";

const DEVELOPER_VALUES = [
  {
    number: "01",
    title: "Structural Longevity",
    description: "Seismic-grade RCC frames, high-grade steel, and certified waterproofing guarantee multigenerational durability.",
  },
  {
    number: "02",
    title: "Accountable Delivery",
    description: "100% MahaRERA transparency, clear titles, bank approvals, and scheduled construction milestones.",
  },
  {
    number: "03",
    title: "Architectural Dignity",
    description: "Prioritizing daylight, cross-ventilation, and private living zones over crowded floor densities.",
  },
];

export default function DeveloperSection() {
  return (
    <section className={styles.section} id="developer-lifestyle">
      <div className={styles.container}>
        <div className={styles.editorialGrid}>
          {/* Left Column: Developer Storytelling */}
          <div className={styles.storyCol}>
            <span className={styles.eyebrow}>DEVELOPER CREDIBILITY &amp; PHILOSOPHY</span>
            <h2 className={styles.heading}>
              A VISION BY <span>LIFESTYLE.</span>
            </h2>
            <p className={styles.lead}>
              Behind Aura stands Lifestyle — an Amravati residential developer grounded in engineering integrity, architectural clarity, and transparent customer partnerships.
            </p>
            <p className={styles.body}>
              We believe a home is a permanent sanctuary, not a transient commodity. From our landmark residential and commercial developments on DPS Road to Amravati’s premier 15-storey crown in Camp, our practice focuses on zero shared walls, generous light corridors, and long-term structural resilience.
            </p>

            <div className={styles.pillarsGrid}>
              {DEVELOPER_VALUES.map((val) => (
                <div key={val.number} className={styles.pillarItem}>
                  <span className={styles.pillarNumber}>{val.number}</span>
                  <h3 className={styles.pillarTitle}>{val.title}</h3>
                  <p className={styles.pillarDesc}>{val.description}</p>
                </div>
              ))}
            </div>

            <div className={styles.ctaRow}>
              <Link href="/about" className={styles.primaryLink}>
                About Lifestyle Real Estate →
              </Link>
            </div>
          </div>

          {/* Right Column: Architectural Benchmark Card */}
          <div className={styles.visualCol}>
            <div className={styles.benchmarkCard}>
              <div className={styles.imageWrap}>
                <img
                  src="/videos/2nd-clip-thumb.png"
                  alt="Delivered Lifestyle landmark in Amravati"
                  className={styles.benchmarkImage}
                  loading="lazy"
                />
                <div className={styles.scrim} />
                <span className={styles.badge}>PROVEN TRACK RECORD</span>
              </div>
              <div className={styles.benchmarkContent}>
                <span className={styles.metaLabel}>BENCHMARK PROJECT · AMRAVATI</span>
                <h3 className={styles.benchmarkTitle}>Delivered Commercial &amp; Residential Excellence</h3>
                <p className={styles.benchmarkDesc}>
                  Our delivered project on DPS Road stands as living proof of our commitment to quality finishes, punctual possession, and sustainable community living.
                </p>
                <div className={styles.statsRow}>
                  <div className={styles.statItem}>
                    <span className={styles.statVal}>100%</span>
                    <span className={styles.statKey}>RERA Compliant</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statVal}>500+</span>
                    <span className={styles.statKey}>Satisfied Families</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statVal}>Camp &amp; DPS</span>
                    <span className={styles.statKey}>Prime Locations</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
