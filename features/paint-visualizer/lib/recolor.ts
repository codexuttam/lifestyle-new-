import { FINISH_PROFILES } from "../constants";
import type { PaintLayer, RegionMask } from "../types";
import { clampByte, hexToRgb } from "./color";

/**
 * The recolouring pipeline.
 *
 * Naively flooding a region with a flat colour destroys the photograph —
 * you lose the shadow in the cornice, the falloff away from the window, the
 * texture of the plaster, and the result reads as a coloured rectangle.
 *
 * Instead we treat the original pixel's luminance as a *shading map*: the
 * ratio of each pixel's brightness to the region's mean brightness tells us
 * how lit that spot is. We then apply the chosen paint colour scaled by that
 * ratio, so every shadow and highlight in the room survives the repaint.
 */

/** Rec. 709 luma — matches how the eye weights the channels. */
function luma(r: number, g: number, b: number): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Average luminance of the masked region, weighted by coverage. */
export function meanLumaInMask(source: ImageData, mask: RegionMask): number {
  const { data, width } = source;
  const { bounds } = mask;

  let weightedTotal = 0;
  let weight = 0;

  for (let y = bounds.minY; y <= bounds.maxY; y++) {
    const row = y * width;
    for (let x = bounds.minX; x <= bounds.maxX; x++) {
      const coverage = mask.data[row + x];
      if (coverage === 0) continue;
      const offset = (row + x) * 4;
      weightedTotal += luma(data[offset], data[offset + 1], data[offset + 2]) * coverage;
      weight += coverage;
    }
  }

  // Guard against a fully black region producing a divide-by-zero downstream.
  return weight > 0 ? Math.max(12, weightedTotal / weight) : 128;
}

/**
 * Applies one layer onto `target` in place.
 *
 * `target` starts as a copy of the original photo and is mutated by each
 * layer in turn, so overlapping layers stack the way a painter would expect.
 */
function applyLayer(target: ImageData, layer: PaintLayer): void {
  const { width } = target;
  const pixels = target.data;
  const { mask, meanLuma, opacity } = layer;
  const { bounds } = mask;

  const paint = hexToRgb(layer.hex);
  const profile = FINISH_PROFILES[layer.finish];

  for (let y = bounds.minY; y <= bounds.maxY; y++) {
    const row = y * width;
    for (let x = bounds.minX; x <= bounds.maxX; x++) {
      const coverage = mask.data[row + x];
      if (coverage === 0) continue;

      const alpha = (coverage / 255) * opacity;
      const offset = (row + x) * 4;

      const srcR = pixels[offset];
      const srcG = pixels[offset + 1];
      const srcB = pixels[offset + 2];

      // How lit is this pixel relative to the rest of the surface?
      const pixelLuma = luma(srcR, srcG, srcB);
      let shade = pixelLuma / meanLuma;

      // Pull the shading toward 1 (matte) or push it away (gloss), and clamp
      // so a blown-out window reflection cannot produce a neon wall.
      shade = 1 + (shade - 1) * profile.shadeGain;
      shade = Math.min(1.75, Math.max(0.25, shade));

      let paintedR = paint.r * shade;
      let paintedG = paint.g * shade;
      let paintedB = paint.b * shade;

      // Sheen: add a white specular term only where the surface is already
      // noticeably brighter than average.
      if (profile.specular > 0 && shade > 1.08) {
        const highlight = (shade - 1.08) * profile.specular * 255;
        paintedR += highlight;
        paintedG += highlight;
        paintedB += highlight;
      }

      pixels[offset] = clampByte(srcR + (paintedR - srcR) * alpha);
      pixels[offset + 1] = clampByte(srcG + (paintedG - srcG) * alpha);
      pixels[offset + 2] = clampByte(srcB + (paintedB - srcB) * alpha);
      // Alpha channel is left untouched — the photo is fully opaque.
    }
  }
}

/**
 * Composites every layer onto a fresh copy of the original photo.
 *
 * `scratch` is reused across renders so we are not allocating a multi-megabyte
 * buffer on every colour change.
 */
export function composite(
  original: ImageData,
  layers: PaintLayer[],
  scratch: ImageData
): ImageData {
  scratch.data.set(original.data);
  for (const layer of layers) {
    applyLayer(scratch, layer);
  }
  return scratch;
}
