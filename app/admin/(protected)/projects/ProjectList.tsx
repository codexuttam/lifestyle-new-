"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { ProjectRecord } from "@/lib/schemas/project";
import styles from "../../admin.module.css";

/**
 * Reordering uses move-up/move-down buttons rather than drag-and-drop: no extra
 * dependency, and it stays usable from the keyboard. Order is persisted for the
 * whole list in one request so positions can never drift apart.
 */
export default function ProjectList({ initial }: { initial: ProjectRecord[] }) {
  const router = useRouter();
  const [projects, setProjects] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function persistOrder(next: ProjectRecord[]) {
    const previous = projects;
    setProjects(next);
    setBusy(true);
    setError(null);

    const response = await fetch("/api/admin/content/projects/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: next.map((project) => project.id) }),
    });

    setBusy(false);
    if (!response.ok) {
      setProjects(previous);
      setError("Could not save the new order.");
      return;
    }
    router.refresh();
  }

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= projects.length) return;
    const next = [...projects];
    [next[index], next[target]] = [next[target], next[index]];
    void persistOrder(next);
  }

  async function remove(project: ProjectRecord) {
    if (
      !window.confirm(
        `Delete "${project.title}"? This cannot be undone.`
      )
    ) {
      return;
    }

    setBusy(true);
    const response = await fetch(`/api/admin/content/projects/${project.id}`, {
      method: "DELETE",
    });
    setBusy(false);

    if (!response.ok) {
      setError("Could not delete that project.");
      return;
    }

    setProjects((current) =>
      current.filter((entry) => entry.id !== project.id)
    );
    router.refresh();
  }

  if (projects.length === 0) {
    return <p className={styles.empty}>No projects yet.</p>;
  }

  return (
    <>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.list}>
        {projects.map((project, index) => (
          <div className={styles.row} key={project.id}>
            <img src={project.img} alt="" className={styles.rowThumb} />

            <div className={styles.rowMain}>
              <Link
                href={`/admin/projects/${project.id}`}
                className={styles.rowTitle}
              >
                {project.title}
              </Link>
              <div className={styles.rowMeta}>
                <span className={styles.tag}>{project.category}</span>{" "}
                {project.location} · {project.price}
                {!project.published && (
                  <>
                    {" "}
                    <span className={`${styles.tag} ${styles.tagDraft}`}>
                      Draft
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className={styles.rowActions}>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => move(index, -1)}
                disabled={busy || index === 0}
                aria-label={`Move ${project.title} up`}
              >
                ↑
              </button>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => move(index, 1)}
                disabled={busy || index === projects.length - 1}
                aria-label={`Move ${project.title} down`}
              >
                ↓
              </button>
              <button
                type="button"
                className={styles.dangerBtn}
                onClick={() => remove(project)}
                disabled={busy}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
