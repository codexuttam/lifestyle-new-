"use client";

import type { FormEvent } from "react";

import type { HomeRecord } from "@/lib/schemas/home";
import styles from "../../admin.module.css";
import MediaPicker from "../MediaPicker";
import Repeater from "../Repeater";
import { useSingleton } from "../useSingleton";
import IdPicker, { type Option } from "./IdPicker";

export default function HomeForm({
  initial,
  projectOptions,
  serviceOptions,
}: {
  initial: HomeRecord;
  projectOptions: Option[];
  serviceOptions: Option[];
}) {
  const { draft, patch, save, busy, error, saved } = useSingleton(
    "home",
    initial
  );

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void save();
  }

  /** Patch one nested section without clobbering the rest of it. */
  function section<K extends keyof HomeRecord>(
    key: K,
    value: Partial<HomeRecord[K]>
  ) {
    patch({ [key]: { ...draft[key], ...value } } as Partial<HomeRecord>);
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      {/* --- Composition --- */}
      <h2 className={styles.sectionHeading}>What the homepage shows</h2>
      <div className={styles.formGrid}>
        <IdPicker
          label="Featured projects (carousel)"
          hint="The first is the large card; the next two fill the smaller ones."
          options={projectOptions}
          value={draft.composition.featuredProjectIds}
          onChange={(featuredProjectIds) =>
            section("composition", { featuredProjectIds })
          }
        />

        <IdPicker
          label="Listing cards (All Properties)"
          hint="The three stacked cards further down the page."
          options={projectOptions}
          value={draft.composition.listingProjectIds}
          onChange={(listingProjectIds) =>
            section("composition", { listingProjectIds })
          }
          required={3}
        />

        <IdPicker
          label="Featured services"
          hint="The grid animates exactly four cards."
          options={serviceOptions}
          value={draft.composition.featuredServiceIds}
          onChange={(featuredServiceIds) =>
            section("composition", { featuredServiceIds })
          }
          required={4}
        />

        <div className={styles.field}>
          <label className={styles.label} htmlFor="exploreProject">
            Project named in the Explore section
          </label>
          <select
            id="exploreProject"
            className={styles.select}
            value={draft.composition.exploreProjectId}
            onChange={(event) =>
              section("composition", { exploreProjectId: event.target.value })
            }
          >
            {projectOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* --- Hero --- */}
      <h2 className={styles.sectionHeading}>Hero</h2>
      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="heroHeadline">
            Headline
          </label>
          <input
            id="heroHeadline"
            className={styles.input}
            value={draft.hero.headline}
            onChange={(event) => section("hero", { headline: event.target.value })}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="heroCta">
            Button label
          </label>
          <input
            id="heroCta"
            className={styles.input}
            value={draft.hero.ctaLabel}
            onChange={(event) => section("hero", { ctaLabel: event.target.value })}
          />
        </div>

        <div className={`${styles.field} ${styles.formGridFull}`}>
          <label className={styles.label} htmlFor="heroDescription">
            Description
          </label>
          <textarea
            id="heroDescription"
            className={styles.textarea}
            value={draft.hero.description}
            onChange={(event) =>
              section("hero", { description: event.target.value })
            }
          />
        </div>

        <div className={styles.formGridFull}>
          <MediaPicker
            id="heroVideo"
            label="Background video"
            value={draft.hero.backgroundVideo}
            onChange={(url) => section("hero", { backgroundVideo: url })}
            folder="site"
            accept="video/mp4,video/webm"
          />
        </div>

        <div className={styles.formGridFull}>
          <MediaPicker
            id="heroBuilding"
            label="Building image"
            value={draft.hero.buildingImage}
            onChange={(url) => section("hero", { buildingImage: url })}
            folder="site"
          />
        </div>

        <div className={styles.formGridFull}>
          <MediaPicker
            id="heroInfoImage"
            label="Info box image"
            value={draft.hero.infoImage}
            onChange={(url) => section("hero", { infoImage: url })}
            folder="site"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="heroPrice">
            Info box price
          </label>
          <input
            id="heroPrice"
            className={styles.input}
            value={draft.hero.infoPrice}
            onChange={(event) => section("hero", { infoPrice: event.target.value })}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="heroCaption">
            Info box caption
          </label>
          <input
            id="heroCaption"
            className={styles.input}
            value={draft.hero.infoCaption}
            onChange={(event) =>
              section("hero", { infoCaption: event.target.value })
            }
          />
        </div>
      </div>

      {/* --- About --- */}
      <h2 className={styles.sectionHeading}>About section</h2>
      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="aboutLabel">
            Label
          </label>
          <input
            id="aboutLabel"
            className={styles.input}
            value={draft.about.label}
            onChange={(event) => section("about", { label: event.target.value })}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="aboutCta">
            Button label
          </label>
          <input
            id="aboutCta"
            className={styles.input}
            value={draft.about.ctaLabel}
            onChange={(event) => section("about", { ctaLabel: event.target.value })}
          />
        </div>

        <div className={`${styles.field} ${styles.formGridFull}`}>
          <label className={styles.label} htmlFor="aboutStatement">
            Statement
          </label>
          <textarea
            id="aboutStatement"
            className={styles.textarea}
            value={draft.about.statement}
            onChange={(event) =>
              section("about", { statement: event.target.value })
            }
          />
        </div>

        <Repeater
          label="Stat cards (exactly three)"
          items={draft.about.cards}
          onChange={(cards) => section("about", { cards })}
          fixedLength
          blank={() => ({
            img: "",
            alt: "",
            prefix: "",
            target: 0,
            suffix: "",
            label: "",
            desc: "",
          })}
          renderItem={(card, update, index) => (
            <>
              <MediaPicker
                id={`aboutCard${index}`}
                label="Image"
                value={card.img}
                onChange={(url) => update({ img: url })}
                folder="site"
              />
              <input
                className={styles.input}
                value={card.alt}
                onChange={(event) => update({ alt: event.target.value })}
                placeholder="Alt text"
                aria-label="Alt text"
              />
              <div className={styles.repeaterRow}>
                <input
                  className={styles.input}
                  value={card.prefix}
                  onChange={(event) => update({ prefix: event.target.value })}
                  placeholder="Prefix (+)"
                  aria-label="Prefix"
                />
                <input
                  className={styles.input}
                  type="number"
                  value={card.target}
                  onChange={(event) =>
                    update({ target: Number(event.target.value) })
                  }
                  aria-label="Number"
                />
                <input
                  className={styles.input}
                  value={card.suffix}
                  onChange={(event) => update({ suffix: event.target.value })}
                  placeholder="Suffix (%)"
                  aria-label="Suffix"
                />
              </div>
              <input
                className={styles.input}
                value={card.label}
                onChange={(event) => update({ label: event.target.value })}
                placeholder="Projects Completed"
                aria-label="Label"
              />
              <textarea
                className={styles.textarea}
                value={card.desc}
                onChange={(event) => update({ desc: event.target.value })}
                aria-label="Description"
              />
            </>
          )}
        />
      </div>

      {/* --- Explore --- */}
      <h2 className={styles.sectionHeading}>Explore section</h2>
      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="exploreTag">
            Tag
          </label>
          <input
            id="exploreTag"
            className={styles.input}
            value={draft.explore.tag}
            onChange={(event) => section("explore", { tag: event.target.value })}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="exploreProgress">
            Progress (%)
          </label>
          <input
            id="exploreProgress"
            type="number"
            min={0}
            max={100}
            className={styles.input}
            value={draft.explore.progress}
            onChange={(event) =>
              section("explore", { progress: Number(event.target.value) })
            }
          />
        </div>

        <div className={`${styles.field} ${styles.formGridFull}`}>
          <label className={styles.label} htmlFor="exploreHeadline">
            Headline
          </label>
          <textarea
            id="exploreHeadline"
            className={styles.textarea}
            value={draft.explore.headline}
            onChange={(event) =>
              section("explore", { headline: event.target.value })
            }
          />
          <span className={styles.hint}>Animated one word at a time.</span>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="exploreOverlayLabel">
            Overlay label
          </label>
          <input
            id="exploreOverlayLabel"
            className={styles.input}
            value={draft.explore.overlayLabel}
            onChange={(event) =>
              section("explore", { overlayLabel: event.target.value })
            }
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="exploreOverlaySublabel">
            Overlay sublabel
          </label>
          <input
            id="exploreOverlaySublabel"
            className={styles.input}
            value={draft.explore.overlaySublabel}
            onChange={(event) =>
              section("explore", { overlaySublabel: event.target.value })
            }
          />
        </div>

        <div className={styles.formGridFull}>
          <MediaPicker
            id="exploreVideo"
            label="Video"
            value={draft.explore.video}
            onChange={(url) => section("explore", { video: url })}
            folder="site"
            accept="video/mp4,video/webm"
          />
        </div>
      </div>

      {/* --- Remaining section copy --- */}
      <h2 className={styles.sectionHeading}>Section headings</h2>
      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="propsTag">
            Properties tag
          </label>
          <input
            id="propsTag"
            className={styles.input}
            value={draft.properties.tag}
            onChange={(event) =>
              section("properties", { tag: event.target.value })
            }
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="propsCta">
            Properties button
          </label>
          <input
            id="propsCta"
            className={styles.input}
            value={draft.properties.ctaLabel}
            onChange={(event) =>
              section("properties", { ctaLabel: event.target.value })
            }
          />
        </div>

        <div className={`${styles.field} ${styles.formGridFull}`}>
          <label className={styles.label} htmlFor="propsHeading">
            Properties heading
          </label>
          <textarea
            id="propsHeading"
            className={styles.textarea}
            value={draft.properties.heading}
            onChange={(event) =>
              section("properties", { heading: event.target.value })
            }
          />
        </div>

        <div className={`${styles.field} ${styles.formGridFull}`}>
          <label className={styles.label} htmlFor="propsDesc">
            Properties description
          </label>
          <textarea
            id="propsDesc"
            className={styles.textarea}
            value={draft.properties.description}
            onChange={(event) =>
              section("properties", { description: event.target.value })
            }
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="servicesHeading">
            Services heading
          </label>
          <input
            id="servicesHeading"
            className={styles.input}
            value={draft.services.heading}
            onChange={(event) =>
              section("services", { heading: event.target.value })
            }
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="servicesCta">
            Services button
          </label>
          <input
            id="servicesCta"
            className={styles.input}
            value={draft.services.ctaLabel}
            onChange={(event) =>
              section("services", { ctaLabel: event.target.value })
            }
          />
        </div>

        <div className={`${styles.field} ${styles.formGridFull}`}>
          <label className={styles.label} htmlFor="servicesIntro">
            Services intro
          </label>
          <textarea
            id="servicesIntro"
            className={styles.textarea}
            value={draft.services.intro}
            onChange={(event) =>
              section("services", { intro: event.target.value })
            }
          />
          <span className={styles.hint}>
            Follows &quot;At The Premium Construction,&quot; on the page.
          </span>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="allLabel">
            All Properties label
          </label>
          <input
            id="allLabel"
            className={styles.input}
            value={draft.allProperties.label}
            onChange={(event) =>
              section("allProperties", { label: event.target.value })
            }
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="allCta">
            All Properties button
          </label>
          <input
            id="allCta"
            className={styles.input}
            value={draft.allProperties.ctaLabel}
            onChange={(event) =>
              section("allProperties", { ctaLabel: event.target.value })
            }
          />
        </div>

        <div className={`${styles.field} ${styles.formGridFull}`}>
          <label className={styles.label} htmlFor="allHeading">
            All Properties heading
          </label>
          <input
            id="allHeading"
            className={styles.input}
            value={draft.allProperties.heading}
            onChange={(event) =>
              section("allProperties", { heading: event.target.value })
            }
          />
        </div>

        <div className={styles.formGridFull}>
          <MediaPicker
            id="allBanner"
            label="All Properties banner video"
            value={draft.allProperties.bannerVideo}
            onChange={(url) => section("allProperties", { bannerVideo: url })}
            folder="site"
            accept="video/mp4,video/webm"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="testimonialsBadge">
            Testimonials badge
          </label>
          <input
            id="testimonialsBadge"
            className={styles.input}
            value={draft.testimonials.badge}
            onChange={(event) =>
              section("testimonials", { badge: event.target.value })
            }
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="faqBadge">
            FAQ badge
          </label>
          <input
            id="faqBadge"
            className={styles.input}
            value={draft.faq.badge}
            onChange={(event) => section("faq", { badge: event.target.value })}
          />
        </div>

        <div className={`${styles.field} ${styles.formGridFull}`}>
          <label className={styles.label} htmlFor="faqTitle">
            FAQ heading
          </label>
          <input
            id="faqTitle"
            className={styles.input}
            value={draft.faq.title}
            onChange={(event) => section("faq", { title: event.target.value })}
          />
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {saved && <p className={styles.hint}>Saved. The site is updating.</p>}

      <div className={styles.formActions}>
        <button className={styles.primaryBtn} type="submit" disabled={busy}>
          {busy ? "Saving..." : "Save landing page"}
        </button>
      </div>
    </form>
  );
}
