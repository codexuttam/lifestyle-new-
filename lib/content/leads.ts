import "server-only";

import { hasFirebaseAdminEnv } from "@/lib/env.server";
import { adminDb } from "@/lib/firebase/admin";
import { LEAD_STATUSES, type LeadRecord } from "@/lib/schemas/lead";

/**
 * Not cached: an enquiry that lands while the owner is looking at the inbox
 * must show up on the next refresh, and this is only read behind the
 * force-dynamic admin.
 */
export async function getLeads(): Promise<LeadRecord[]> {
  if (!hasFirebaseAdminEnv()) return [];

  try {
    const snapshot = await adminDb()
      .collection("leads")
      .orderBy("createdAt", "desc")
      .limit(500)
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate?.() as Date | undefined;

      return {
        id: doc.id,
        name: String(data.name ?? ""),
        phone: String(data.phone ?? ""),
        email: String(data.email ?? ""),
        city: String(data.city ?? ""),
        plotSize: data.plotSize ? String(data.plotSize) : undefined,
        type: data.type,
        package: data.package,
        startDate: data.startDate ? String(data.startDate) : undefined,
        message: data.message ? String(data.message) : undefined,
        status: LEAD_STATUSES.includes(data.status) ? data.status : "new",
        notes: String(data.notes ?? ""),
        // Serialised here so the record can cross into a client component.
        createdAt: createdAt ? createdAt.toISOString() : "",
      } satisfies LeadRecord;
    });
  } catch (error) {
    console.error("[leads] could not list:", error);
    return [];
  }
}

export async function countNewLeads(): Promise<number> {
  return (await getLeads()).filter((lead) => lead.status === "new").length;
}
