"use client";

import type { FormEvent } from "react";

import type { SettingsRecord } from "@/lib/schemas/settings";
import styles from "../../admin.module.css";
import Repeater from "../Repeater";
import { useSingleton } from "../useSingleton";

export default function SettingsForm({
  initial,
}: {
  initial: SettingsRecord;
}) {
  const { draft, patch, save, busy, error, saved } = useSingleton(
    "settings",
    initial
  );

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void save();
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="whatsapp">
            WhatsApp number
          </label>
          <input
            id="whatsapp"
            className={styles.input}
            value={draft.whatsapp}
            onChange={(event) => patch({ whatsapp: event.target.value })}
          />
          <span className={styles.hint}>
            Digits only, country code first — 916398792951. Used for every
            WhatsApp link on the site.
          </span>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="phone">
            Phone number
          </label>
          <input
            id="phone"
            className={styles.input}
            value={draft.phone}
            onChange={(event) => patch({ phone: event.target.value })}
          />
          <span className={styles.hint}>
            Dialled by the Call Now button, so include the + and country code.
          </span>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={styles.input}
            value={draft.email}
            onChange={(event) => patch({ email: event.target.value })}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="address">
            Address
          </label>
          <input
            id="address"
            className={styles.input}
            value={draft.address}
            onChange={(event) => patch({ address: event.target.value })}
          />
        </div>

        <div className={`${styles.field} ${styles.formGridFull}`}>
          <label className={styles.label} htmlFor="copyright">
            Copyright line
          </label>
          <input
            id="copyright"
            className={styles.input}
            value={draft.copyright}
            onChange={(event) => patch({ copyright: event.target.value })}
          />
          <span className={styles.hint}>
            Shown in the footer, followed by &quot;All rights reserved.&quot;
          </span>
        </div>

        <Repeater
          label="Social links"
          items={draft.social}
          onChange={(social) => patch({ social })}
          blank={() => ({ label: "", href: "https://" })}
          addLabel="Add a social link"
          renderItem={(item, update) => (
            <>
              <input
                className={styles.input}
                value={item.label}
                onChange={(event) => update({ label: event.target.value })}
                placeholder="Instagram"
                aria-label="Social network name"
              />
              <input
                className={styles.input}
                value={item.href}
                onChange={(event) => update({ href: event.target.value })}
                placeholder="https://instagram.com/yourhandle"
                aria-label="Profile URL"
              />
            </>
          )}
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {saved && <p className={styles.hint}>Saved. The site is updating.</p>}

      <div className={styles.formActions}>
        <button className={styles.primaryBtn} type="submit" disabled={busy}>
          {busy ? "Saving..." : "Save settings"}
        </button>
      </div>
    </form>
  );
}
