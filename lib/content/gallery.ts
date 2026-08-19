import "server-only";

import { GALLERY_ITEMS } from "@/data/gallery";
import { gallerySchema, type GalleryRecord } from "@/lib/schemas/gallery";

import { CONTENT_TAGS, cachedCollection } from "./repository";

const FALLBACK: GalleryRecord[] = GALLERY_ITEMS.map((row, index) => ({
  ...row,
  order: index,
  published: true,
}));

const read = cachedCollection({
  collection: "gallery",
  tag: CONTENT_TAGS.gallery,
  schema: gallerySchema,
  fallback: FALLBACK,
});

export async function getGallery(): Promise<GalleryRecord[]> {
  return (await read()).filter((row) => row.published);
}

export async function getAllGallery(): Promise<GalleryRecord[]> {
  return read();
}
