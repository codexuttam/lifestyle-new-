import type { DecodedIdToken } from "firebase-admin/auth";

import { getAdmin } from "./session";

/** Thrown by `requireAdmin` so route handlers can answer 401 uniformly. */
export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

/**
 * Guard for every admin route handler. The admin layout performs the same
 * check for navigation, but that only controls what is rendered — each mutation
 * must verify independently, since API routes are reachable directly.
 */
export async function requireAdmin(): Promise<DecodedIdToken> {
  const admin = await getAdmin();
  if (!admin) throw new UnauthorizedError();
  return admin;
}

/** Wrap a handler so `UnauthorizedError` becomes a 401 instead of a 500. */
export async function withAdmin(
  handler: (admin: DecodedIdToken) => Promise<Response>
): Promise<Response> {
  try {
    const admin = await requireAdmin();
    return await handler(admin);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[admin]", error);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
