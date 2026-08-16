/**
 * Shared domain types for the Paint Visualizer feature.
 *
 * Everything the feature exposes is described here so the UI layer,
 * the canvas pipeline, and the data catalogue stay in agreement.
 */

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export interface Hsl {
  /** 0–360 */
  h: number;
  /** 0–100 */
  s: number;
  /** 0–100 */
  l: number;
}

/** Sheen of the paint — drives how much specular highlight we simulate. */
export type PaintFinish = "matte" | "satin" | "gloss";

export interface PaintColor {
  id: string;
  name: string;
  /** Normalised lowercase hex, e.g. "#e8e2d6". */
  hex: string;
  collection: string;
}

export interface PaintCollection {
  id: string;
  name: string;
  description: string;
  colors: PaintColor[];
}

/** A room the user can paint — shipped with the site, uploaded, or generated. */
export interface RoomSource {
  id: string;
  name: string;
  /** Object URL for uploads, public path for presets, empty for generated rooms. */
  src: string;
  description: string;
  origin: "preset" | "upload" | "blank";
}

export interface MaskBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface RegionMask {
  /** Coverage per pixel, 0–255, length = width * height. */
  data: Uint8ClampedArray;
  bounds: MaskBounds;
  pixelCount: number;
}

/**
 * One painted surface. Layers composite in array order, so a later layer
 * painted over the same pixels wins.
 */
export interface PaintLayer {
  id: string;
  label: string;
  hex: string;
  colorName: string;
  finish: PaintFinish;
  /** 0–1. How strongly the colour replaces the original surface. */
  opacity: number;
  mask: RegionMask;
  /** Average luminance of the masked region in the source photo (0–255). */
  meanLuma: number;
}

/** Serializable slice of editor state that undo/redo operates on. */
export interface EditorSnapshot {
  layers: PaintLayer[];
  activeLayerId: string | null;
}

export interface ShortlistEntry {
  hex: string;
  name: string;
  addedAt: number;
}

export type ColorFormat = "hex" | "rgb" | "hsl";

export interface HarmonySet {
  complementary: string;
  analogous: [string, string];
  triadic: [string, string];
}
