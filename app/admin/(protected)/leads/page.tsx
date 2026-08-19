import { getLeads } from "@/lib/content/leads";
import { hasFirebaseAdminEnv } from "@/lib/env.server";
import styles from "../../admin.module.css";
import LeadInbox from "./LeadInbox";

export const metadata = { title: "Enquiries | CMS" };

export default async function AdminLeadsPage() {
  const leads = await getLeads();

  return (
    <>
      <h1 className={styles.pageTitle}>Enquiries</h1>
      <p className={styles.pageIntro}>
        Every submission from the contact form, newest first.
      </p>

      {!hasFirebaseAdminEnv() && (
        <p className={styles.notice}>
          Firestore is not configured, so form submissions are being rejected
          rather than stored.
        </p>
      )}

      <LeadInbox initial={leads} />
    </>
  );
}
