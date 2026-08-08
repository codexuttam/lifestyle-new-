import type { PaintFinish } from "./types";

/**
 * Source photos are downscaled to this longest edge before we touch pixels.
 * Flood fill and compositing are O(pixels); 1600px keeps a full repaint
 * comfortably inside one animation frame on mid-range hardware while still
 * looking sharp on a 2x display.
 */
export const MAX_WORKING_DIMENSION = 1600;

/** Selection tolerance slider bounds. Drives chroma, luminance, and edge limits. */
export const TOLERANCE_MIN = 4;
export const TOLERANCE_MAX = 60;
/**
 * 20 is a compromise found by sweeping the preset rooms. Higher fills a
 * complex multi-plane wall in one click but starts creeping onto furniture
 * that shares the wall's colour (cream bedding against a cream wall is the
 * worst case). Lower is precise but leaves patches the user must click again.
 * Since a second click simply adds another surface in the same colour, and
 * Erase undoes overreach, erring slightly low is the cheaper mistake.
 */
export const TOLERANCE_DEFAULT = 20;

/**
 * How far (in pixels) the colour-guarded growth may reach past the edge
 * barrier to close the seam it leaves around objects. Only expands into
 * pixels that still match the surface, so it cannot bleed onto furniture —
 * the cap exists to stop it crossing an edge into a same-coloured neighbour.
 */
export const SEAM_CLOSE_PASSES = 14;

/**
 * Unguarded growth, applied after the guarded pass purely to cover the
 * single antialiased pixel sitting exactly on a boundary. Keep this at 1 —
 * larger values smear the colour over whatever the wall meets.
 */
export const DILATE_RADIUS = 1;

/** Edge softening applied to every selection, in pixels. */
export const FEATHER_RADIUS = 2;

export const DEFAULT_LAYER_OPACITY = 0.9;

/**
 * Finish profiles.
 *
 * `shadeGain` scales how much of the original shading survives — matte
 * flattens the light falloff, gloss exaggerates it. `specular` adds a
 * highlight back into the brightest part of the region.
 */
export const FINISH_PROFILES: Record<
  PaintFinish,
  { label: string; shadeGain: number; specular: number }
> = {
  matte: { label: "Matte", shadeGain: 0.82, specular: 0 },
  satin: { label: "Satin", shadeGain: 1, specular: 0.07 },
  gloss: { label: "Gloss", shadeGain: 1.14, specular: 0.16 },
};

export const SHORTLIST_STORAGE_KEY = "bc.paint-visualizer.shortlist";
export const SHORTLIST_LIMIT = 12;

/** Uploads larger than this are rejected before we try to decode them. */
export const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;
export const ACCEPTED_UPLOAD_TYPES = ["image/jpeg", "image/png", "image/webp"];
