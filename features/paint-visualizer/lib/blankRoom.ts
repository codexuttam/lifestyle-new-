import type { RegionMask } from "../types";

/**
 * The generated "blank room": a bare, white, one-point-perspective box with
 * exactly four paintable surfaces — front wall, left wall, right wall, and
 * ceiling — plus a floor that stays as it is.
 *
 * Because we draw the geometry ourselves, every surface's mask is known
 * exactly. Selection becomes a lookup instead of a flood fill, so a click
 * (or a surface button) always fills the whole plane, edge to edge.
 *
 * Each plane is filled with a subtle luminance gradient rather than flat
 * white. The recolour pipeline treats source luminance as a shading map,
 * so those gradients are what make an applied colour read as a lit room
 * instead of a flat vector diagram.
 */

export type BlankSurfaceId = "ceiling" | "left-wall" | "front-wall" | "right-wall";

export interface BlankSurface {
  id: BlankSurfaceId;
  label: string;
  mask: RegionMask;
}

export interface BlankRoomBuild {
  imageData: ImageData;
  width: number;
  height: number;
  surfaces: BlankSurface[];
}

const WIDTH = 1600;
const HEIGHT = 1000;

/** Back-wall rectangle of the perspective box; everything hangs off these. */
const X0 = 430;
const Y0 = 225;
const X1 = 1170;
const Y1 = 775;

type Point = readonly [number, number];

interface GradientStop {
  from: string;
  to: string;
  /** Gradient axis in canvas coordinates. */
  axis: readonly [number, number, number, number];
}

interface SurfaceSpec {
  id: BlankSurfaceId;
  label: string;
  polygon: readonly Point[];
  shading: GradientStop;
}

/**
 * Left wall reads slightly darker than the right so the room implies a
 * light source instead of dead-even studio lighting.
 */
const SURFACE_SPECS: readonly SurfaceSpec[] = [
  {
    id: "ceiling",
    label: "Ceiling",
    polygon: [[0, 0], [WIDTH, 0], [X1, Y0], [X0, Y0]],
    shading: { from: "#fdfcfa", to: "#e7e4dd", axis: [0, 0, 0, Y0] },
  },
  {
    id: "left-wall",
    label: "Left Wall",
    polygon: [[0, 0], [X0, Y0], [X0, Y1], [0, HEIGHT]],
    shading: { from: "#f0ede7", to: "#dbd7ce", axis: [0, 0, X0, 0] },
  },
  {
    id: "front-wall",
    label: "Front Wall",
    polygon: [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]],
    shading: { from: "#f4f2ed", to: "#e5e1d9", axis: [0, Y0, 0, Y1] },
  },
  {
    id: "right-wall",
    label: "Right Wall",
    polygon: [[WIDTH, 0], [X1, Y0], [X1, Y1], [WIDTH, HEIGHT]],
    shading: { from: "#f7f5f0", to: "#e2ded5", axis: [WIDTH, 0, X1, 0] },
  },
];

const FLOOR: SurfaceSpec["polygon"] = [[0, HEIGHT], [X0, Y1], [X1, Y1], [WIDTH, HEIGHT]];
const FLOOR_SHADING: GradientStop = {
  from: "#d8d2c7",
  to: "#c8c1b4",
  axis: [0, HEIGHT, 0, Y1],
};

function tracePolygon(context: CanvasRenderingContext2D, polygon: readonly Point[]): void {
  context.beginPath();
  context.moveTo(polygon[0][0], polygon[0][1]);
  for (let i = 1; i < polygon.length; i++) {
    context.lineTo(polygon[i][0], polygon[i][1]);
  }
  context.closePath();
}

function fillPolygon(
  context: CanvasRenderingContext2D,
  polygon: readonly Point[],
  shading: GradientStop
): void {
  const [gx0, gy0, gx1, gy1] = shading.axis;
  const gradient = context.createLinearGradient(gx0, gy0, gx1, gy1);
  gradient.addColorStop(0, shading.from);
  gradient.addColorStop(1, shading.to);
  tracePolygon(context, polygon);
  context.fillStyle = gradient;
  context.fill();
}

/**
 * Soft ambient-occlusion lines along every seam. Without them adjacent
 * whites melt into each other and the box loses its depth; two strokes
 * (one wide and faint, one thin) fake the corner shadow cheaply.
 */
function strokeSeams(context: CanvasRenderingContext2D): void {
  const seams: readonly (readonly [Point, Point])[] = [
    [[0, 0], [X0, Y0]],
    [[WIDTH, 0], [X1, Y0]],
    [[0, HEIGHT], [X0, Y1]],
    [[WIDTH, HEIGHT], [X1, Y1]],
    [[X0, Y0], [X1, Y0]],
    [[X1, Y0], [X1, Y1]],
    [[X1, Y1], [X0, Y1]],
    [[X0, Y1], [X0, Y0]],
  ];

  const passes: readonly { width: number; style: string }[] = [
    { width: 10, style: "rgba(93, 86, 74, 0.05)" },
    { width: 2, style: "rgba(93, 86, 74, 0.13)" },
  ];

  for (const pass of passes) {
    context.lineWidth = pass.width;
    context.strokeStyle = pass.style;
    context.lineCap = "round";
    context.beginPath();
    for (const [start, end] of seams) {
      context.moveTo(start[0], start[1]);
      context.lineTo(end[0], end[1]);
    }
    context.stroke();
  }
}

/**
 * Rasterizes one surface polygon into a coverage mask. The canvas
 * antialiases the polygon edge, which lands partial coverage (1–254) on
 * boundary pixels — a free one-pixel feather that keeps adjacent painted
 * surfaces meeting cleanly instead of leaving a white seam.
 */
function rasterizePolygonMask(polygon: readonly Point[]): RegionMask {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Canvas 2D is not available in this browser.");

  tracePolygon(context, polygon);
  context.fillStyle = "#ffffff";
  context.fill();

  const { data } = context.getImageData(0, 0, WIDTH, HEIGHT);
  const mask = new Uint8ClampedArray(WIDTH * HEIGHT);

  let minX = WIDTH - 1;
  let minY = HEIGHT - 1;
  let maxX = 0;
  let maxY = 0;
  let pixelCount = 0;

  for (let i = 0; i < mask.length; i++) {
    const alpha = data[i * 4 + 3];
    if (alpha === 0) continue;
    mask[i] = alpha;
    pixelCount++;
    const x = i % WIDTH;
    const y = (i - x) / WIDTH;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

  return { data: mask, bounds: { minX, minY, maxX, maxY }, pixelCount };
}

/** Draws the room and computes the four surface masks. Client-side only. */
export function buildBlankRoom(): BlankRoomBuild {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Canvas 2D is not available in this browser.");

  fillPolygon(context, FLOOR, FLOOR_SHADING);
  for (const spec of SURFACE_SPECS) {
    fillPolygon(context, spec.polygon, spec.shading);
  }
  strokeSeams(context);

  const imageData = context.getImageData(0, 0, WIDTH, HEIGHT);
  const surfaces = SURFACE_SPECS.map((spec) => ({
    id: spec.id,
    label: spec.label,
    mask: rasterizePolygonMask(spec.polygon),
  }));

  return { imageData, width: WIDTH, height: HEIGHT, surfaces };
}
