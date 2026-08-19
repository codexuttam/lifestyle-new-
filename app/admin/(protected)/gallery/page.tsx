import Link from "next/link";

import { getAllGallery } from "@/lib/content/gallery";
import styles from "../../admin.module.css";
import RecordList from "../RecordList";

export const metadata = { title: "Gallery | CMS" };

export default async function AdminGalleryPage() {
  const rows = await getAllGallery();

  return (
    <>
      <div className={styles.listHeader}>
        <div>
          <h1 className={styles.pageTitle}>Gallery</h1>
          <p className={styles.pageIntro}>Photographs of completed work.</p>
        </div>
        <Link href="/admin/gallery/new" className={styles.primaryBtn}>
          New entry
        </Link>
      </div>

      <RecordList
        collection="gallery"
        emptyLabel="Nothing here yet."
        initial={rows.map((row) => ({
          id: row.id,
          label: row.caption,
          meta: row.alt,
          href: `/admin/gallery/${row.id}`,
          published: row.published,
        }))}
      />
    </>
  );
}
