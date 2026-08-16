import type { RoomSource } from "../types";

/**
 * Demo rooms shipped with the site.
 *
 * Each preset is shot with large, evenly lit, off-white wall planes — the
 * condition the flood-fill selection needs to grab a whole wall from one
 * click. Sources are 1600px JPGs, which matches MAX_WORKING_DIMENSION so no
 * bytes are downloaded that the canvas pipeline would only throw away.
 *
 * Swap `src` for CMS-driven URLs when the gallery moves to a CMS.
 */
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

export const ROOM_PRESETS: RoomSource[] = [
  {
    id: "living-room",
    name: "Living Room",
    src: "/images/rooms/living-room.jpg",
    description: "Feature wall with media console, Gurugram",
    origin: "preset",
  },
  {
    id: "bedroom",
    name: "Bedroom",
    src: "/images/rooms/bedroom.jpg",
    description: "Full headboard wall, soft daylight",
    origin: "preset",
  },
  {
    id: "kitchen-dining",
    name: "Kitchen & Dining",
    src: "/images/rooms/kitchen-dining.jpg",
    description: "Open-plan wall above the counter run",
    origin: "preset",
  },
  {
    id: "facade",
    name: "Exterior Facade",
    src: "/images/rooms/facade.jpg",
    description: "Street elevation, even overcast light",
    origin: "preset",
  },
];

/** The tool opens on the blank room — no photo required to start painting. */
export const DEFAULT_ROOM = BLANK_ROOM;
