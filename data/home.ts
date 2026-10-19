/**
 * Landing page content for Aura by Lifestyle.
 */

import type { HomeContent } from "@/lib/schemas/home";

const CDN = "https://cdn.jiro.build/Real%20Estate%20-%20Ospey";

export const HOME_CONTENT: HomeContent = {
  hero: {
    headline: "AURA",
    description:
      "Life Beyond Imagination. 15-storey highrise tower featuring 2 & 3 BHK luxury residences, rooftop sky pool, multi-sports turf, and panoramic sky horizons at Camp, Amravati.",
    ctaLabel: "Explore Aura Residences",
    backgroundVideo: "/videos/aura-building-clip-1.mp4",
    buildingImage: "/aura/real-aura.png",
    infoImage: "/aura/luxury-master-bedroom.jpg",
    infoPrice: "Aura Residences",
    infoCaption: "2 & 3 BHK Luxury Suites · Camp, Amravati · MahaRERA: P5030002502915",
  },
  about: {
    label: "",
    statement:
      "Amravati's premier 15-storey highrise tower in Camp featuring 2 & 3 BHK luxury residences, rooftop sky oasis, and bespoke living crafted with trust and transparency.",
    ctaLabel: "More About Us",
    cards: [
      {
        img: "/aura/real-aura.png",
        alt: "Aura 15-Storey Tower 4K Elevation at Camp Amravati",
        prefix: "",
        target: 15,
        suffix: " Storeys",
        label: "Skyline Highrise",
        desc: "Amravati's landmark residential tower with 360-degree unobstructed sky views.",
      },
      {
        img: "/aura/rooftop-amenities-3d.jpg",
        alt: "Aura Rooftop Sky Oasis, Pool & Multi-Sports Turf",
        prefix: "+",
        target: 20,
        suffix: "",
        label: "Lifestyle Amenities",
        desc: "Rooftop swimming pool, kids pool, multi-sports turf, viewing deck, gym, and party area.",
      },
      {
        img: "/aura/aura-brand-showcase.jpg",
        alt: "Aura by Lifestyle MahaRERA Registered Development",
        prefix: "",
        target: 100,
        suffix: "%",
        label: "MahaRERA Registered",
        desc: "Official MahaRERA Reg. P5030002502915 with transparent documentation and bank approvals.",
      },
    ],
  },
  explore: {
    tag: "",
    headline:
      "Experience Life In The Sky — With A Rooftop Crafted For Adventure, Wellness, And Unrivalled Horizons Over Amravati.",
    video: "/videos/aura-building-clip-1.mp4",
    overlayLabel: "Aura Sky Oasis",
    overlaySublabel: "Rooftop Pool & Sports Turf",
    progress: 95,
  },
  properties: {
    tag: "",
    heading:
      "Crafted for those who seek identity and distinction. 2 & 3 BHK luxury residences.",
    description:
      "Each apartment is planned with dedicated ventilation, private balconies, 800x1600 vitrified tiles, Jaquar fittings, and 4 high-speed elevators with generator backup.",
    ctaLabel: "View all projects and floor plans",
  },
  services: {
    heading: "What We Offer At Lifestyle Home Spaces",
    intro:
      "From architectural design and structural engineering to luxury turnkey highrise construction, Lifestyle delivers excellence with transparency.",
    ctaLabel: "Explore our capabilities",
  },
  allProperties: {
    label: "Lifestyle Portfolio",
    heading: "Explore Our Landmark Developments In Amravati",
    ctaLabel: "Browse all projects & floor plans",
    bannerVideo: "/videos/aura-building-clip-1.mp4",
  },
  testimonials: { badge: "Testimonial" },
  faq: {
    badge: "Aura FAQ",
    title: "Frequently Asked Questions About Aura by Lifestyle",
  },
  composition: {
    featuredProjectIds: ["aura", "lifestyle-homes", "lifestyle-retail-galleria"],
    listingProjectIds: ["aura", "lifestyle-homes"],
    featuredServiceIds: [
      "new-home-construction",
      "turnkey-handover",
      "warranty-maintenance",
      "design-consulting",
    ],
    exploreProjectId: "aura",
  },
};
