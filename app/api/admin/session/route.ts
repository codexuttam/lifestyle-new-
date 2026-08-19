import { cookies } from "next/headers";
import { z } from "zod";

import { hasFirebaseAdminEnv } from "@/lib/env.server";
import { adminAuth } from "@/lib/firebase/admin";
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from "@/lib/auth/session";
import { clientIp, rateLimit } from "@/lib/api/rateLimit";

const bodySchema = z.object({ idToken: z.string().min(1) });

/**
 * Exchange a Firebase ID token for an httpOnly session cookie.
 *
 * The `admin` custom claim is the actual gate — a valid Firebase account
 * without it is rejected here, so signing up cannot grant CMS access.
 */
export async function POST(request: Request) {
  // Nothing should escape as an opaque 500 with no clue what failed.
  try {
    return await handleSignIn(request);
  } catch (error) {
    console.error("[admin/session] unhandled", error);
    return Response.json(
      {
        error: "Sign-in failed unexpectedly.",
        code: error instanceof Error ? error.message : "unknown",
      },
      { status: 500 }
    );
  }
}

async function handleSignIn(request: Request) {
  // Slows credential stuffing against the one admin account.
  const limit = rateLimit({
    key: `session:${clientIp(request)}`,
    limit: 10,
    windowMs: 60_000,
  });

  if (!limit.allowed) {
    return Response.json(
      { error: "Too many sign-in attempts. Try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

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
    const code =
      typeof error === "object" && error !== null && "code" in error
        ? String((error as { code: unknown }).code)
        : "";

    // A bad or expired token is the caller's problem; anything else — a
    // malformed service-account key, a project mismatch — is ours, and the
    // code is what makes it diagnosable from a deployed environment.
    const isTokenProblem =
      code.startsWith("auth/") &&
      !code.includes("internal-error") &&
      !code.includes("configuration");

    console.error("[admin/session]", code || "unknown", error);

    if (isTokenProblem) {
      return Response.json(
        { error: "Could not verify sign-in.", code },
        { status: 401 }
      );
    }

    return Response.json(
      {
        error:
          "The server could not complete sign-in. Check the Firebase Admin credentials.",
        code: code || (error instanceof Error ? error.message : "unknown"),
      },
      { status: 500 }
    );
  }
}

/** Sign out. */
export async function DELETE() {
  (await cookies()).delete(SESSION_COOKIE);
  return Response.json({ ok: true });
}
