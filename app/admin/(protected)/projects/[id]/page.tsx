import { notFound } from "next/navigation";

import { getAllProjects } from "@/lib/content/projects";
import styles from "../../../admin.module.css";
import ProjectForm from "../ProjectForm";

export const metadata = { title: "Edit project | CMS" };

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = (await getAllProjects()).find((entry) => entry.id === id);

  if (!project) notFound();

  return (
    <>
      <h1 className={styles.pageTitle}>{project.title}</h1>
      <p className={styles.pageIntro}>
        Saved changes reach the live site within seconds.
      </p>
      <ProjectForm mode="edit" project={project} />
    </>
  );
}
