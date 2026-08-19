import { z } from "zod";

export const MEDIA_FOLDERS = [
  "projects",
  "services",
  "gallery",
  "people",
  "site",
  "uploads",
] as const;

/** Only formats a browser can render, and nothing executable. */
export const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
] as const;

export const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;

export const mediaSchema = z.object({
  id: z.string().min(1),
  path: z.string().min(1),
  url: z.string().url(),
  contentType: z.enum(ALLOWED_CONTENT_TYPES),
  bytes: z.number().int().positive(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  alt: z.string().default(""),
  folder: z.enum(MEDIA_FOLDERS).default("uploads"),
});

export type MediaRecord = z.infer<typeof mediaSchema>;

export const signRequestSchema = z.object({
  filename: z.string().min(1).max(200),
  contentType: z.enum(ALLOWED_CONTENT_TYPES),
  bytes: z.number().int().positive().max(MAX_UPLOAD_BYTES),
  folder: z.enum(MEDIA_FOLDERS).default("uploads"),
});

export const mediaInputSchema = mediaSchema.omit({ id: true, url: true });
