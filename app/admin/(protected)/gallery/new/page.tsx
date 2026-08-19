import styles from "../../../admin.module.css";
import SimpleForm from "../../SimpleForm";
import { SIMPLE_COLLECTIONS } from "../../collections";

const SPEC = SIMPLE_COLLECTIONS.gallery;

export const metadata = { title: `New entry | CMS` };

export default function NewGalleryPage() {
  return (
    <>
      <h1 className={styles.pageTitle}>New entry</h1>
      <p className={styles.pageIntro}>{SPEC.intro}</p>
      <SimpleForm
        collection="gallery"
        fields={SPEC.fields}
        idSourceKey={SPEC.idSourceKey}
        mode="create"
        returnTo="/admin/gallery"
      />
    </>
  );
}
