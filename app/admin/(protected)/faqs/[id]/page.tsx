import { notFound } from "next/navigation";

import { getAllFaqs } from "@/lib/content/faqs";
import styles from "../../../admin.module.css";
import SimpleForm from "../../SimpleForm";
import { SIMPLE_COLLECTIONS } from "../../collections";

const SPEC = SIMPLE_COLLECTIONS.faqs;

export const metadata = { title: `Edit | CMS` };

export default async function EditFaqsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = (await getAllFaqs()).find((entry) => entry.id === id);

  if (!row) notFound();

  return (
    <>
      <h1 className={styles.pageTitle}>{SPEC.title}</h1>
      <p className={styles.pageIntro}>
        Saved changes reach the live site within seconds.
      </p>
      <SimpleForm
        collection="faqs"
        fields={SPEC.fields}
        idSourceKey={SPEC.idSourceKey}
        mode="edit"
        record={row}
        returnTo="/admin/faqs"
      />
    </>
  );
}
