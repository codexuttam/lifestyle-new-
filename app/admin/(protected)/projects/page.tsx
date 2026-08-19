import Link from "next/link";

import { getAllProjects } from "@/lib/content/projects";
import styles from "../../admin.module.css";
import ProjectList from "./ProjectList";

export const metadata = { title: "Projects | CMS" };

export default async function AdminProjectsPage() {
  const projects = await getAllProjects();

  return (
    <>
      <div className={styles.listHeader}>
        <div>
          <h1 className={styles.pageTitle}>Projects</h1>
          <p className={styles.pageIntro}>
            Order here is the order they appear on the site.
          </p>
        </div>
        <Link href="/admin/projects/new" className={styles.primaryBtn}>
          New project
        </Link>
      </div>

      <ProjectList initial={projects} />
    </>
  );
}
