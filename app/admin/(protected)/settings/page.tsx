import { getSettings } from "@/lib/content/settings";
import styles from "../../admin.module.css";
import SettingsForm from "./SettingsForm";

export const metadata = { title: "Settings | CMS" };

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <>
      <h1 className={styles.pageTitle}>Site settings</h1>
      <p className={styles.pageIntro}>
        Contact details used across every page — change the number once and it
        updates everywhere.
      </p>
      <SettingsForm initial={settings} />
    </>
  );
}
