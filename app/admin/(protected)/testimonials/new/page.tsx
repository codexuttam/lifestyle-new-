import styles from "../../../admin.module.css";
import SimpleForm from "../../SimpleForm";
import { SIMPLE_COLLECTIONS } from "../../collections";

const SPEC = SIMPLE_COLLECTIONS.testimonials;

export const metadata = { title: `New entry | CMS` };

export default function NewTestimonialsPage() {
  return (
    <>
      <h1 className={styles.pageTitle}>New entry</h1>
      <p className={styles.pageIntro}>{SPEC.intro}</p>
      <SimpleForm
        collection="testimonials"
        fields={SPEC.fields}
        idSourceKey={SPEC.idSourceKey}
        mode="create"
        returnTo="/admin/testimonials"
      />
    </>
  );
}
