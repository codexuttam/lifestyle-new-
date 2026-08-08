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

export const DEFAULT_ROOM = ROOM_PRESETS[0];
