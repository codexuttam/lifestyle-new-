/**
 * Apply a CORS policy to the Bunny storage zone.
 *
 * The media library uploads straight from the browser to Bunny with a presigned
 * PUT, so the zone has to allow the site's origin. Without this every upload
 * fails the preflight, which is what the "rejected by storage" error means.
 *
 *   npm run bunny-cors                       # localhost + the deployed site
 *   npm run bunny-cors -- https://other.tld  # extra origins
 */
import {
  GetBucketCorsCommand,
  PutBucketCorsCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { bunnyStorageEnv } from "@/lib/env.server";

const DEFAULT_ORIGINS = [
  "https://realstate-eight-vert.vercel.app",
  "http://localhost:3000",
];

/** CORS origins are scheme + host only — no trailing slash, no path. */
function normalise(origin: string) {
  try {
    return new URL(origin).origin;
  } catch {
    throw new Error(`Not a valid origin: ${origin}`);
  }
}

async function main() {
  const env = bunnyStorageEnv();
  const origins = [
    ...new Set([...DEFAULT_ORIGINS, ...process.argv.slice(2)].map(normalise)),
  ];

  const client = new S3Client({
    endpoint: env.s3Endpoint,
    region: process.env.BUNNY_S3_REGION ?? "de",
    credentials: { accessKeyId: env.zone, secretAccessKey: env.password },
    forcePathStyle: true,
  });

  console.log(`Zone: ${env.zone}`);
  console.log(`Origins:\n${origins.map((o) => `  ${o}`).join("\n")}\n`);

  await client.send(
    new PutBucketCorsCommand({
      Bucket: env.zone,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedOrigins: origins,
            // PUT is the upload itself; GET/HEAD let the picker read objects back.
            AllowedMethods: ["PUT", "GET", "HEAD"],
            AllowedHeaders: ["*"],
            ExposeHeaders: ["ETag"],
            MaxAgeSeconds: 3600,
          },
        ],
      },
    })
  );

  console.log("Applied. Reading it back:\n");
  const current = await client.send(
    new GetBucketCorsCommand({ Bucket: env.zone })
  );
  console.log(JSON.stringify(current.CORSRules, null, 2));
}

main().catch((error) => {
  console.error(`Failed: ${error.name} — ${error.message}`);
  console.error(
    "\nIf Bunny does not implement the S3 CORS API, set the allowed origins\n" +
      "in the Bunny dashboard instead, or use the server-proxied upload path."
  );
  process.exit(1);
});
