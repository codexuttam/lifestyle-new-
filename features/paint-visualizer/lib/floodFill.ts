import type { ImageAnalysis } from "./imageAnalysis";
import type { MaskBounds, RegionMask } from "../types";
import { SEAM_CLOSE_PASSES } from "../constants";

/**
 * Scanline flood fill used to select a wall from a single click.
 *
 * Three conditions decide whether a pixel joins the selection:
 *
 *  1. **Chromaticity** close to the seed. A wall's colour is near-constant
 *     even as its brightness falls off across the room, so this is what
 *     actually identifies "the same paint".
 *  2. **Luminance** within a generous band. Purely to stop the fill from
 *     running into deep shadow or a blown-out window that happens to share
 *     the wall's hue.
 *  3. **Not on an edge.** A high luminance gradient means a real boundary —
 *     cornice, skirting, the silhouette of a sofa — and the fill stops there.
 *
 * Together these fill a whole shaded wall cleanly, which plain RGB-distance
 * matching cannot do: it either leaves holes wherever the light changes, or
 * floods the entire photo once the tolerance is raised enough to close them.
 */

export interface FloodFillOptions {
  /** Selection tolerance, 4–60 from the UI slider. */
  tolerance: number;
}

/**
 * Two predicates derived from the clicked pixel.
 *
 * `strict` gates the fill itself and includes the edge barrier. `relaxed`
 * drops the edge test and is used only to grow back over the boundary seam —
 * see `growAlongSurface`.
 */
interface SurfaceMatcher {
  strict: (index: number) => boolean;
  relaxed: (index: number) => boolean;
}

function createMatcher(
  analysis: ImageAnalysis,
  seed: number,
  tolerance: number
): SurfaceMatcher {
  const { luminance, chromaA, chromaB, gradient } = analysis;

  // Chromaticity is a tight metric — a few units separate distinct materials,
  // so the slider maps into a deliberately narrow range.
  const chromaThreshold = 1.5 + tolerance * 0.3;
  const chromaThresholdSq = chromaThreshold * chromaThreshold;

  // Luminance may roam much further, since shading is exactly what we want to
  // forgive — and the band is deliberately asymmetric. A wall gets far
  // brighter near a window than it gets darker in shadow, so a symmetric band
  // wide enough for the highlights would also swallow dark objects. Going
  // generous upward and conservative downward tracks how rooms are actually
  // lit, and stops bright pools of light near the window from being left
  // unpainted as pale halos.
  // Both directions are generous: a room lit from one side can easily swing
  // 100 luminance levels across a single wall. Discrimination is the job of
  // the chroma test and the edge barrier — this band only exists to stop the
  // fill escaping into something genuinely far away in brightness.
  const lumAbove = 70 + tolerance * 3.6;
  const lumBelow = 60 + tolerance * 2.4;

  // Local-contrast level that counts as a boundary, in Weber units. Smooth
  // shading across a wall sits around 0.01–0.03; the step at a skirting board
  // or a sofa silhouette is an order of magnitude higher.
  const edgeLimit = 0.04 + tolerance * 0.0024;

  const seedChromaA = chromaA[seed];
  const seedChromaB = chromaB[seed];
  const seedLuma = luminance[seed];

  const sameSurface = (index: number): boolean => {
    const lumDelta = luminance[index] - seedLuma;
    if (lumDelta > lumAbove || lumDelta < -lumBelow) return false;
    const da = chromaA[index] - seedChromaA;
    const db = chromaB[index] - seedChromaB;
    return da * da + db * db <= chromaThresholdSq;
  };

  return {
    strict: (index) => gradient[index] <= edgeLimit && sameSurface(index),
    relaxed: sameSurface,
  };
}

/**
 * Expands the mask into neighbouring pixels that still look like the same
 * surface, ignoring the edge barrier.
 *
 * The barrier is what stops the fill running onto the sofa, but it also
 * leaves a one-to-three pixel unpainted seam tracing every object — which
 * renders as a pale halo around furniture. Growing back only into pixels
 * that still match the wall's colour closes that seam without bleeding onto
 * the object itself.
 */
