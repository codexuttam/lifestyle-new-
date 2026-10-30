import Link from "next/link";
import styles from "./JournalSection.module.css";

const ARTICLES = [
  {
    slug: "modern-architecture-amravati",
    category: "ARCHITECTURE",
    title: "How Contemporary Highrise Architecture Is Transforming Amravati",
    excerpt: "Exploring the shift toward rectilinear facades, cross-ventilated suites, and why vertical living is redefining urban life in Camp.",
    date: "OCTOBER 2026",
    readTime: "4 MIN READ",
    image: "/aura/building-full-4k.jpg",
  },
  {
    slug: "choosing-right-home-ventilation",
    category: "RESIDENTIAL DESIGN",
    title: "Light, Breeze & Acoustic Isolation: Choosing a Home That Breathes",
    excerpt: "Why zero shared walls and multi-orientation balconies are the single most significant factor in everyday mental well-being.",
    date: "OCTOBER 2026",
    readTime: "5 MIN READ",
    image: "/aura/modern-living-room.jpg",
  },
  {
    slug: "property-investment-camp-amravati",
    category: "INVESTMENT",
    title: "Capital Growth & Long-Term Value Along Congress Nagar Road",
    excerpt: "An editorial analysis of Camp’s real estate trajectory, social infrastructure proximity, and rental appreciation yields.",
    date: "OCTOBER 2026",
    readTime: "6 MIN READ",
    image: "/aura/sky-balcony-lifestyle.jpg",
  },
];

export default function JournalSection() {
  return (
    <section className={styles.section} id="journal">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerCopy}>
            <span className={styles.eyebrow}>EDITORIAL ESSAYS &amp; INSIGHTS</span>
            <h2 className={styles.heading}>
              THOUGHTS ON <span>BETTER LIVING.</span>
            </h2>
            <p className={styles.sub}>
              Curated perspectives on residential design, architectural craftsmanship, and thoughtful homeownership in Amravati.
            </p>
          </div>

          <Link href="/blogs" className={styles.viewAllBtn}>
            View All Articles →
          </Link>
        </div>

        <div className={styles.articleGrid}>
          {ARTICLES.map((art) => (
            <article key={art.slug} className={styles.card}>
              <Link href="/blogs" className={styles.imageLink} tabIndex={-1}>
                <img
                  src={art.image}
                  alt={art.title}
                  className={styles.image}
                  loading="lazy"
                />
                <span className={styles.categoryBadge}>{art.category}</span>
              </Link>

              <div className={styles.cardBody}>
                <div className={styles.metaRow}>
                  <span>{art.date}</span>
                  <span className={styles.dot}>·</span>
                  <span>{art.readTime}</span>
                </div>
                <h3 className={styles.title}>
                  <Link href="/blogs" className={styles.titleLink}>
                    {art.title}
                  </Link>
                </h3>
                <p className={styles.excerpt}>{art.excerpt}</p>
                <Link href="/blogs" className={styles.readMore}>
                  Read Article →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
