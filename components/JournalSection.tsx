import Link from "next/link";
import styles from "./JournalSection.module.css";

const ARTICLES = [
  {
    slug: "luxury-real-estate-trends-amravati-2026",
    category: "MARKET ANALYSIS",
    title: "Luxury Real Estate Trends in Amravati: A Practical 2026 Buyer's Guide",
    excerpt: "Explore shifting luxury preferences in Amravati, from prime Congress Nagar Road and DPS Road locations to MahaRERA verifications, rooftop sky amenities, and smart buying decisions.",
    date: "JUNE 2026",
    readTime: "9 MIN READ",
    image: "/aura/aura-hero-clean-4k.jpg",
  },
  {
    slug: "sample-flat-walkthrough-lifestyle-homes",
    category: "ARCHITECTURE & CRAFTSMANSHIP",
    title: "Inside the Finished Sample Residence: What Living at Lifestyle Homes Truly Feels Like",
    excerpt: "A guided walkthrough of our fully furnished 2 & 3 BHK sample apartments on DPS Road, highlighting material choices, natural cross-ventilation, and interior elegance.",
    date: "MAY 2026",
    readTime: "3 MIN READ",
    image: "/assets/interiors/bedroom-balcony-clean.jpg",
  },
  {
    slug: "commercial-property-amravati",
    category: "COMMERCIAL INVESTMENT",
    title: "Why Investing in Commercial Property in Amravati is a Smart Move",
    excerpt: "Explore high-visibility commercial corridors and prime retail arcade opportunities offering strong rental yields and footfall across Amravati.",
    date: "APRIL 2026",
    readTime: "5 MIN READ",
    image: "/aura/real-aura.png",
  },
];

export default function JournalSection() {
  return (
    <section className={styles.section} id="journal" aria-label="Journal & Insights">
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
              <Link href={`/blogs/${art.slug}`} className={styles.imageLink} aria-label={art.title}>
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
                  <Link href={`/blogs/${art.slug}`} className={styles.titleLink}>
                    {art.title}
                  </Link>
                </h3>
                <p className={styles.excerpt}>{art.excerpt}</p>
                <Link href={`/blogs/${art.slug}`} className={styles.readMore}>
                  Read Full Article →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
