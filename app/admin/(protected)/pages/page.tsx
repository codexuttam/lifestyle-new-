import { getPages } from "@/lib/content/pages";
import styles from "../../admin.module.css";
import PagesForm from "./PagesForm";

export const metadata = { title: "Page copy | CMS" };

export default async function AdminPagesPage() {
  const pages = await getPages();

  return (
    <>
      <h1 className={styles.pageTitle}>Page copy</h1>
      <p className={styles.pageIntro}>
        Headings and search-engine text for each route. The records themselves
        are edited in their own sections.
      </p>
      <PagesForm initial={pages} />
    </>
  );
}
