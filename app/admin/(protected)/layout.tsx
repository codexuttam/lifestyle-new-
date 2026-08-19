import { redirect } from "next/navigation";

import { getAdmin } from "@/lib/auth/session";
import styles from "../admin.module.css";
import AdminBar from "./AdminBar";

/**
 * Guards every page in this route group.
 *
 * This is navigation-level protection only — it decides what renders. Each API
 * route re-checks the session independently via `requireAdmin`, because a
 * handler can be called directly without ever passing through a layout.
 *
 * Deliberately not middleware: middleware runs on the edge runtime, where the
 * Firebase Admin SDK cannot run.
 */
/**
 * Never prerender or cache anything behind the guard. Without this the page can
 * be marked static at build time (the session check short-circuits before
 * touching cookies when credentials are absent), which would serve a cached
 * shell to every visitor.
 */
export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className={styles.shell}>
      <AdminBar email={admin.email ?? "signed in"} />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
