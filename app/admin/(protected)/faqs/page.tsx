import Link from "next/link";

import { getAllFaqs } from "@/lib/content/faqs";
import styles from "../../admin.module.css";
import RecordList from "../RecordList";

export const metadata = { title: "FAQs | CMS" };

export default async function AdminFaqsPage() {
  const rows = await getAllFaqs();

  return (
    <>
      <div className={styles.listHeader}>
        <div>
          <h1 className={styles.pageTitle}>FAQs</h1>
          <p className={styles.pageIntro}>
            Answers shown in the accordion, in this order.
          </p>
        </div>
        <Link href="/admin/faqs/new" className={styles.primaryBtn}>
          New entry
        </Link>
      </div>

      <RecordList
        collection="faqs"
        emptyLabel="Nothing here yet."
        initial={rows.map((row) => ({
          id: row.id,
          label: row.question,
          meta:
            row.answer.length > 90
              ? `${row.answer.slice(0, 90)}...`
              : row.answer,
          href: `/admin/faqs/${row.id}`,
          published: row.published,
        }))}
      />
    </>
  );
}
