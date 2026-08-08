import type { MaskBounds, RegionMask } from "../types";

/**
 * Operations on coverage masks.
 *
 * A raw flood fill has hard, aliased edges that read as a cut-out sticker.
 * Feathering the mask before compositing is what makes the recolour look
 * like paint rather than a paint-bucket tool.
 */

function expandBounds(bounds: MaskBounds, by: number, width: number, height: number): MaskBounds {
  return {
    minX: Math.max(0, bounds.minX - by),
    minY: Math.max(0, bounds.minY - by),
    maxX: Math.min(width - 1, bounds.maxX + by),
    maxY: Math.min(height - 1, bounds.maxY + by),
  };
}

/**
 * Separable box blur restricted to the mask's bounding box.
 *
 * Two passes approximate a Gaussian closely enough for a 1–3px feather and
 * cost far less than a true Gaussian kernel.
 */
export function featherMask(
  mask: RegionMask,
  width: number,
  height: number,
  radius: number
): RegionMask {
  if (radius <= 0) return mask;

  const bounds = expandBounds(mask.bounds, radius * 2 + 1, width, height);
  let current = Uint8ClampedArray.from(mask.data);
  const scratch = new Uint8ClampedArray(current.length);

  for (let pass = 0; pass < 2; pass++) {
    // Horizontal
    for (let y = bounds.minY; y <= bounds.maxY; y++) {
      const row = y * width;
      for (let x = bounds.minX; x <= bounds.maxX; x++) {
        let total = 0;
        let samples = 0;
        for (let k = -radius; k <= radius; k++) {
          const sx = x + k;
          if (sx < 0 || sx >= width) continue;
          total += current[row + sx];
          samples++;
        }
        scratch[row + x] = samples > 0 ? total / samples : 0;
      }
    }

    // Vertical
    for (let y = bounds.minY; y <= bounds.maxY; y++) {
      const row = y * width;
      for (let x = bounds.minX; x <= bounds.maxX; x++) {
        let total = 0;
        let samples = 0;
        for (let k = -radius; k <= radius; k++) {
          const sy = y + k;
          if (sy < 0 || sy >= height) continue;
          total += scratch[sy * width + x];
          samples++;
        }
        current[row + x] = samples > 0 ? total / samples : 0;
      }
    }
  }

  return { data: current, bounds, pixelCount: mask.pixelCount };
}

/**
 * Grows the mask by `radius` pixels.
 *
 * The fill deliberately refuses to cross high-gradient pixels, which leaves a
 * thin unpainted seam hugging every boundary. Dilating by a pixel or two
 * reclaims that seam so the colour meets the cornice and skirting cleanly,
 * before feathering softens the join.
 */
export function dilateMask(
  mask: RegionMask,
  width: number,
  height: number,
  radius: number
): RegionMask {
  if (radius <= 0) return mask;

  const bounds = expandBounds(mask.bounds, radius + 1, width, height);
  const source = mask.data;
  const data = Uint8ClampedArray.from(source);

  for (let y = bounds.minY; y <= bounds.maxY; y++) {
    const row = y * width;
    for (let x = bounds.minX; x <= bounds.maxX; x++) {
      if (source[row + x] > 0) continue;

      let maximum = 0;
      for (let dy = -radius; dy <= radius && maximum === 0; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= height) continue;
        const neighbourRow = ny * width;
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx;
          if (nx < 0 || nx >= width) continue;
          if (source[neighbourRow + nx] > 0) {
            maximum = 255;
            break;
          }
        }
      }
      data[row + x] = maximum;
    }
  }

  return { data, bounds, pixelCount: mask.pixelCount };
}

/** Merges `addition` into `base`, keeping the strongest coverage per pixel. */
export function unionMasks(base: RegionMask, addition: RegionMask): RegionMask {
  const data = Uint8ClampedArray.from(base.data);
  for (let i = 0; i < data.length; i++) {
    if (addition.data[i] > data[i]) data[i] = addition.data[i];
  }
  return {
    data,
    bounds: {
      minX: Math.min(base.bounds.minX, addition.bounds.minX),
      minY: Math.min(base.bounds.minY, addition.bounds.minY),
      maxX: Math.max(base.bounds.maxX, addition.bounds.maxX),
      maxY: Math.max(base.bounds.maxY, addition.bounds.maxY),
    },
    pixelCount: base.pixelCount + addition.pixelCount,
  };
}

/** Removes `subtrahend`'s coverage from `base` — used by the eraser tool. */
export function subtractMask(base: RegionMask, subtrahend: RegionMask): RegionMask {
  const data = Uint8ClampedArray.from(base.data);
  let remaining = 0;
  for (let i = 0; i < data.length; i++) {
    if (subtrahend.data[i] > 0) {
      data[i] = Math.max(0, data[i] - subtrahend.data[i]);
    }
    if (data[i] > 0) remaining++;
  }
  return { data, bounds: base.bounds, pixelCount: remaining };
}

/** True when the mask covers enough of the frame to be worth painting. */
export function isMeaningfulSelection(mask: RegionMask, totalPixels: number): boolean {
  return mask.pixelCount / totalPixels > 0.002;
}
