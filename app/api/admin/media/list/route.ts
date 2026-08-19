import { withAdmin } from "@/lib/auth/requireAdmin";
import { getMedia } from "@/lib/content/media";

/** Backs the picker dialog inside content forms. */
export async function GET() {
  return withAdmin(async () => Response.json({ media: await getMedia() }));
}
