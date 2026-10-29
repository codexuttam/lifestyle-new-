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
    src: "/aura/aura-hero-clean-4k.jpg",
    alt: "Aura by Lifestyle 15-Storey Tower in Congress Nagar, Amravati",
  },
  {
    src: "/assets/projects/lifestyle-homes/building/lifestyle-hero-clean-4k.jpg",
    alt: "Lifestyle Home Spaces ready-for-possession landmark on DPS Road, Amravati",
  },
  {
    src: "/videos/web-clip-thumb.png",
    alt: "Aura Sky Oasis rooftop pool deck and multi-sports arena",
  },
];

const STAT_META: Record<
  number,
  { num: string; tag: string; defaultUnit: string; desc: string }
> = {
  0: {
    num: "01",
    tag: "SKYLINE BENCHMARK",
    defaultUnit: "STOREYS",
    desc: "15-Storey landmark with rooftop pool & sky sports turf",
  },
  1: {
    num: "02",
    tag: "VASTU HARMONY",
    defaultUnit: "%",
    desc: "100% Vastu-compliant layouts with natural cross-breeze",
  },
  2: {
    num: "03",
    tag: "MAHARERA CERTIFIED",
    defaultUnit: "%",
    desc: "Verified clear titles: P5030002502915 & P50300054447",
  },
  3: {
    num: "04",
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
        {/* --- BAND 1: CHARCOAL HERO & STATS --- */}
        <section className={styles.heroBand}>
          <div className={styles.sectionInner}>
            <div className={styles.heroGrid}>
              <div className={styles.heroContent} data-reveal>
                <h1 className={styles.title}>
                  REDEFINING URBAN LIVING <span>IN AMRAVATI</span>
                </h1>

                <p className={styles.intro}>{copy.intro}</p>

                <div className={styles.heroActions}>
                  <Link href="/projects" className={`${styles.primaryBtn} roll-button`}>
                    <span className="roll-text" data-text="Explore Developments →">
                      Explore Developments →
                    </span>
                  </Link>
                  <a
                    href={whatsappHref(settings)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.secondaryBtn} roll-button`}
                  >
                    <span className="roll-text" data-text="Connect with Site Office">
                      Connect with Site Office
                    </span>
                  </a>
                </div>
              </div>

              <div className={styles.heroVisualCard} data-reveal>
                <img
                  src="/aura/aura-hero-clean-4k.jpg"
                  alt="Aura by Lifestyle 15-Storey Tower Architecture"
                  className={styles.visualCardImg}
                  loading="eager"
                />
                <div className={styles.visualCardOverlay}>
                  <div />

                  <div className={styles.visualCardBottom}>
                    <div className={styles.visualCardMeta}>
                      <span className={styles.visualProjectName}>AURA BY LIFESTYLE</span>
                      <span className={styles.visualProjectLoc}>
                        Congress Nagar Road · Camp, Amravati
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.statsRow} aria-label="Company at a glance" data-reveal-group>
              {stats.map((stat, idx) => {
                const meta = STAT_META[idx] || {
                  num: `0${idx + 1}`,
                  tag: "BENCHMARK",
                  defaultUnit: "",
                  desc: stat.label,
                };
                const unit = parseStatUnit(stat, idx);

                return (
                  <div className={styles.statCard} key={stat.label}>
                    <div className={styles.statCardTop}>
                      <span className={styles.statIndex}>({meta.num})</span>
                      <span className={styles.statMicroTag}>{meta.tag}</span>
                    </div>

                    <div className={styles.statNumberBlock}>
                      <span className={styles.statValue}>
                        <AnimatedCounter target={stat.target} duration={1600} />
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
          </div>
        </section>

        {/* --- BAND 2: WARM IVORY STORY & VALUES --- */}
        <section className={styles.ivoryBand}>
          <div className={styles.sectionInner}>
            <div className={styles.story}>
              <div className={styles.storyText} data-reveal>
                <h2 className={styles.sectionTitleLight}>{copy.storyTitle}</h2>
                {copy.storyParagraphs.map((paragraph) => (
                  <p className={styles.bodyLight} key={paragraph.slice(0, 40)}>
                    {paragraph}
                  </p>
                ))}
                <div className={styles.storyLinks}>
                  <Link href="/projects" className={`${styles.primaryBtn} roll-button`}>
                    <span className="roll-text" data-text={`${copy.projectsCtaLabel} →`}>
                      {copy.projectsCtaLabel} →
                    </span>
                  </Link>
                  <Link href="/services" className={`${styles.secondaryBtnLight} roll-button`}>
                    <span className="roll-text" data-text={copy.servicesCtaLabel}>
                      {copy.servicesCtaLabel}
                    </span>
                  </Link>
                </div>
              </div>

              <div className={styles.storyImages} data-reveal-group>
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
            </div>

            <div className={styles.block}>
              <div className={styles.blockHeader} data-reveal>
                <h2 className={styles.sectionTitleLight}>{copy.valuesTitle}</h2>
              </div>
              <div className={styles.valueGrid} data-reveal-group>
                {values.map((value, idx) => (
                  <article className={styles.valueCard} key={value.title}>
                    <span className={styles.valueIndex}>(0{idx + 1})</span>
                    <h3 className={styles.valueTitle}>{value.title}</h3>
                    <p className={styles.valueText}>{value.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- BAND 3: CHARCOAL MILESTONES & PROCESS --- */}
        <section className={styles.charcoalBand}>
          <div className={styles.sectionInner}>
            <div className={styles.block}>
              <div className={styles.blockHeader} data-reveal>
                <h2 className={styles.sectionTitle}>{copy.milestonesTitle}</h2>
              </div>
              <ol className={styles.timeline} data-reveal-group>
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
            </div>

            <div className={styles.block}>
              <div className={styles.blockHeader} data-reveal>
                <h2 className={styles.sectionTitle}>{copy.processTitle}</h2>
              </div>
              <div className={styles.processGrid} data-reveal-group>
                {processSteps.map((step, i) => (
                  <article className={styles.processCard} key={step.title}>
                    <span className={styles.processNumber}>
                      ({String(i + 1).padStart(2, "0")})
                    </span>
                    <h3 className={styles.processTitle}>{step.title}</h3>
                    <p className={styles.processText}>{step.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- BAND 4: WARM IVORY BRANDS & CLOSING CTA --- */}
        <section className={styles.ivoryBand}>
          <div className={styles.sectionInner}>
            <div className={styles.block} data-reveal>
              <h2 className={styles.sectionTitleLight}>{copy.brandsTitle}</h2>
              <p className={styles.bodyLight}>{copy.brandsIntro}</p>
              <ul className={styles.brandList}>
                {brands.map((brand) => (
                  <li className={styles.brand} key={brand}>
                    {brand}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.cta} data-reveal>
              <h2 className={styles.ctaTitle}>{copy.ctaTitle}</h2>
              <p className={styles.ctaText}>{copy.ctaText}</p>
              <a
                href={whatsappHref(settings)}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.primaryBtn} roll-button`}
              >
                <span className="roll-text" data-text={`${copy.ctaLabel} →`}>
                  {copy.ctaLabel} →
                </span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter settings={settings} />
    </>
  );
}
