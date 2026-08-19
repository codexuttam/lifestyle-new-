import { getAllServices } from "@/lib/content/services";
import styles from "../../../admin.module.css";
import ServiceForm from "../ServiceForm";

export const metadata = { title: "New service | CMS" };

export default async function NewServicePage() {
  const featuredCount = (await getAllServices()).filter(
    (service) => service.featured
  ).length;

  return (
    <>
      <h1 className={styles.pageTitle}>New service</h1>
      <p className={styles.pageIntro}>
        It appears on the services page as soon as it is published.
      </p>
      <ServiceForm mode="create" featuredCount={featuredCount} />
    </>
  );
}
