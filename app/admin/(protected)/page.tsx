import Link from "next/link";

import { countNewLeads } from "@/lib/content/leads";
import { getAllProjects } from "@/lib/content/projects";
import { getAllServices } from "@/lib/content/services";
import { hasFirebaseAdminEnv } from "@/lib/env.server";
import styles from "../admin.module.css";

export const metadata = { title: "CMS | The Premium Construction" };

export default async function AdminDashboard() {
  const [projects, services, newLeads] = await Promise.all([
    getAllProjects(),
    getAllServices(),
    countNewLeads(),
  ]);

  const seeded = hasFirebaseAdminEnv();

  return (
    <>
      <h1 className={styles.pageTitle}>Content</h1>
      <p className={styles.pageIntro}>
        Changes go live within seconds — no rebuild or redeploy.
      </p>

      {!seeded && (
        <p className={styles.notice}>
          Firestore credentials are not configured, so these counts come from the
          static seed files. Fill in <code>.env.local</code> and run{" "}
          <code>npm run seed</code>.
        </p>
      )}

      <div className={styles.cards}>
        <Link href="/admin/leads" className={styles.card}>
          <div className={styles.cardTitle}>Enquiries</div>
          <div className={styles.cardMeta}>
            {newLeads === 0
              ? "Nothing new"
              : `${newLeads} new ${newLeads === 1 ? "enquiry" : "enquiries"}`}
          </div>
        </Link>

        <Link href="/admin/projects" className={styles.card}>
          <div className={styles.cardTitle}>Projects</div>
          <div className={styles.cardMeta}>
            {projects.length} total ·{" "}
            {projects.filter((project) => project.published).length} published
          </div>
        </Link>

        <Link href="/admin/services" className={styles.card}>
          <div className={styles.cardTitle}>Services</div>
          <div className={styles.cardMeta}>
            {services.length} total ·{" "}
            {services.filter((service) => service.featured).length} featured on
            the homepage
          </div>
        </Link>

        <Link href="/admin/company" className={styles.card}>
          <div className={styles.cardTitle}>About &amp; company</div>
          <div className={styles.cardMeta}>
            Stats, milestones, values, process, brands
          </div>
        </Link>

        <Link href="/admin/media" className={styles.card}>
          <div className={styles.cardTitle}>Media</div>
          <div className={styles.cardMeta}>Images and video on Bunny CDN</div>
        </Link>
      </div>
    </>
  );
}
