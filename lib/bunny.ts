import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { bunnyEnv, bunnyStorageEnv } from "@/lib/env.server";

/**
 * Bunny Storage speaks S3, which is what makes direct browser uploads possible:
 * the server signs a short-lived PUT and the file never passes through Vercel
 * (whose serverless request body caps at 4.5 MB — smaller than the photos this
 * site deals in).
 */
function client() {
  const env = bunnyStorageEnv();
  return new S3Client({
    endpoint: env.s3Endpoint,
    region: process.env.BUNNY_S3_REGION ?? "de",
    credentials: {
      accessKeyId: env.zone,
      secretAccessKey: env.password,
    },
    // Bunny addresses the zone as a path segment, not a subdomain.
    forcePathStyle: true,
  });
}

const UPLOAD_WINDOW_SECONDS = 300;

export function cdnUrl(path: string) {
  return `https://${bunnyEnv().cdnHost}/${path.replace(/^\/+/, "")}`;
}

/** A URL the browser can PUT the file to directly. Expires in five minutes. */
export async function presignUpload(path: string, contentType: string) {
  const env = bunnyStorageEnv();
  const url = await getSignedUrl(
    client(),
    new PutObjectCommand({
      Bucket: env.zone,
      Key: path.replace(/^\/+/, ""),
      ContentType: contentType,
    }),
    { expiresIn: UPLOAD_WINDOW_SECONDS }
  );

  return { url, expiresIn: UPLOAD_WINDOW_SECONDS };
}

export async function deleteObject(path: string) {
  const env = bunnyStorageEnv();
  await client().send(
    new DeleteObjectCommand({
      Bucket: env.zone,
      Key: path.replace(/^\/+/, ""),
    })
  );
}

/** `projects/casa-meridian/front-elevation-8f3a1c.jpg` */
export function buildStoragePath(options: {
  folder: string;
  filename: string;
}) {
  const dot = options.filename.lastIndexOf(".");
  const stem = dot > 0 ? options.filename.slice(0, dot) : options.filename;
  const ext = dot > 0 ? options.filename.slice(dot + 1).toLowerCase() : "bin";

  const slug =
    stem
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "file";

  const suffix = Math.random().toString(36).slice(2, 8);
  const folder = options.folder.replace(/^\/+|\/+$/g, "") || "uploads";

  return `${folder}/${slug}-${suffix}.${ext}`;
}
