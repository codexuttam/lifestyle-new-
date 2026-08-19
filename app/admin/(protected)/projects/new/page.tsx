import styles from "../../../admin.module.css";
import ProjectForm from "../ProjectForm";

export const metadata = { title: "New project | CMS" };

export default function NewProjectPage() {
  return (
    <>
      <h1 className={styles.pageTitle}>New project</h1>
      <p className={styles.pageIntro}>
        It appears on the site as soon as it is published.
      </p>
      <ProjectForm mode="create" />
    </>
  );
}
