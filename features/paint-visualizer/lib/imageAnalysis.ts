/**
 * Per-image precomputation that the selection algorithm depends on.
 *
 * Both maps are derived once when a photo loads and reused for every click,
 * so the cost never appears in the interaction path.
 */

export interface ImageAnalysis {
  width: number;
  height: number;
  /** Rec.709 luminance per pixel, 0–255. */
  luminance: Float32Array;
  /**
   * Chromaticity per pixel — colour with brightness divided out, stored as
   * two channels scaled to roughly 0–255.
   *
   * This is the key to selecting a real wall: a wall in a photograph varies
   * enormously in *brightness* across its surface (light falls off away from
   * the window) but barely at all in *hue*. Matching on chromaticity follows
   * the paint; matching on RGB follows the lighting and tears holes in it.
   */
  chromaA: Float32Array;
  chromaB: Float32Array;
  /**
   * Local contrast: luminance gradient divided by local brightness.
   *
   * Relative rather than absolute, because absolute gradient is useless here.
   * A wall lit by a window carries a large absolute gradient across its bloom
   * — easily as large as the step at a sofa's edge — so an absolute threshold
   * either blocks the fill inside bright areas (leaving pale blobs) or lets it
   * escape onto furniture. Dividing by local brightness gives Weber-style
   * contrast, where smooth shading stays near zero and real boundaries spike.
   */
  gradient: Float32Array;
}

export function analyzeImage(source: ImageData): ImageAnalysis {
  const { width, height, data } = source;
  const count = width * height;

  const luminance = new Float32Array(count);
  const chromaA = new Float32Array(count);
  const chromaB = new Float32Array(count);
  const gradient = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const offset = i * 4;
    const r = data[offset];
    const g = data[offset + 1];
    const b = data[offset + 2];

    luminance[i] = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    // Opponent-colour axes normalised by total intensity: red-green and
    // yellow-blue. The +1 guards against a divide-by-zero on pure black.
    const sum = r + g + b + 1;
    chromaA[i] = ((r - g) / sum) * 255;
    chromaB[i] = ((r + g - 2 * b) / (2 * sum)) * 255;
  }

  // Smooth the luminance before differentiating. Sensor noise on an uploaded
  // phone photo produces per-pixel gradients as strong as a real edge; a 3x3
  // box blur removes them without softening architectural boundaries.
  const smoothed = new Float32Array(count);
  for (let y = 0; y < height; y++) {
    const row = y * width;
    for (let x = 0; x < width; x++) {
      let total = 0;
      let samples = 0;
      for (let dy = -1; dy <= 1; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= height) continue;
        const neighbourRow = ny * width;
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          if (nx < 0 || nx >= width) continue;
          total += luminance[neighbourRow + nx];
          samples++;
        }
      }
      smoothed[row + x] = total / samples;
    }
  }

  // Central-difference gradient, normalised by local brightness. Border
  // pixels keep gradient 0, which is harmless — the fill is bounded by the
  // frame anyway.
  for (let y = 1; y < height - 1; y++) {
    const row = y * width;
    for (let x = 1; x < width - 1; x++) {
      const i = row + x;
      const dx = smoothed[i + 1] - smoothed[i - 1];
      const dy = smoothed[i + width] - smoothed[i - width];
      // The +16 keeps deep shadow from producing enormous ratios on noise.
      gradient[i] = (Math.abs(dx) + Math.abs(dy)) / (smoothed[i] + 16);
    }
  }

  return { width, height, luminance, chromaA, chromaB, gradient };
}
