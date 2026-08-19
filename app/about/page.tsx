import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import { getSettings } from "@/lib/content/settings";
import { whatsappHref } from "@/lib/schemas/settings";
import SiteFooter from "@/components/SiteFooter";
import RevealAnimations from "@/components/RevealAnimations";
import { getCompany } from "@/lib/content/company";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "About Us | The Premium Construction",
  description:
    "Who we are: a turnkey residential builder working across Delhi NCR since 2012 — 340+ homes delivered on fixed-price contracts, with design, approvals, structure and finishing handled by one team.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Us | The Premium Construction",
    description:
      "A turnkey residential builder working across Delhi NCR since 2012, with design, approvals, structure and finishing handled by one team.",
    type: "website",
  },
};

const STORY_IMAGES = [
  {
    src: "/images/project_1_1779380254029.png",
    alt: "Casa Meridian, a completed The Premium Construction home",
  },
  {
    src: "/images/gallery_2_1779379510372.png",
    alt: "A site under construction by The Premium Construction",
  },
  {
    src: "/images/project_3_1779380290833.png",
    alt: "Arken House, a completed The Premium Construction home",
  },
];

export default async function AboutPage() {
  const [company, settings] = await Promise.all([getCompany(), getSettings()]);
  const { stats, milestones, processSteps, values, brands } = company;

  return (
    <>
      <RevealAnimations />
      <SiteNav activeHref="/about" />

      <main className={styles.page}>
        <div className={styles.inner}>
          <header className={styles.header}>
            <div className={styles.badge}>
              <span className={styles.badgeDot} aria-hidden="true" />
              <span className={styles.badgeText}>About us</span>
            </div>
            <h1 className={styles.title}>We Build Homes People Stay In</h1>
            <p className={styles.intro}>
              The Premium Construction is a turnkey residential builder working
              across Delhi NCR. We combine engineering rigour with expert
              industry knowledge to simplify designing, building and owning a
              home — one team, one contract, from bare plot to handover.
            </p>
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
              <h2 className={styles.sectionTitle}>How we got here</h2>
              <p className={styles.body}>
                We started in 2012 with a three-person site team and a single
                plot in Gurugram. What we kept running into was the same thing
                every owner complains about — an architect blaming the
                contractor, a contractor blaming the drawings, and a budget that
                drifted every month.
              </p>
              <p className={styles.body}>
                So we built the firm to remove that gap. Architecture,
                structural design, approvals, construction and finishing all sit
                with us, on one fixed-price contract, with a dedicated site
                manager you can call directly. Twelve years and 340 homes later,
                that is still the whole idea.
              </p>
              <div className={styles.storyLinks}>
                <Link href="/projects" className={styles.primaryBtn}>
                  See our projects
                </Link>
                <Link href="/services" className={styles.secondaryBtn}>
                  Browse services
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
            <h2 className={styles.sectionTitle}>What we hold ourselves to</h2>
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
            <h2 className={styles.sectionTitle}>Milestones</h2>
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
            <h2 className={styles.sectionTitle}>How a build runs</h2>
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
            <h2 className={styles.sectionTitle}>Materials we build with</h2>
            <p className={styles.body}>
              The bill of materials is published in your contract, and these are
              the names on it. No substitutions without your sign-off.
            </p>
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
            <h2 className={styles.ctaTitle}>Have a plot in mind?</h2>
            <p className={styles.ctaText}>
              Send us the location and plot size — we will come back with a
              feasibility read and an honest cost range before you commit to
              anything.
            </p>
            <a href={whatsappHref(settings)} className={styles.primaryBtn}>
              Talk to us on WhatsApp
            </a>
          </section>
        </div>
      </main>

      <SiteFooter settings={settings} />
    </>
  );
}
