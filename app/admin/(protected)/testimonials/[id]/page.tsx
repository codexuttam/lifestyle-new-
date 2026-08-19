import { notFound } from "next/navigation";

import { getAllTestimonials } from "@/lib/content/testimonials";
import styles from "../../../admin.module.css";
import SimpleForm from "../../SimpleForm";
import { SIMPLE_COLLECTIONS } from "../../collections";

const SPEC = SIMPLE_COLLECTIONS.testimonials;

export const metadata = { title: `Edit | CMS` };

export default async function EditTestimonialsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = (await getAllTestimonials()).find((entry) => entry.id === id);

  if (!row) notFound();

  return (
    <>
      <h1 className={styles.pageTitle}>{SPEC.title}</h1>
      <p className={styles.pageIntro}>
        Saved changes reach the live site within seconds.
      </p>
      <SimpleForm
        collection="testimonials"
        fields={SPEC.fields}
        idSourceKey={SPEC.idSourceKey}
        mode="edit"
        record={row}
        returnTo="/admin/testimonials"
      />
    </>
  );
}
