import { z } from "zod";

const text = z.string().min(1);

/**
 * The composition counts are enforced here rather than in the UI, so a
 * selection that would break a layout cannot be saved at all: the carousel
 * needs a feature plus two supporting cards, the listing stack is exactly
 * three, and the homepage services grid animates exactly four (see CARD_FROM
 * in components/Services.tsx).
 */
export const homeSchema = z.object({
  hero: z.object({
    headline: text,
    description: text,
    ctaLabel: text,
    backgroundVideo: text,
    buildingImage: text,
    infoImage: text,
    infoPrice: text,
    infoCaption: text,
  }),
  about: z.object({
    label: text,
    statement: text,
    ctaLabel: text,
    cards: z
      .array(
        z.object({
          img: text,
          alt: text,
          prefix: z.string(),
          target: z.number(),
          suffix: z.string(),
          label: text,
          desc: text,
        })
      )
      .length(3, "The about section shows exactly three cards"),
  }),
  explore: z.object({
    tag: text,
    headline: text,
    video: text,
    overlayLabel: text,
    overlaySublabel: text,
    progress: z.number().min(0).max(100),
  }),
  properties: z.object({
    tag: text,
    heading: text,
    description: text,
    ctaLabel: text,
  }),
  services: z.object({ heading: text, intro: text, ctaLabel: text }),
  allProperties: z.object({
    label: text,
    heading: text,
    ctaLabel: text,
    bannerVideo: text,
  }),
  testimonials: z.object({ badge: text }),
  faq: z.object({ badge: text, title: text }),
  composition: z.object({
    featuredProjectIds: z
      .array(text)
      .min(3, "The carousel needs at least three projects"),
    listingProjectIds: z
      .array(text)
      .length(3, "The listing stack shows exactly three projects"),
    featuredServiceIds: z
      .array(text)
      .length(4, "The homepage services grid shows exactly four"),
    exploreProjectId: text,
  }),
});

export type HomeRecord = z.infer<typeof homeSchema>;
export type HomeContent = HomeRecord;
