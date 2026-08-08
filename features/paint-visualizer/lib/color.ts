import type { HarmonySet, Hsl, Rgb } from "../types";

/**
 * Colour maths. Pure functions only — no DOM, no React, so this module is
 * trivially unit-testable and reusable outside the visualizer.
 */

const HEX_PATTERN = /^#?([\da-f]{3}|[\da-f]{6})$/i;

export function clampByte(value: number): number {
  if (value < 0) return 0;
  if (value > 255) return 255;
  return Math.round(value);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Returns a canonical `#rrggbb` string, or null when the input is not a hex colour. */
export function normalizeHex(input: string): string | null {
  const match = HEX_PATTERN.exec(input.trim());
  if (!match) return null;

  let digits = match[1];
  if (digits.length === 3) {
    digits = digits
      .split("")
      .map((char) => char + char)
      .join("");
  }
  return `#${digits.toLowerCase()}`;
}

export function hexToRgb(hex: string): Rgb {
  const normalized = normalizeHex(hex) ?? "#000000";
  const value = Number.parseInt(normalized.slice(1), 16);
  return {
    r: (value >> 16) & 0xff,
    g: (value >> 8) & 0xff,
    b: value & 0xff,
  };
}

export function rgbToHex({ r, g, b }: Rgb): string {
  const channel = (value: number) => clampByte(value).toString(16).padStart(2, "0");
  return `#${channel(r)}${channel(g)}${channel(b)}`;
}

export function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;

  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  const lightness = (max + min) / 2;

  if (delta === 0) {
    return { h: 0, s: 0, l: Math.round(lightness * 100) };
  }

  const saturation = delta / (1 - Math.abs(2 * lightness - 1));

  let hue: number;
  if (max === rn) hue = ((gn - bn) / delta) % 6;
  else if (max === gn) hue = (bn - rn) / delta + 2;
  else hue = (rn - gn) / delta + 4;

  hue *= 60;
  if (hue < 0) hue += 360;

  return {
    h: Math.round(hue),
    s: Math.round(saturation * 100),
    l: Math.round(lightness * 100),
  };
}

export function hslToRgb({ h, s, l }: Hsl): Rgb {
  const hue = ((h % 360) + 360) % 360;
  const sat = clamp(s, 0, 100) / 100;
  const light = clamp(l, 0, 100) / 100;

  const chroma = (1 - Math.abs(2 * light - 1)) * sat;
  const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = light - chroma / 2;

  let rgb: [number, number, number];
  if (hue < 60) rgb = [chroma, x, 0];
  else if (hue < 120) rgb = [x, chroma, 0];
  else if (hue < 180) rgb = [0, chroma, x];
  else if (hue < 240) rgb = [0, x, chroma];
  else if (hue < 300) rgb = [x, 0, chroma];
  else rgb = [chroma, 0, x];

  return {
    r: clampByte((rgb[0] + m) * 255),
    g: clampByte((rgb[1] + m) * 255),
    b: clampByte((rgb[2] + m) * 255),
  };
}

export function hexToHsl(hex: string): Hsl {
  return rgbToHsl(hexToRgb(hex));
}

export function hslToHex(hsl: Hsl): string {
  return rgbToHex(hslToRgb(hsl));
}

/** WCAG relative luminance (0–1). */
export function relativeLuminance({ r, g, b }: Rgb): number {
  const linearize = (channel: number) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

/** WCAG contrast ratio between two hex colours (1–21). */
export function contrastRatio(hexA: string, hexB: string): number {
  const a = relativeLuminance(hexToRgb(hexA));
  const b = relativeLuminance(hexToRgb(hexB));
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Picks the ink colour (from the site's own tokens) that reads best on a
 * given swatch, so labels sitting on a colour are always legible.
 */
export function readableInkOn(hex: string): "#ffffff" | "#1a1613" {
  return contrastRatio(hex, "#1a1613") >= contrastRatio(hex, "#ffffff")
    ? "#1a1613"
    : "#ffffff";
}

/** Perceived brightness shorthand used for quick light/dark branching. */
export function isLightColor(hex: string): boolean {
  return relativeLuminance(hexToRgb(hex)) > 0.45;
}

export function formatRgb(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${r}, ${g}, ${b})`;
}

export function formatHsl(hex: string): string {
  const { h, s, l } = hexToHsl(hex);
  return `hsl(${h}, ${s}%, ${l}%)`;
}

/** Rotates hue while preserving saturation and lightness. */
export function rotateHue(hex: string, degrees: number): string {
  const hsl = hexToHsl(hex);
  return hslToHex({ ...hsl, h: hsl.h + degrees });
}

/**
 * Classic colour-wheel relationships, useful for suggesting a trim or
 * accent wall next to the colour the visitor just picked.
 */
export function getHarmonies(hex: string): HarmonySet {
  return {
    complementary: rotateHue(hex, 180),
    analogous: [rotateHue(hex, -30), rotateHue(hex, 30)],
    triadic: [rotateHue(hex, 120), rotateHue(hex, 240)],
  };
}

/** A softened version of a colour — handy for ceilings above an accent wall. */
export function tint(hex: string, amount: number): string {
  const hsl = hexToHsl(hex);
  return hslToHex({
    ...hsl,
    s: clamp(hsl.s - amount * 0.4, 0, 100),
    l: clamp(hsl.l + amount, 0, 100),
  });
}
