import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import { getSettings } from "@/lib/content/settings";
import { whatsappHref } from "@/lib/schemas/settings";
import SiteFooter from "@/components/SiteFooter";
import RevealAnimations from "@/components/RevealAnimations";
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
    src: "/assets/projects/lifestyle-homes/building/building-hero-polished.jpg",
    alt: "Lifestyle Home Spaces, ready-for-possession landmark on DPS Road, Amravati",
  },
  {
    src: "/aura/rooftop-amenities-3d.jpg",
    alt: "Aura Sky Oasis rooftop amenities deck and sports arena",
  },
];

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
          <header className={styles.header}>
            <h1 className={styles.title}>{copy.title}</h1>
            <p className={styles.intro}>{copy.intro}</p>
          </header>

          {/* --- Stats --- */}
          <section className={styles.statsRow} aria-label="Company at a glance">
            {stats.map((stat) => (
              <div className={styles.stat} key={stat.label}>
                <span className={styles.statNumber}>
                  <span className="counter" data-target={stat.target}>
                    0
                  </span>
                  {stat.suffix}
                </span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
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
