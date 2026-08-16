/**
 * Public surface of the Paint Visualizer feature.
 *
 * Everything outside `features/paint-visualizer` should import from here —
 * internal file layout stays free to change without breaking consumers.
 */
export { default as PaintVisualizer } from "./components/PaintVisualizer";
export { PAINT_COLLECTIONS, PAINT_COLORS_BY_ID, findColorByHex } from "./data/palette";
export { BLANK_ROOM, ROOM_PRESETS } from "./data/rooms";
export type {
  PaintColor,
  PaintCollection,
  PaintFinish,
  PaintLayer,
  RoomSource,
  ShortlistEntry,
} from "./types";
