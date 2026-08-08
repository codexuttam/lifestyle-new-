import type { PaintCollection, PaintColor } from "../types";

/**
 * The paint catalogue.
 *
 * Kept as data, not markup, so it can be swapped for a CMS query or a
 * supplier API later without touching a single component.
 */
export const PAINT_COLLECTIONS: PaintCollection[] = [
  {
    id: "whites",
    name: "Whites & Neutrals",
    description: "Light-multiplying bases that suit most Indian daylight.",
    colors: [
      { id: "chalk-white", name: "Chalk White", hex: "#f4f1ea", collection: "whites" },
      { id: "warm-linen", name: "Warm Linen", hex: "#ece5d8", collection: "whites" },
      { id: "soft-oat", name: "Soft Oat", hex: "#ded4c2", collection: "whites" },
      { id: "morning-mist", name: "Morning Mist", hex: "#e3e5e2", collection: "whites" },
      { id: "pale-stone", name: "Pale Stone", hex: "#cfc8bb", collection: "whites" },
      { id: "greige", name: "Quiet Greige", hex: "#b9b1a4", collection: "whites" },
    ],
  },
  {
    id: "earth",
    name: "Warm Earth",
    description: "Terracotta and clay tones that flatter warm wood and brass.",
    colors: [
      { id: "raw-clay", name: "Raw Clay", hex: "#c98b64", collection: "earth" },
      { id: "terracotta", name: "Terracotta", hex: "#b5603f", collection: "earth" },
      { id: "burnt-sienna", name: "Burnt Sienna", hex: "#8e4630", collection: "earth" },
      { id: "desert-sand", name: "Desert Sand", hex: "#dcbb92", collection: "earth" },
      { id: "spiced-ochre", name: "Spiced Ochre", hex: "#c08f2e", collection: "earth" },
      { id: "cocoa", name: "Deep Cocoa", hex: "#5d4438", collection: "earth" },
    ],
  },
  {
    id: "greens",
    name: "Greens",
    description: "Grounded, restful shades for bedrooms and studies.",
    colors: [
      { id: "sage", name: "Sage", hex: "#a8b5a0", collection: "greens" },
      { id: "olive-grove", name: "Olive Grove", hex: "#7c8464", collection: "greens" },
      { id: "eucalyptus", name: "Eucalyptus", hex: "#6f8c7f", collection: "greens" },
      { id: "forest-ink", name: "Forest Ink", hex: "#3c4f42", collection: "greens" },
      { id: "pistachio", name: "Pistachio", hex: "#c6d2ae", collection: "greens" },
      { id: "deep-teal", name: "Deep Teal", hex: "#265a5c", collection: "greens" },
    ],
  },
  {
    id: "blues",
    name: "Blues",
    description: "Cooling tones that read well on north-facing walls.",
    colors: [
      { id: "cloud-blue", name: "Cloud Blue", hex: "#c3d1dc", collection: "blues" },
      { id: "powder-slate", name: "Powder Slate", hex: "#9aabbb", collection: "blues" },
      { id: "denim", name: "Denim", hex: "#5b7391", collection: "blues" },
      { id: "indigo-night", name: "Indigo Night", hex: "#31415e", collection: "blues" },
      { id: "peacock", name: "Peacock", hex: "#1f5f78", collection: "blues" },
      { id: "midnight", name: "Midnight", hex: "#22283a", collection: "blues" },
    ],
  },
  {
    id: "statement",
    name: "Statement",
    description: "For a single accent wall — use sparingly, price the same.",
    colors: [
      { id: "dusty-rose", name: "Dusty Rose", hex: "#c99a9a", collection: "statement" },
      { id: "plum", name: "Aged Plum", hex: "#6d4358", collection: "statement" },
      { id: "mustard", name: "Mustard", hex: "#d0a02f", collection: "statement" },
      { id: "charcoal", name: "Charcoal", hex: "#3a3a3c", collection: "statement" },
      { id: "brick-red", name: "Brick Red", hex: "#9c3f38", collection: "statement" },
      { id: "graphite", name: "Graphite", hex: "#4b5157", collection: "statement" },
    ],
  },
];

/** Flat lookup for resolving a colour id coming from a URL or shortlist. */
export const PAINT_COLORS_BY_ID: Record<string, PaintColor> = Object.fromEntries(
  PAINT_COLLECTIONS.flatMap((collection) =>
    collection.colors.map((color) => [color.id, color] as const)
  )
);

export const DEFAULT_COLOR: PaintColor = PAINT_COLLECTIONS[2].colors[0]; // Sage

/** Best-effort friendly name for an arbitrary hex (custom picker values). */
export function findColorByHex(hex: string): PaintColor | undefined {
  const target = hex.toLowerCase();
  for (const collection of PAINT_COLLECTIONS) {
    const match = collection.colors.find((color) => color.hex === target);
    if (match) return match;
  }
  return undefined;
}
