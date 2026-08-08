import type { PaintLayer } from "../types";
import { FINISH_PROFILES } from "../constants";
import { formatHsl, formatRgb } from "./color";

/** Turning a session into something the visitor can keep or send us. */

export function downloadCanvas(canvas: HTMLCanvasElement, filename: string): void {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    // Revoke on the next tick so Safari has finished reading the blob.
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }, "image/png");
}

/**
 * A plain-text spec of the scheme — the thing a visitor actually pastes into
 * WhatsApp when they ask their contractor to price it.
 */
export function buildSchemeSummary(layers: PaintLayer[], roomName: string): string {
  if (layers.length === 0) return "";

  const lines = layers.map((layer, index) => {
    const finish = FINISH_PROFILES[layer.finish].label;
    return [
      `${index + 1}. ${layer.label} — ${layer.colorName}`,
      `   HEX ${layer.hex.toUpperCase()}  ·  ${formatRgb(layer.hex)}  ·  ${formatHsl(layer.hex)}`,
      `   Finish: ${finish}`,
    ].join("\n");
  });

  return [
    `Paint scheme — ${roomName}`,
    "Created with the Build Constructions paint visualizer",
    "",
    ...lines,
  ].join("\n");
}
