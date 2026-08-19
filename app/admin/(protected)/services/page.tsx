import Link from "next/link";

import { getAllServices } from "@/lib/content/services";
import styles from "../../admin.module.css";
import RecordList from "../RecordList";

export const metadata = { title: "Services | CMS" };

export default async function AdminServicesPage() {
  const services = await getAllServices();

  return (
    <>
      <div className={styles.listHeader}>
        <div>
          <h1 className={styles.pageTitle}>Services</h1>
          <p className={styles.pageIntro}>
            Exactly four featured services appear on the homepage.
          </p>
        </div>
        <Link href="/admin/services/new" className={styles.primaryBtn}>
          New service
        </Link>
      </div>

      <RecordList
        collection="services"
        emptyLabel="No services yet."
        initial={services.map((service) => ({
          id: service.id,
          label: service.title,
          tag: service.category,
          meta: `${service.startingAt} · ${service.timeline}${
            service.featured ? " · featured" : ""
          }`,
          href: `/admin/services/${service.id}`,
          published: service.published,
        }))}
      />
    </>
  );
}
