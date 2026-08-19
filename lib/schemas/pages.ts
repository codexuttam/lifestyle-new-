import { z } from "zod";

const text = z.string().min(1);

/** Every route carries at least a metadata block and a page header. */
const pageCopySchema = z.object({
  metaTitle: text,
  metaDescription: text,
  badge: text,
  title: text,
  intro: text,
});

export const pagesSchema = z.object({
  about: pageCopySchema.extend({
    storyTitle: text,
    storyParagraphs: z.array(text).min(1),
    projectsCtaLabel: text,
    servicesCtaLabel: text,
    valuesTitle: text,
    milestonesTitle: text,
    processTitle: text,
    brandsTitle: text,
    brandsIntro: text,
    ctaTitle: text,
    ctaText: text,
    ctaLabel: text,
  }),
  projects: pageCopySchema,
  services: pageCopySchema,
  contact: pageCopySchema.extend({ sidebarTitle: text }),
  paintVisualizer: pageCopySchema,
});

export type PagesRecord = z.infer<typeof pagesSchema>;
export type PageCopyRecord = z.infer<typeof pageCopySchema>;
