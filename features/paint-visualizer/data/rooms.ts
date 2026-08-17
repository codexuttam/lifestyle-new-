import type { RoomSource } from "../types";

/**
 * The generated blank room — four white surfaces (front, left, right,
 * ceiling), no furniture. `src` is empty because the pixels are drawn on a
 * canvas at load time rather than fetched; see `lib/blankRoom.ts`.
 */
export const BLANK_ROOM: RoomSource = {
  id: "blank-room",
  name: "Blank Room",
  src: "",
  description: "A bare white room — pick a wall, pick a colour, done",
  origin: "blank",
};

/** The tool opens on the blank room — no photo required to start painting. */
export const DEFAULT_ROOM = BLANK_ROOM;
