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

/** What the public form is allowed to send. */
export const leadInputSchema = z.object({
  name: z.string().min(2).max(120),
  phone: z.string().min(6).max(20),
  email: z.string().email().max(200),
  city: z.string().min(2).max(120),
  plotSize: z.string().max(20).optional(),
  type: z.enum(CONSTRUCTION_TYPES),
  package: z.enum(PACKAGES),
  startDate: z.string().max(40).optional(),
  message: z.string().max(2000).optional(),
  /**
   * Honeypot. Real people never see this field, so anything in it is a bot —
   * the route accepts the request and silently discards it.
   */
  website: z.string().max(200).optional(),
});

export type LeadInput = z.infer<typeof leadInputSchema>;

/** A stored lead, as the admin reads it back. */
export const leadSchema = leadInputSchema
  .omit({ website: true })
  .extend({
    id: z.string().min(1),
    status: z.enum(LEAD_STATUSES).default("new"),
    createdAt: z.string(),
    notes: z.string().default(""),
  });

export type LeadRecord = z.infer<typeof leadSchema>;

export const TYPE_LABELS: Record<(typeof CONSTRUCTION_TYPES)[number], string> = {
  new: "New House Construction",
  renovation: "Renovation",
  commercial: "Commercial",
  plot: "Plot Development",
};

export const PACKAGE_LABELS: Record<(typeof PACKAGES)[number], string> = {
  essential: "Essential",
  premium: "Premium",
  luxury: "Luxury",
  unsure: "Not sure yet",
};
