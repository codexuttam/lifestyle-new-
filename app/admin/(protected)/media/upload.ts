import {
  ALLOWED_CONTENT_TYPES,
  MAX_UPLOAD_BYTES,
  type MediaRecord,
} from "@/lib/schemas/media";

type Folder = MediaRecord["folder"];

/** Read intrinsic dimensions so the CMS can show and validate aspect ratios. */
async function measure(file: File): Promise<{ width?: number; height?: number }> {
  if (!file.type.startsWith("image/")) return {};

  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({});
    };
    image.src = url;
  });
}

/**
 * Three steps: ask the server to sign an upload, PUT the bytes straight to
 * Bunny, then record the result. The file never passes through Vercel, which is
 * what allows uploads far above the 4.5 MB serverless request limit.
 */
export async function uploadToBunny(
  file: File,
  folder: Folder
): Promise<MediaRecord> {
  if (!ALLOWED_CONTENT_TYPES.includes(file.type as never)) {
    throw new Error(`${file.type || "That file type"} is not allowed.`);
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(
      `That file is ${(file.size / 1024 / 1024).toFixed(0)} MB — the limit is ${
        MAX_UPLOAD_BYTES / 1024 / 1024
      } MB.`
    );
  }

  const signResponse = await fetch("/api/admin/media/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
      bytes: file.size,
      folder,
    }),
  });

  if (!signResponse.ok) {
    const body = await signResponse.json().catch(() => ({}));
    throw new Error(body.error ?? "Could not start the upload.");
  }

  const { uploadUrl, path } = (await signResponse.json()) as {
    uploadUrl: string;
    path: string;
  };

  const put = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!put.ok) {
    // The most likely cause is the storage zone rejecting a cross-origin PUT.
    throw new Error(
      `Upload rejected by storage (${put.status}). If this is a CORS error, allow this origin on the Bunny storage zone.`
    );
  }

  const { width, height } = await measure(file);

  const recordResponse = await fetch("/api/admin/media", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      path,
      contentType: file.type,
      bytes: file.size,
      width,
      height,
      alt: "",
      folder,
    }),
  });

  if (!recordResponse.ok) {
    const body = await recordResponse.json().catch(() => ({}));
    throw new Error(body.error ?? "Uploaded, but could not be recorded.");
  }

  const { id, url } = (await recordResponse.json()) as {
    id: string;
    url: string;
  };

  return {
    id,
    url,
    path,
    contentType: file.type as MediaRecord["contentType"],
    bytes: file.size,
    width,
    height,
    alt: "",
    folder,
  };
}
