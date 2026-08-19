/**
 * Per-route page copy, including the SEO metadata block.
 *
 * Keeping these here means headings and search-result text can be reworded
 * from the CMS without a deploy. Records (projects, services, testimonials)
 * live in their own collections; this is only the surrounding chrome.
 */

export type PageCopy = {
  metaTitle: string;
  metaDescription: string;
  badge: string;
  title: string;
  intro: string;
};

export type PagesContent = {
  about: PageCopy & {
    storyTitle: string;
    storyParagraphs: string[];
    projectsCtaLabel: string;
    servicesCtaLabel: string;
    valuesTitle: string;
    milestonesTitle: string;
    processTitle: string;
    brandsTitle: string;
    brandsIntro: string;
    ctaTitle: string;
    ctaText: string;
    ctaLabel: string;
  };
  projects: PageCopy;
  services: PageCopy;
  contact: PageCopy & { sidebarTitle: string };
  paintVisualizer: PageCopy;
};

export const PAGES_CONTENT: PagesContent = {
  about: {
    metaTitle: "About Us | The Premium Construction",
    metaDescription:
      "Who we are: a turnkey residential builder working across Delhi NCR since 2012 — 340+ homes delivered on fixed-price contracts, with design, approvals, structure and finishing handled by one team.",
    badge: "About us",
    title: "We Build Homes People Stay In",
    intro:
      "The Premium Construction is a turnkey residential builder working across Delhi NCR. We combine engineering rigour with expert industry knowledge to simplify designing, building and owning a home — one team, one contract, from bare plot to handover.",
    storyTitle: "How we got here",
    storyParagraphs: [
      "We started in 2012 with a three-person site team and a single plot in Gurugram. What we kept running into was the same thing every owner complains about — an architect blaming the contractor, a contractor blaming the drawings, and a budget that drifted every month.",
      "So we built the firm to remove that gap. Architecture, structural design, approvals, construction and finishing all sit with us, on one fixed-price contract, with a dedicated site manager you can call directly. Twelve years and 340 homes later, that is still the whole idea.",
    ],
    projectsCtaLabel: "See our projects",
    servicesCtaLabel: "Browse services",
    valuesTitle: "What we hold ourselves to",
    milestonesTitle: "Milestones",
    processTitle: "How a build runs",
    brandsTitle: "Materials we build with",
    brandsIntro:
      "The bill of materials is published in your contract, and these are the names on it. No substitutions without your sign-off.",
    ctaTitle: "Have a plot in mind?",
    ctaText:
      "Send us the location and plot size — we will come back with a feasibility read and an honest cost range before you commit to anything.",
    ctaLabel: "Talk to us on WhatsApp",
  },
  projects: {
    metaTitle: "Projects | The Premium Construction",
    metaDescription:
      "Browse every home, villa, office and renovation we have delivered across Delhi NCR — filter by category to find work closest to your own plot.",
    badge: "Projects",
    title: "Everything We Have Built",
    intro:
      "Homes, villas, offices, interiors and full renovations — every project below was handled turnkey by one team, from the first site visit to handover. Filter by category to see the work closest to what you have in mind.",
  },
  services: {
    metaTitle: "Services | The Premium Construction",
    metaDescription:
      "Construction, design, interiors, renovation and aftercare — every service we offer across Delhi NCR, with indicative pricing and timelines. Filter by category.",
    badge: "Services",
    title: "Everything We Handle For You",
    intro:
      "From a bare plot to a finished home, and long after the keys are handed over — one team, transparent pricing, and a dedicated site manager on every job. Filter by category to find the work you need.",
  },
  contact: {
    metaTitle: "Contact Us | The Premium Construction",
    metaDescription:
      "Book a free site visit. Tell us your plot location and size and we will come back with a feasibility read and an honest cost range across Delhi NCR.",
    badge: "Contact us",
    title: "Book A Free Site Visit",
    intro:
      "Tell us where the plot is and roughly what you have in mind. We will visit, study orientation and soil, and come back with a feasibility read and an honest cost range — before you commit to anything.",
    sidebarTitle: "Prefer to talk?",
  },
  paintVisualizer: {
    metaTitle: "Paint Visualizer | The Premium Construction",
    metaDescription:
      "See how any paint colour will look on your walls before you buy. Try 30 curated shades on a blank room or your own photo, then copy the exact HEX, RGB, and HSL codes.",
    badge: "Paint Visualizer",
    title: "See The Colour Before You Buy It",
    intro:
      "Start with a bare white room — pick a wall or the ceiling, pick a colour, and it fills instantly. Prefer something real? Upload a photo of your own — everything runs in your browser, and your photo never leaves your device. When you find the one, copy the exact colour code and send it to your painter.",
  },
};
