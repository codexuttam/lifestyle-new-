"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import styles from "../admin.module.css";

const LINKS = [
  { label: "Dashboard", href: "/admin" },
  { label: "Enquiries", href: "/admin/leads" },
  { label: "Home", href: "/admin/home" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Services", href: "/admin/services" },
  { label: "Testimonials", href: "/admin/testimonials" },
  { label: "FAQs", href: "/admin/faqs" },
  { label: "Gallery", href: "/admin/gallery" },
  { label: "About", href: "/admin/company" },
  { label: "Settings", href: "/admin/settings" },
  { label: "Media", href: "/admin/media" },
];

export default function AdminBar({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await fetch("/api/admin/session", { method: "DELETE" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <header className={styles.bar}>
      <Link href="/admin" className={styles.brand}>
        TPC CMS
      </Link>

      <nav className={styles.nav}>
        {LINKS.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink}${active ? ` ${styles.navLinkActive}` : ""}`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <span className={styles.who}>{email}</span>
      <button type="button" className={styles.signOut} onClick={signOut}>
        Sign out
      </button>
    </header>
  );
}
