import Link from "next/link";

import { getAllTestimonials } from "@/lib/content/testimonials";
import styles from "../../admin.module.css";
import RecordList from "../RecordList";

export const metadata = { title: "Testimonials | CMS" };

export default async function AdminTestimonialsPage() {
  const rows = await getAllTestimonials();

  return (
    <>
      <div className={styles.listHeader}>
        <div>
          <h1 className={styles.pageTitle}>Testimonials</h1>
          <p className={styles.pageIntro}>
            Shown in the homepage marquee, in this order.
          </p>
        </div>
        <Link href="/admin/testimonials/new" className={styles.primaryBtn}>
          New entry
        </Link>
      </div>

      <RecordList
        collection="testimonials"
        emptyLabel="Nothing here yet."
        initial={rows.map((row) => ({
          id: row.id,
          label: row.name,
          meta: row.role,
          href: `/admin/testimonials/${row.id}`,
          published: row.published,
        }))}
      />
    </>
  );
}
