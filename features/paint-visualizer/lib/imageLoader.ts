import {
  ACCEPTED_UPLOAD_TYPES,
  MAX_UPLOAD_BYTES,
  MAX_WORKING_DIMENSION,
} from "../constants";

/**
 * Image intake: decode a preset path or a user upload, downscale it to a
 * workable resolution, and hand back raw pixels.
 */

export interface LoadedImage {
  imageData: ImageData;
  width: number;
  height: number;
}

function decode(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("That image could not be loaded."));
    image.src = src;
  });
}

/** Scales the longest edge down to MAX_WORKING_DIMENSION, never up. */
function fitDimensions(width: number, height: number): { width: number; height: number } {
  const longest = Math.max(width, height);
  if (longest <= MAX_WORKING_DIMENSION) {
    return { width, height };
  }
  const scale = MAX_WORKING_DIMENSION / longest;
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
}

export async function loadImageData(src: string): Promise<LoadedImage> {
  const image = await decode(src);
  const { width, height } = fitDimensions(image.naturalWidth, image.naturalHeight);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Canvas is not available in this browser.");

  context.drawImage(image, 0, 0, width, height);
  return { imageData: context.getImageData(0, 0, width, height), width, height };
}

export interface UploadValidation {
  ok: boolean;
  error?: string;
}

export function validateUpload(file: File): UploadValidation {
  if (!ACCEPTED_UPLOAD_TYPES.includes(file.type)) {
    return { ok: false, error: "Please upload a JPG, PNG, or WebP photo." };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, error: "That photo is over 12 MB. Try a smaller version." };
  }
  return { ok: true };
}
