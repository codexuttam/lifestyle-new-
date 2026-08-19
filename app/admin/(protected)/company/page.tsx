import { getCompany } from "@/lib/content/company";
import styles from "../../admin.module.css";
import CompanyForm from "./CompanyForm";

export const metadata = { title: "About | CMS" };

export default async function AdminCompanyPage() {
  const company = await getCompany();

  return (
    <>
      <h1 className={styles.pageTitle}>About &amp; company</h1>
      <p className={styles.pageIntro}>
        Everything on the /about page except the page copy itself.
      </p>
      <CompanyForm initial={company} />
    </>
  );
}
