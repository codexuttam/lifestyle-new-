"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  LEAD_STATUSES,
  PACKAGE_LABELS,
  TYPE_LABELS,
  type LeadRecord,
  type LeadStatus,
} from "@/lib/schemas/lead";
import styles from "../../admin.module.css";

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  closed: "Closed",
};

function formatDate(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function LeadInbox({ initial }: { initial: LeadRecord[] }) {
  const router = useRouter();
  const [leads, setLeads] = useState(initial);
  const [filter, setFilter] = useState<LeadStatus | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const visible =
    filter === "all" ? leads : leads.filter((lead) => lead.status === filter);

  async function patch(id: string, body: Partial<LeadRecord>) {
    const previous = leads;
    setLeads((current) =>
      current.map((lead) => (lead.id === id ? { ...lead, ...body } : lead))
    );
    setError(null);

    const response = await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      setLeads(previous);
      setError("Could not save that change.");
      return;
    }
    router.refresh();
  }

  async function remove(lead: LeadRecord) {
    if (!window.confirm(`Delete the enquiry from ${lead.name}?`)) return;

    const response = await fetch(`/api/admin/leads/${lead.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setError("Could not delete that enquiry.");
      return;
    }

    setLeads((current) => current.filter((entry) => entry.id !== lead.id));
    router.refresh();
  }

  function countFor(value: LeadStatus | "all") {
    return value === "all"
      ? leads.length
      : leads.filter((lead) => lead.status === value).length;
  }

  return (
    <>
      <div className={styles.filters}>
        {(["all", ...LEAD_STATUSES] as const).map((value) => (
          <button
            key={value}
            type="button"
            className={`${styles.filterChip}${
              filter === value ? ` ${styles.filterChipActive}` : ""
            }`}
            onClick={() => setFilter(value)}
          >
            {value === "all" ? "All" : STATUS_LABELS[value]}
            <span className={styles.filterCount}>{countFor(value)}</span>
          </button>
        ))}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {visible.length === 0 ? (
        <p className={styles.empty}>
          {leads.length === 0
            ? "No enquiries yet. Submissions from the contact form land here."
            : "Nothing with that status."}
        </p>
      ) : (
        <div className={styles.list}>
          {visible.map((lead) => {
            const open = openId === lead.id;

            return (
              <div className={styles.leadRow} key={lead.id}>
                <div className={styles.row}>
                  <div className={styles.rowMain}>
                    <button
                      type="button"
                      className={styles.rowTitleBtn}
                      onClick={() => setOpenId(open ? null : lead.id)}
                      aria-expanded={open}
                    >
                      {lead.name}
                    </button>
                    <div className={styles.rowMeta}>
                      <span
                        className={`${styles.tag}${
                          lead.status === "new" ? ` ${styles.tagNew}` : ""
                        }`}
                      >
                        {STATUS_LABELS[lead.status]}
                      </span>{" "}
                      {lead.city || "Amravati"} · {(lead.type && TYPE_LABELS[lead.type]) || lead.preference || "Luxury Residence"} ·{" "}
                      {formatDate(lead.createdAt)}
                    </div>
                  </div>

                  <div className={styles.rowActions}>
                    <select
                      className={styles.select}
                      value={lead.status}
                      onChange={(event) =>
                        patch(lead.id, {
                          status: event.target.value as LeadStatus,
                        })
                      }
                      aria-label={`Status for ${lead.name}`}
                    >
                      {LEAD_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {STATUS_LABELS[status]}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className={styles.dangerBtn}
                      onClick={() => remove(lead)}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {open && (
                  <div className={styles.leadDetail}>
                    <dl className={styles.leadGrid}>
                      <div>
                        <dt className={styles.detailLabel}>Phone</dt>
                        <dd>
                          <a href={`tel:${lead.phone}`}>{lead.phone}</a>
                          {" · "}
                          <a
                            href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`}
                          >
                            WhatsApp
                          </a>
                        </dd>
                      </div>
                      <div>
                        <dt className={styles.detailLabel}>Email</dt>
                        <dd>
                          {lead.email ? (
                            <a href={`mailto:${lead.email}`}>{lead.email}</a>
                          ) : (
                            "—"
                          )}
                        </dd>
                      </div>
                      <div>
                        <dt className={styles.detailLabel}>Project</dt>
                        <dd>{lead.project || "Aura by Lifestyle"}</dd>
                      </div>
                      <div>
                        <dt className={styles.detailLabel}>Package</dt>
                        <dd>{(lead.package && PACKAGE_LABELS[lead.package]) || lead.preference || "2 & 3 BHK Luxury"}</dd>
                      </div>
                      <div>
                        <dt className={styles.detailLabel}>Expected start</dt>
                        <dd>{lead.startDate || "Immediate"}</dd>
                      </div>
                    </dl>

                    {lead.message && (
                      <>
                        <div className={styles.detailLabel}>Message</div>
                        <p className={styles.leadMessage}>{lead.message}</p>
                      </>
                    )}

                    <label className={styles.field}>
                      <span className={styles.detailLabel}>Internal notes</span>
                      <textarea
                        className={styles.textarea}
                        defaultValue={lead.notes}
                        onBlur={(event) => {
                          if (event.target.value !== lead.notes) {
                            void patch(lead.id, { notes: event.target.value });
                          }
                        }}
                      />
                      <span className={styles.hint}>
                        Saved when you click away.
                      </span>
                    </label>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
