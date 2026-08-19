import { z } from "zod";

export const companySchema = z.object({
  stats: z.array(
    z.object({
      target: z.number(),
      suffix: z.string(),
      label: z.string().min(1),
    })
  ),
  milestones: z.array(
    z.object({
      year: z.string().min(1),
      title: z.string().min(1),
      text: z.string().min(1),
    })
  ),
  processSteps: z.array(
    z.object({ title: z.string().min(1), text: z.string().min(1) })
  ),
  values: z.array(
    z.object({ title: z.string().min(1), text: z.string().min(1) })
  ),
  brands: z.array(z.string().min(1)),
});

export type CompanyRecord = z.infer<typeof companySchema>;
