import "server-only";

import { BRANDS, MILESTONES, PROCESS_STEPS, STATS, VALUES } from "@/data/company";
import { companySchema, type CompanyRecord } from "@/lib/schemas/company";

import { CONTENT_TAGS, cachedDocument } from "./repository";

const FALLBACK: CompanyRecord = {
  stats: STATS,
  milestones: MILESTONES,
  processSteps: PROCESS_STEPS,
  values: VALUES,
  brands: BRANDS,
};

export const getCompany = cachedDocument({
  path: ["siteContent", "company"],
  tag: CONTENT_TAGS.company,
  schema: companySchema,
  fallback: FALLBACK,
});