function growAlongSurface(
  mask: Uint8ClampedArray,
  width: number,
  height: number,
  matcher: SurfaceMatcher,
  maxDistance: number
): void {
  const total = width * height;

  // Multi-source BFS seeded from every painted pixel that touches an
  // unpainted one. The distance cap keeps growth local to the seam so it
  // cannot wander off across a same-coloured curtain on the far side of an
  // edge it was never allowed to cross.
  let frontier: number[] = [];
  for (let index = 0; index < total; index++) {
    if (mask[index] === 0) continue;
    const x = index % width;
    const y = (index / width) | 0;
    const exposed =
      (x > 0 && mask[index - 1] === 0) ||
      (x < width - 1 && mask[index + 1] === 0) ||
      (y > 0 && mask[index - width] === 0) ||
      (y < height - 1 && mask[index + width] === 0);
    if (exposed) frontier.push(index);
  }

  for (let step = 0; step < maxDistance && frontier.length > 0; step++) {
    const next: number[] = [];

    for (const index of frontier) {
      const x = index % width;
      const y = (index / width) | 0;

      const neighbours = [
        x > 0 ? index - 1 : -1,
        x < width - 1 ? index + 1 : -1,
        y > 0 ? index - width : -1,
        y < height - 1 ? index + width : -1,
      ];

      for (const neighbour of neighbours) {
        if (neighbour < 0) continue;
        if (mask[neighbour] > 0) continue;
        if (!matcher.relaxed(neighbour)) continue;
        mask[neighbour] = 255;
        next.push(neighbour);
      }
    }

    frontier = next;
  }
}

export function floodFillMask(
  analysis: ImageAnalysis,
  seedX: number,
  seedY: number,
  { tolerance }: FloodFillOptions
): RegionMask | null {
  const { width, height } = analysis;

  const startX = Math.round(seedX);
  const startY = Math.round(seedY);
  if (startX < 0 || startY < 0 || startX >= width || startY >= height) return null;

  const seed = startY * width + startX;
  const matcher = createMatcher(analysis, seed, tolerance);
  const matches = matcher.strict;

  const mask = new Uint8ClampedArray(width * height);
  const visited = new Uint8Array(width * height);

  const bounds: MaskBounds = { minX: startX, minY: startY, maxX: startX, maxY: startY };
  let pixelCount = 0;

  const stack: number[] = [startX, startY];

  while (stack.length > 0) {
    const y = stack.pop() as number;
    const x = stack.pop() as number;

    const rowStart = y * width;
    if (visited[rowStart + x]) continue;
    if (!matches(rowStart + x)) continue;

    let left = x;
    while (left > 0 && !visited[rowStart + left - 1] && matches(rowStart + left - 1)) {
      left--;
    }

    let right = x;
    while (
      right < width - 1 &&
      !visited[rowStart + right + 1] &&
      matches(rowStart + right + 1)
    ) {
      right++;
    }

    if (left < bounds.minX) bounds.minX = left;
    if (right > bounds.maxX) bounds.maxX = right;
    if (y < bounds.minY) bounds.minY = y;
    if (y > bounds.maxY) bounds.maxY = y;

    for (let i = left; i <= right; i++) {
      visited[rowStart + i] = 1;
      mask[rowStart + i] = 255;
      pixelCount++;
    }

    for (const neighbourY of [y - 1, y + 1]) {
      if (neighbourY < 0 || neighbourY >= height) continue;
      const neighbourRow = neighbourY * width;
      let inSpan = false;
      for (let i = left; i <= right; i++) {
        const candidate = neighbourRow + i;
        const usable = !visited[candidate] && matches(candidate);
        if (usable && !inSpan) {
          stack.push(i, neighbourY);
          inSpan = true;
        } else if (!usable) {
          inSpan = false;
        }
      }
    }
  }

  if (pixelCount === 0) return null;

  // Close the seam the edge barrier left along every boundary.
  growAlongSurface(mask, width, height, matcher, SEAM_CLOSE_PASSES);

  // Growing may have pushed the region a few pixels past the recorded bounds.
  bounds.minX = Math.max(0, bounds.minX - SEAM_CLOSE_PASSES);
  bounds.minY = Math.max(0, bounds.minY - SEAM_CLOSE_PASSES);
  bounds.maxX = Math.min(width - 1, bounds.maxX + SEAM_CLOSE_PASSES);
  bounds.maxY = Math.min(height - 1, bounds.maxY + SEAM_CLOSE_PASSES);

  return { data: mask, bounds, pixelCount };
}
