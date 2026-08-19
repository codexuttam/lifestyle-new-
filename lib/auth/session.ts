import { cookies } from "next/headers";
import type { DecodedIdToken } from "firebase-admin/auth";

import { hasFirebaseAdminEnv } from "@/lib/env.server";
import { adminAuth } from "@/lib/firebase/admin";

/** Named `__session` so the same code works behind Firebase Hosting's CDN. */
export const SESSION_COOKIE = "__session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 14;

/**
 * Resolve the signed-in admin, or null.
 *
 * Returns null rather than throwing when credentials are absent or the cookie
 * is stale, so an unconfigured deployment redirects to the login screen instead
 * of serving a 500.
 */
export async function getAdmin(): Promise<DecodedIdToken | null> {
  if (!hasFirebaseAdminEnv()) return null;

  const cookie = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!cookie) return null;

  try {
    // checkRevoked: a disabled or signed-out account loses access immediately.
    const decoded = await adminAuth().verifySessionCookie(cookie, true);
    return decoded.admin === true ? decoded : null;
  } catch {
    return null;
  }
}
