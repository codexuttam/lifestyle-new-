import { z } from "zod";

export const CONSTRUCTION_TYPES = [
  "new",
  "renovation",
  "commercial",
  "plot",
] as const;

export const PACKAGES = ["essential", "premium", "luxury", "unsure"] as const;

export const LEAD_STATUSES = ["new", "contacted", "closed"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

/** Short enquiry schema: Name (required), Phone (required), Email (optional). */
export const leadInputSchema = z.object({
  name: z.string().min(2, "Please enter your name").max(120),
  phone: z.string().min(8, "Please enter a valid phone number").max(20),
  email: z.string().email("Please enter a valid email address").max(200).optional().or(z.literal("")),
  project: z.string().max(120).optional(),
  preference: z.string().max(120).optional(),
  city: z.string().max(120).optional().default("Amravati"),
  plotSize: z.string().max(40).optional(),
  type: z.string().optional().default("commercial"),
  package: z.string().optional().default("luxury"),
  startDate: z.string().max(40).optional(),
  message: z.string().max(2000).optional(),
  /**
   * Honeypot: Real people never see this field.
   */
  website: z.string().max(200).optional(),
});

export type LeadInput = z.infer<typeof leadInputSchema>;

/** A stored lead, as the admin reads it back. */
export const leadSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  phone: z.string(),
  email: z.string().optional().nullable(),
  project: z.string().optional(),
  preference: z.string().optional(),
  city: z.string().optional(),
  plotSize: z.string().optional(),
  type: z.string().optional(),
  package: z.string().optional(),
  startDate: z.string().optional(),
  message: z.string().optional(),
  status: z.enum(LEAD_STATUSES).default("new"),
  createdAt: z.string(),
  notes: z.string().default(""),
});

export type LeadRecord = z.infer<typeof leadSchema>;

export const TYPE_LABELS: Record<string, string> = {
  new: "Residential Highrise",
  renovation: "Sky Suite",
  commercial: "Commercial Retail",
  plot: "Bespoke Residence",
};

export const PACKAGE_LABELS: Record<string, string> = {
  essential: "2 BHK Elite",
  premium: "3 BHK Royal",
  luxury: "3 BHK Presidential Sky Suite",
  unsure: "Showroom / Commercial Space",
};
