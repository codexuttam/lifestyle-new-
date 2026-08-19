import { notFound } from "next/navigation";

import { getAllServices } from "@/lib/content/services";
import styles from "../../../admin.module.css";
import ServiceForm from "../ServiceForm";

export const metadata = { title: "Edit service | CMS" };

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const services = await getAllServices();
  const service = services.find((entry) => entry.id === id);

  if (!service) notFound();

  return (
    <>
      <h1 className={styles.pageTitle}>{service.title}</h1>
      <p className={styles.pageIntro}>
        Saved changes reach the live site within seconds.
      </p>
      <ServiceForm
        mode="edit"
        service={service}
        featuredCount={services.filter((entry) => entry.featured).length}
      />
    </>
  );
}
