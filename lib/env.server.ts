import { z } from "zod";

/** Firebase Admin credentials. Server-only — never referenced from client code. */
const firebaseAdminSchema = z.object({
  projectId: z.string().min(1),
  clientEmail: z.string().email(),
  privateKey: z.string().min(1),
});

/** Credentials for reading and writing objects. Server-only. */
const bunnyStorageSchema = z.object({
  zone: z.string().min(1),
  password: z.string().min(1),
  s3Endpoint: z.string().url(),
});

/** Storage plus the public hostname objects are served from. */
const bunnySchema = bunnyStorageSchema.extend({
  // A bare hostname, e.g. thepremiumconstruction.b-cdn.net. Validated so a
  // stray label or a pasted URL fails loudly instead of silently producing
  // broken image links.
  cdnHost: z
    .string()
    .regex(
      /^[a-z0-9-]+(\.[a-z0-9-]+)+$/i,
      "Expected the Pull Zone hostname, e.g. thepremiumconstruction.b-cdn.net"
    ),
});

export type FirebaseAdminEnv = z.infer<typeof firebaseAdminSchema>;
export type BunnyEnv = z.infer<typeof bunnySchema>;

function readFirebaseAdminEnv() {
  return firebaseAdminSchema.safeParse({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    // Vercel and .env files store the key with escaped newlines.
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\n/g, "\n"),
  });
}

function bunnyValues() {
  return {
    zone: process.env.BUNNY_STORAGE_ZONE,
    password: process.env.BUNNY_STORAGE_PASSWORD,
    s3Endpoint: process.env.BUNNY_S3_ENDPOINT,
    cdnHost: process.env.NEXT_PUBLIC_BUNNY_CDN_HOST,
  };
}

function readBunnyEnv() {
  return bunnySchema.safeParse(bunnyValues());
}

function readBunnyStorageEnv() {
  return bunnyStorageSchema.safeParse(bunnyValues());
}

/**
 * Whether Firestore is reachable at all.
 *
 * Validation is deliberately lazy rather than throwing at module load: the
 * content repository falls back to the static seed data in `data/` when the
 * credentials are absent, so the public site keeps building and rendering on a
 * machine with no `.env.local` at all.
 */
export function hasFirebaseAdminEnv(): boolean {
  return readFirebaseAdminEnv().success;
}

export function firebaseAdminEnv(): FirebaseAdminEnv {
  const parsed = readFirebaseAdminEnv();
  if (!parsed.success) {
    throw new Error(
      `Missing Firebase Admin credentials: ${parsed.error.issues
        .map((issue) => issue.path.join(".") + " (" + issue.message + ")")
        .join(", ")}. Copy .env.example to .env.local and fill it in.`
    );
  }
  return parsed.data;
}

export function hasBunnyEnv(): boolean {
  return readBunnyEnv().success;
}

export function bunnyEnv(): BunnyEnv {
  const parsed = readBunnyEnv();
  if (!parsed.success) {
    throw new Error(
      `Missing Bunny Storage credentials: ${parsed.error.issues
        .map((issue) => issue.path.join(".") + " (" + issue.message + ")")
        .join(", ")}. Copy .env.example to .env.local and fill it in.`
    );
  }
  return parsed.data;
}


export type BunnyStorageEnv = z.infer<typeof bunnyStorageSchema>;

/** Whether objects can be read and written, regardless of the pull zone. */
export function hasBunnyStorageEnv(): boolean {
  return readBunnyStorageEnv().success;
}

export function bunnyStorageEnv(): BunnyStorageEnv {
  const parsed = readBunnyStorageEnv();
  if (!parsed.success) {
    throw new Error(
      `Missing Bunny Storage credentials: ${parsed.error.issues
        .map((issue) => issue.path.join(".") + " (" + issue.message + ")")
        .join(", ")}.`
    );
  }
  return parsed.data;
}
