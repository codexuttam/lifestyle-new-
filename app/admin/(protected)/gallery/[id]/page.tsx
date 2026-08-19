import { notFound } from "next/navigation";

import { getAllGallery } from "@/lib/content/gallery";
import styles from "../../../admin.module.css";
import SimpleForm from "../../SimpleForm";
import { SIMPLE_COLLECTIONS } from "../../collections";

const SPEC = SIMPLE_COLLECTIONS.gallery;

export const metadata = { title: `Edit | CMS` };

export default async function EditGalleryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = (await getAllGallery()).find((entry) => entry.id === id);

  if (!row) notFound();

  return (
    <>
      <h1 className={styles.pageTitle}>{SPEC.title}</h1>
      <p className={styles.pageIntro}>
        Saved changes reach the live site within seconds.
      </p>
      <SimpleForm
        collection="gallery"
        fields={SPEC.fields}
        idSourceKey={SPEC.idSourceKey}
        mode="edit"
        record={row}
        returnTo="/admin/gallery"
      />
    </>
  );
}
