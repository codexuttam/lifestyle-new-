"use client";

import { useCopyToClipboard } from "../hooks/useCopyToClipboard";
import {
  contrastRatio,
  formatHsl,
  formatRgb,
  getHarmonies,
  readableInkOn,
} from "../lib/color";
import { findColorByHex } from "../data/palette";
import styles from "./PaintVisualizer.module.css";

interface ColorDetailsPanelProps {
  hex: string;
  name: string;
  shortlisted: boolean;
  onToggleShortlist: () => void;
  onSelectHex: (hex: string) => void;
}

/**
 * Everything about the currently selected colour, including the copyable
 * codes — the reason most visitors open this tool in the first place.
 */
export default function ColorDetailsPanel({
  hex,
  name,
  shortlisted,
  onToggleShortlist,
  onSelectHex,
}: ColorDetailsPanelProps) {
  const { copy, copiedKey } = useCopyToClipboard();

  const codes = [
    { key: "hex", label: "HEX", value: hex.toUpperCase() },
    { key: "rgb", label: "RGB", value: formatRgb(hex) },
    { key: "hsl", label: "HSL", value: formatHsl(hex) },
  ];

  const harmonies = getHarmonies(hex);
  const pairings = [
    { label: "Complementary", hex: harmonies.complementary },
    { label: "Analogous", hex: harmonies.analogous[0] },
    { label: "Analogous", hex: harmonies.analogous[1] },
    { label: "Triadic", hex: harmonies.triadic[0] },
  ];

  // Whether dark text will read on this wall colour — useful for signage,
  // feature-wall lettering, and picking a trim.
  const inkContrast = contrastRatio(hex, "#1a1613");

  return (
    <section className={styles.panel} aria-labelledby="details-heading">
      <h3 id="details-heading" className={styles.panelTitle}>
        Colour details
      </h3>

      <div
        className={styles.colorHero}
        style={{ background: hex, color: readableInkOn(hex) }}
      >
        <span className={styles.colorHeroName}>{name}</span>
        <span className={styles.colorHeroHex}>{hex.toUpperCase()}</span>
      </div>

      <ul className={styles.codeList}>
        {codes.map((code) => (
          <li key={code.key} className={styles.codeRow}>
            <span className={styles.codeLabel}>{code.label}</span>
            <code className={styles.codeValue}>{code.value}</code>
            <button
              type="button"
              className={styles.copyButton}
              onClick={() => void copy(code.value, code.key)}
              aria-label={`Copy ${code.label} value ${code.value}`}
            >
              {copiedKey === code.key ? "Copied" : "Copy"}
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={styles.secondaryButton}
        onClick={onToggleShortlist}
        aria-pressed={shortlisted}
      >
        {shortlisted ? "★ Saved to shortlist" : "☆ Save to shortlist"}
      </button>

      <p className={styles.metaNote}>
        Dark text contrast {inkContrast.toFixed(1)}:1 —{" "}
        {inkContrast >= 4.5 ? "readable for signage and trim" : "use light trim instead"}
      </p>

      <h4 className={styles.subheading}>Goes well with</h4>
      <ul className={styles.harmonyRow}>
        {pairings.map((pairing, index) => {
          const catalogued = findColorByHex(pairing.hex);
          return (
            <li key={`${pairing.hex}-${index}`}>
              <button
                type="button"
                className={styles.harmonySwatch}
                style={{ background: pairing.hex, color: readableInkOn(pairing.hex) }}
                onClick={() => onSelectHex(pairing.hex)}
                title={`${pairing.label} · ${pairing.hex.toUpperCase()}`}
              >
                <span className={styles.harmonyLabel}>
                  {catalogued?.name ?? pairing.label}
                </span>
                <span className={styles.harmonyHex}>{pairing.hex.toUpperCase()}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
