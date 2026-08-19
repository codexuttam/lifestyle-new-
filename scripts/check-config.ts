/**
 * Diagnostic: report which integrations are usable.
 *
 *   npm run check-config
 */
import { bunnyEnv, firebaseAdminEnv, hasBunnyEnv, hasFirebaseAdminEnv } from "@/lib/env.server";

const PUBLIC_KEYS = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
];

console.log("Public Firebase config (browser):");
for (const key of PUBLIC_KEYS) {
  const value = process.env[key];
  let verdict = "missing";
  if (value) {
    verdict = "ok";
    if (key.endsWith("API_KEY") && !value.startsWith("AIza")) {
      verdict = "WRONG - a web API key starts with AIza (Project settings -> General -> Your apps)";
    }
  }
  console.log(`  ${key}: ${verdict}`);
}

console.log("\nFirebase Admin (server):");
if (hasFirebaseAdminEnv()) {
  console.log(`  ok - ${firebaseAdminEnv().clientEmail}`);
} else {
  console.log("  not configured - Firestore reads fall back to data/");
}

console.log("\nBunny Storage:");
if (hasBunnyEnv()) {
  console.log(`  ok - serving from https://${bunnyEnv().cdnHost}`);
} else {
  try {
    bunnyEnv();
  } catch (error) {
    console.log(`  ${(error as Error).message}`);
  }
}
