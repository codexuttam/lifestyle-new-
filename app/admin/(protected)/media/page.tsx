import { getMedia } from "@/lib/content/media";
import { hasBunnyEnv } from "@/lib/env.server";
import styles from "../../admin.module.css";
import MediaLibrary from "./MediaLibrary";

export const metadata = { title: "Media | CMS" };

export default async function AdminMediaPage() {
  const media = await getMedia();

  return (
    <>
      <h1 className={styles.pageTitle}>Media</h1>
      <p className={styles.pageIntro}>
        Uploads go straight from your browser to Bunny Storage and are served
        from the CDN.
      </p>

      {!hasBunnyEnv() && (
        <p className={styles.notice}>
          Bunny Storage is not configured. Set <code>BUNNY_STORAGE_ZONE</code>,{" "}
          <code>BUNNY_STORAGE_PASSWORD</code>, <code>BUNNY_S3_ENDPOINT</code> and{" "}
          <code>NEXT_PUBLIC_BUNNY_CDN_HOST</code> in <code>.env.local</code>.
        </p>
      )}

      <MediaLibrary initial={media} />
    </>
  );
}
