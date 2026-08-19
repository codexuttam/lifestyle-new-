import { cookies } from "next/headers";
import { z } from "zod";

import { hasFirebaseAdminEnv } from "@/lib/env.server";
import { adminAuth } from "@/lib/firebase/admin";
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from "@/lib/auth/session";

const bodySchema = z.object({ idToken: z.string().min(1) });

/**
 * Exchange a Firebase ID token for an httpOnly session cookie.
 *
 * The `admin` custom claim is the actual gate — a valid Firebase account
 * without it is rejected here, so signing up cannot grant CMS access.
 */
export async function POST(request: Request) {
  if (!hasFirebaseAdminEnv()) {
    return Response.json(
      { error: "Server is not configured for authentication." },
      { status: 503 }
    );
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Missing ID token." }, { status: 400 });
  }

  try {
    const decoded = await adminAuth().verifyIdToken(parsed.data.idToken, true);
    if (decoded.admin !== true) {
      return Response.json(
        { error: "This account does not have CMS access." },
        { status: 403 }
      );
    }

    const sessionCookie = await adminAuth().createSessionCookie(parsed.data.idToken, {
      expiresIn: SESSION_MAX_AGE_SECONDS * 1000,
    });

    (await cookies()).set(SESSION_COOKIE, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("[admin/session]", error);
    return Response.json({ error: "Could not verify sign-in." }, { status: 401 });
  }
}

/** Sign out. */
export async function DELETE() {
  (await cookies()).delete(SESSION_COOKIE);
  return Response.json({ ok: true });
}
