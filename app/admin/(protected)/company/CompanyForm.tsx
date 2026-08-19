"use client";

import type { FormEvent } from "react";

import type { CompanyRecord } from "@/lib/schemas/company";
import styles from "../../admin.module.css";
import Repeater from "../Repeater";
import { useSingleton } from "../useSingleton";

export default function CompanyForm({ initial }: { initial: CompanyRecord }) {
  const { draft, patch, save, busy, error, saved } = useSingleton(
    "company",
    initial
  );

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void save();
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.formGrid}>
        <Repeater
          label="Headline stats"
          items={draft.stats}
          onChange={(stats) => patch({ stats })}
          blank={() => ({ target: 0, suffix: "", label: "" })}
          addLabel="Add a stat"
          renderItem={(item, update) => (
            <>
              <div className={styles.repeaterRow}>
                <input
                  className={styles.input}
                  type="number"
                  value={item.target}
                  onChange={(event) =>
                    update({ target: Number(event.target.value) })
                  }
                  aria-label="Number the counter climbs to"
                />
                <input
                  className={styles.input}
                  value={item.suffix}
                  onChange={(event) => update({ suffix: event.target.value })}
                  placeholder="+ or %"
                  aria-label="Suffix"
                />
              </div>
              <input
                className={styles.input}
                value={item.label}
                onChange={(event) => update({ label: event.target.value })}
                placeholder="Years of Experience"
                aria-label="Label"
              />
            </>
          )}
        />

        <Repeater
          label="Milestones"
          items={draft.milestones}
          onChange={(milestones) => patch({ milestones })}
          blank={() => ({ year: "", title: "", text: "" })}
          addLabel="Add a milestone"
          renderItem={(item, update) => (
            <>
              <div className={styles.repeaterRow}>
                <input
                  className={styles.input}
                  value={item.year}
                  onChange={(event) => update({ year: event.target.value })}
                  placeholder="2019"
                  aria-label="Year"
                />
                <input
                  className={styles.input}
                  value={item.title}
                  onChange={(event) => update({ title: event.target.value })}
                  placeholder="Fixed-price contracts"
                  aria-label="Title"
                />
              </div>
              <textarea
                className={styles.textarea}
                value={item.text}
                onChange={(event) => update({ text: event.target.value })}
                aria-label="Description"
              />
            </>
          )}
        />

        <Repeater
          label="What we hold ourselves to"
          items={draft.values}
          onChange={(values) => patch({ values })}
          blank={() => ({ title: "", text: "" })}
          addLabel="Add a commitment"
          renderItem={(item, update) => (
            <>
              <input
                className={styles.input}
                value={item.title}
                onChange={(event) => update({ title: event.target.value })}
                aria-label="Title"
              />
              <textarea
                className={styles.textarea}
                value={item.text}
                onChange={(event) => update({ text: event.target.value })}
                aria-label="Description"
              />
            </>
          )}
        />

        <Repeater
          label="Build process steps"
          items={draft.processSteps}
          onChange={(processSteps) => patch({ processSteps })}
          blank={() => ({ title: "", text: "" })}
          addLabel="Add a step"
          renderItem={(item, update) => (
            <>
              <input
                className={styles.input}
                value={item.title}
                onChange={(event) => update({ title: event.target.value })}
                aria-label="Step title"
              />
              <textarea
                className={styles.textarea}
                value={item.text}
                onChange={(event) => update({ text: event.target.value })}
                aria-label="Step description"
              />
            </>
          )}
        />

        <div className={`${styles.field} ${styles.formGridFull}`}>
          <label className={styles.label} htmlFor="brands">
            Material brands
          </label>
          <textarea
            id="brands"
            className={styles.textarea}
            value={draft.brands.join("\n")}
            onChange={(event) =>
              patch({
                brands: event.target.value
                  .split("\n")
                  .map((line) => line.trim())
                  .filter(Boolean),
              })
            }
          />
          <span className={styles.hint}>One brand per line.</span>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {saved && <p className={styles.hint}>Saved. The site is updating.</p>}

      <div className={styles.formActions}>
        <button className={styles.primaryBtn} type="submit" disabled={busy}>
          {busy ? "Saving..." : "Save about content"}
        </button>
      </div>
    </form>
  );
}
