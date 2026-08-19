import { getHome } from "@/lib/content/home";
import { getAllProjects } from "@/lib/content/projects";
import { getAllServices } from "@/lib/content/services";
import styles from "../../admin.module.css";
import HomeForm from "./HomeForm";

export const metadata = { title: "Landing page | CMS" };

export default async function AdminHomePage() {
  const [home, projects, services] = await Promise.all([
    getHome(),
    getAllProjects(),
    getAllServices(),
  ]);

  return (
    <>
      <h1 className={styles.pageTitle}>Landing page</h1>
      <p className={styles.pageIntro}>
        Which projects and services the homepage shows, and all of its copy.
      </p>

      <HomeForm
        initial={home}
        projectOptions={projects
          .filter((project) => project.published)
          .map((project) => ({
            id: project.id,
            label: `${project.title} — ${project.location}`,
          }))}
        serviceOptions={services
          .filter((service) => service.published)
          .map((service) => ({ id: service.id, label: service.title }))}
      />
    </>
  );
}
