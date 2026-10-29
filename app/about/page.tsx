import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import { getSettings } from "@/lib/content/settings";
import { whatsappHref } from "@/lib/schemas/settings";
import SiteFooter from "@/components/SiteFooter";
import RevealAnimations from "@/components/RevealAnimations";
import AnimatedCounter from "@/components/AnimatedCounter";
import { getCompany } from "@/lib/content/company";
import { getPages } from "@/lib/content/pages";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { about } = await getPages();
  return {
    title: about.metaTitle,
    description: about.metaDescription,
    alternates: { canonical: "/about" },
    openGraph: {
      title: about.metaTitle,
      description: about.metaDescription,
      type: "website",
    },
  };
}

const STORY_IMAGES = [
  {
    src: "/aura/hero-building-4k.jpg",
    alt: "Aura by Lifestyle 15-Storey Tower in Congress Nagar, Amravati",
  },
  {
    src: "/assets/projects/lifestyle-homes/gallery/lifestyle-elevation-day.jpg",
    alt: "Lifestyle Home Spaces, ready-for-possession landmark on DPS Road, Amravati",
  },
  {
    src: "/aura/rooftop-amenities-3d.jpg",
    alt: "Aura Sky Oasis rooftop amenities deck and sports arena",
  },
];

const STAT_META: Record<
  number,
  { icon: string; tag: string; defaultUnit: string; desc: string }
> = {
  0: {
    icon: "🏛️",
    tag: "SKYLINE BENCHMARK",
    defaultUnit: "STOREYS",
    desc: "15-Storey landmark with rooftop pool & sky sports turf",
  },
  1: {
    icon: "🧭",
    tag: "VASTU HARMONY",
    defaultUnit: "%",
    desc: "100% Vastu-compliant layouts with natural cross-breeze",
  },
  2: {
    icon: "🛡️",
    tag: "GOVT. CERTIFIED",
    defaultUnit: "%",
    desc: "MahaRERA verified clear titles: P5030002502915",
  },
  3: {
    icon: "📍",
    tag: "PORTFOLIO",
    defaultUnit: "LANDMARKS",
    desc: "Aura (Congress Nagar) & Lifestyle Homes (DPS Road)",
  },
};

function parseStatUnit(stat: { suffix?: string }, index: number) {
  const meta = STAT_META[index];
  if (!stat.suffix) return meta?.defaultUnit || "";
  const cleaned = stat.suffix.trim().replace(/^ /, "");
  return cleaned || meta?.defaultUnit || "";
}

