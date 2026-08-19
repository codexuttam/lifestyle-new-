import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

import { firebaseAdminEnv } from "@/lib/env.server";

const APP_NAME = "premium-construction-admin";

// No "server-only" guard here on purpose: scripts/ imports this module through
// plain Node, where that package throws. Never import it from a client component.

/**
 * The Admin SDK bypasses Firestore security rules, so this module must never be
 * imported from a client component. Init is lazy and reuses the existing app so
 * dev HMR does not re-initialise on every reload.
 */
function adminApp() {
  const existing = getApps().find((app) => app.name === APP_NAME);
  if (existing) return existing;

  const env = firebaseAdminEnv();
  return initializeApp(
    {
      credential: cert({
        projectId: env.projectId,
        clientEmail: env.clientEmail,
        privateKey: env.privateKey,
      }),
    },
    APP_NAME
  );
}

export function adminDb() {
  return getFirestore(adminApp());
}

export function adminAuth() {
  return getAuth(adminApp());
}

export { getApp };
