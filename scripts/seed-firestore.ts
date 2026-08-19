/**
 * Seed Firestore from the static content in data/.
 *
 *   npx tsx --env-file=.env.local scripts/seed-firestore.ts
 *   npx tsx --env-file=.env.local scripts/seed-firestore.ts --dry
 *
 * Idempotent: each record is written to a document named after its existing
 * `id`, so re-running overwrites in place rather than duplicating. Safe to run
 * again after editing the seed files.
 */
import { FieldValue } from "firebase-admin/firestore";

import { BRANDS, MILESTONES, PROCESS_STEPS, STATS, VALUES } from "@/data/company";
import { FAQS } from "@/data/faqs";
import { GALLERY_ITEMS } from "@/data/gallery";
import { PROJECTS } from "@/data/projects";
import { SERVICES } from "@/data/services";
import { TESTIMONIALS } from "@/data/testimonials";
import { adminDb } from "@/lib/firebase/admin";

const dryRun = process.argv.includes("--dry");

/** Firestore rejects undefined values outright, so drop those keys. */
function clean<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, v]) => v !== undefined)
  );
}

async function seedCollection(
  name: string,
  records: { id: string }[]
) {
  if (dryRun) {
    console.log(`[dry] ${name}: would write ${records.length} documents`);
    return;
  }

  const db = adminDb();
  const batch = db.batch();

  records.forEach((record, index) => {
    const { id, ...rest } = record;
    batch.set(db.collection(name).doc(id), {
      ...clean(rest),
      order: index,
      published: true,
      updatedAt: FieldValue.serverTimestamp(),
    });
  });

  await batch.commit();
  console.log(`${name}: wrote ${records.length} documents`);
}

async function seedCompany() {
  if (dryRun) {
    console.log(
      `[dry] siteContent/company: would write ${STATS.length} stats, ` +
        `${MILESTONES.length} milestones, ${PROCESS_STEPS.length} process steps, ` +
        `${VALUES.length} values, ${BRANDS.length} brands`
    );
    return;
  }

  const payload = {
    stats: STATS,
    milestones: MILESTONES,
    processSteps: PROCESS_STEPS,
    values: VALUES,
    brands: BRANDS,
    updatedAt: FieldValue.serverTimestamp(),
  };

  await adminDb().collection("siteContent").doc("company").set(payload);
  console.log("siteContent/company: written");
}

async function main() {
  if (dryRun) console.log("Dry run — nothing will be written.\n");

  await seedCollection("projects", PROJECTS);
  await seedCollection("services", SERVICES);
  await seedCollection("testimonials", TESTIMONIALS);
  await seedCollection("faqs", FAQS);
  await seedCollection("gallery", GALLERY_ITEMS);
  await seedCompany();

  console.log(
    dryRun
      ? "\nDry run complete."
      : "\nSeed complete. The site reads Firestore from here on; the data/ files remain the fallback."
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