export default async function AboutPage() {
  const [company, settings, pages] = await Promise.all([
    getCompany(),
    getSettings(),
    getPages(),
  ]);
  const copy = pages.about;
  const { stats, milestones, processSteps, values, brands } = company;

  return (
    <>
      <RevealAnimations />
      <SiteNav activeHref="/about" />

      <main className={styles.page}>
        <div className={styles.inner}>
          {/* --- Hero Header with 2-Column Luxury Showcase --- */}
          <section className={styles.heroSection}>
            <div className={styles.heroGrid}>
              <div className={styles.heroContent}>
                <div className={styles.badge}>
                  <span className={styles.badgeDot} aria-hidden="true" />
                  <span className={styles.badgeText}>
                    {copy.badge || "About Lifestyle Home Spaces • Amravati"}
                  </span>
                </div>

                <h1 className={styles.title}>
                  Redefining Urban Living{" "}
                  <span className={styles.titleGradient}>in Amravati</span>
                </h1>

                <p className={styles.intro}>{copy.intro}</p>

                <div className={styles.trustRow}>
                  <div className={styles.trustChip}>
                    <span className={styles.trustIcon}>🏛️</span>
                    <span>Dual Landmark Highrises</span>
                  </div>
                  <div className={styles.trustChip}>
                    <span className={styles.trustIcon}>🧭</span>
                    <span>100% Vastu Compliant</span>
                  </div>
                  <div className={styles.trustChip}>
                    <span className={styles.trustIcon}>🛡️</span>
                    <span>MahaRERA: P5030002502915</span>
                  </div>
                </div>

                <div className={styles.heroActions}>
                  <Link href="/projects" className={styles.primaryBtn}>
                    Explore Developments
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <a
                    href={whatsappHref(settings)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.secondaryBtn}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.311.045-.698.057-2.371-.599-1.895-.744-3.155-2.651-3.252-2.781-.097-.13-.768-1.02-.768-1.944 0-.923.486-1.378.658-1.564.172-.187.376-.233.501-.233.126 0 .252.002.361.008.117.006.273-.044.426.326.157.379.539 1.312.585 1.407.047.095.078.206.016.329-.063.123-.094.2-.187.309-.094.109-.197.243-.282.326-.094.093-.192.195-.083.382.109.187.484.798 1.038 1.292.713.636 1.314.833 1.501.927.187.093.297.081.407-.047.11-.128.469-.545.594-.733.125-.187.25-.156.422-.093.172.062 1.094.516 1.282.609.188.094.313.141.36.219.047.078.047.452-.097.857z" />
                    </svg>
                    Connect with Site Office
                  </a>
                </div>
              </div>

              {/* Architectural Landmark Card */}
              <div className={styles.heroVisualCard}>
                <img
                  src="/aura/aura-hero-clean-4k.jpg"
                  alt="Aura by Lifestyle 15-Storey Tower Architecture"
                  className={styles.visualCardImg}
                  loading="eager"
                />
                <div className={styles.visualCardOverlay}>
                  <div className={styles.visualCardTopTags}>
                    <span className={styles.visualTag}>
                      <span className={styles.visualTagDot} />
                      Flagship Landmark
                    </span>
                    <span className={styles.visualTagAlt}>
                      MahaRERA: P5030002502915
                    </span>
                  </div>

                  <div className={styles.visualCardBottom}>
                    <div className={styles.visualCardMeta}>
                      <span className={styles.visualProjectName}>
                        Aura by Lifestyle
                      </span>
                      <span className={styles.visualProjectLoc}>
                        📍 Congress Nagar Road, Amravati
                      </span>
                    </div>
                    <div className={styles.visualPillsRow}>
                      <span className={styles.visualMiniPill}>15 Storeys</span>
                      <span className={styles.visualMiniPill}>Rooftop Pool</span>
                      <span className={styles.visualMiniPill}>2 &amp; 3 BHK</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- Stats Bento Grid --- */}
            <div className={styles.statsRow} aria-label="Company at a glance">
              {stats.map((stat, idx) => {
                const meta = STAT_META[idx] || {
                  icon: "✨",
                  tag: "BENCHMARK",
                  defaultUnit: "",
                  desc: stat.label,
                };
                const unit = parseStatUnit(stat, idx);

                return (
                  <div className={styles.statCard} key={stat.label}>
                    <div className={styles.statCardTop}>
                      <div className={styles.statIconBox} aria-hidden="true">
                        {meta.icon}
                      </div>
                      <span className={styles.statMicroTag}>{meta.tag}</span>
                    </div>

                    <div className={styles.statNumberBlock}>
                      <span className={styles.statValue}>
                        <AnimatedCounter
                          target={stat.target}
                          duration={1600}
                        />
                      </span>
                      {unit && <span className={styles.statUnit}>{unit}</span>}
                    </div>

                    <div className={styles.statMeta}>
                      <span className={styles.statTitle}>{stat.label}</span>
                      <span className={styles.statDesc}>{meta.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* --- Story --- */}
          <section className={styles.story}>
            <div className={styles.storyText}>
              <h2 className={styles.sectionTitle}>{copy.storyTitle}</h2>
              {copy.storyParagraphs.map((paragraph) => (
                <p className={styles.body} key={paragraph.slice(0, 40)}>
                  {paragraph}
                </p>
              ))}
              <div className={styles.storyLinks}>
                <Link href="/projects" className={styles.primaryBtn}>
                  {copy.projectsCtaLabel}
                </Link>
                <Link href="/services" className={styles.secondaryBtn}>
                  {copy.servicesCtaLabel}
                </Link>
              </div>
            </div>

            <div className={styles.storyImages}>
              {STORY_IMAGES.map((image) => (
                <img
                  key={image.src}
                  src={image.src}
                  alt={image.alt}
                  className={styles.storyImg}
                  loading="lazy"
                />
              ))}
            </div>
          </section>

          {/* --- Values --- */}
          <section className={styles.block}>
            <h2 className={styles.sectionTitle}>{copy.valuesTitle}</h2>
            <div className={styles.valueGrid}>
              {values.map((value) => (
                <article className={styles.valueCard} key={value.title}>
                  <h3 className={styles.valueTitle}>{value.title}</h3>
                  <p className={styles.valueText}>{value.text}</p>
                </article>
              ))}
            </div>
          </section>

          {/* --- Milestones --- */}
          <section className={styles.block}>
            <h2 className={styles.sectionTitle}>{copy.milestonesTitle}</h2>
            <ol className={styles.timeline}>
              {milestones.map((milestone) => (
                <li className={styles.milestone} key={milestone.year}>
                  <span className={styles.milestoneYear}>{milestone.year}</span>
                  <div className={styles.milestoneBody}>
                    <h3 className={styles.milestoneTitle}>{milestone.title}</h3>
                    <p className={styles.milestoneText}>{milestone.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* --- Process --- */}
          <section className={styles.block}>
            <h2 className={styles.sectionTitle}>{copy.processTitle}</h2>
            <div className={styles.processGrid}>
              {processSteps.map((step, i) => (
                <article className={styles.processCard} key={step.title}>
                  <span className={styles.processNumber}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className={styles.processTitle}>{step.title}</h3>
                  <p className={styles.processText}>{step.text}</p>
                </article>
              ))}
            </div>
          </section>

          {/* --- Brands --- */}
          <section className={styles.block}>
            <h2 className={styles.sectionTitle}>{copy.brandsTitle}</h2>
            <p className={styles.body}>{copy.brandsIntro}</p>
            <ul className={styles.brandList}>
              {brands.map((brand) => (
                <li className={styles.brand} key={brand}>
                  {brand}
                </li>
              ))}
            </ul>
          </section>

          {/* --- Closing CTA --- */}
          <section className={styles.cta}>
            <h2 className={styles.ctaTitle}>{copy.ctaTitle}</h2>
            <p className={styles.ctaText}>{copy.ctaText}</p>
            <a href={whatsappHref(settings)} className={styles.primaryBtn}>
              {copy.ctaLabel}
            </a>
          </section>
        </div>
      </main>

      <SiteFooter settings={settings} />
    </>
  );
}
