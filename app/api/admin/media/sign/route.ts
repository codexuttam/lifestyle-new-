import { withAdmin } from "@/lib/auth/requireAdmin";
import { buildStoragePath, presignUpload } from "@/lib/bunny";
import { hasBunnyEnv } from "@/lib/env.server";
import { signRequestSchema } from "@/lib/schemas/media";

/**
 * Hand the browser a short-lived, single-purpose upload URL.
 *
 * The storage password never leaves the server, and the signature pins the
 * exact object key and content type, so a leaked URL cannot be used to write
 * anything else into the zone.
 */
export async function POST(request: Request) {
  return withAdmin(async () => {
    if (!hasBunnyEnv()) {
      return Response.json(
        { error: "Bunny Storage is not configured." },
        { status: 503 }
      );
    }

    const parsed = signRequestSchema.safeParse(
      await request.json().catch(() => null)
    );
    if (!parsed.success) {
      return Response.json(
        { error: "Unsupported file", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const path = buildStoragePath({
      folder: parsed.data.folder,
      filename: parsed.data.filename,
    });

    const { url, expiresIn } = await presignUpload(path, parsed.data.contentType);
    return Response.json({ uploadUrl: url, path, expiresIn });
  });
}
