/** Shared project catalogue for Lifestyle Home Spaces and Aura by Lifestyle. */

export const PROJECT_CATEGORIES = [
  "Residential",
  "Villa",
  "Commercial",
  "Interior",
  "Renovation",
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export type Project = {
  id: string;
  title: string;
  category: ProjectCategory;
  status: "Delivered" | "In Progress";
  location: string;
  year: string;
  price: string;
  beds: string;
  baths: string;
  area: string;
  img: string;
  video?: string;
  summary: string;
};

export const PROJECTS: Project[] = [
  {
    id: "aura",
    title: "Aura by Lifestyle",
    category: "Residential",
    status: "In Progress",
    location: "Congress Nagar Road, Camp, Amravati",
    year: "2026",
    price: "₹65 L - 1.45 Cr",
    beds: "2 & 3 BHK Lux",
    baths: "2 - 3",
    area: "1,150 - 1,850 sqft",
    img: "/aura/real-aura.png",
    video: "/videos/aura-building-clip-1.mp4",
    summary:
      "Amravati's premier 15-storey architectural highrise featuring 2 & 3 BHK luxury residences, rooftop sky lounge, infinity pool, multi-sports turf, and double-height designer entrance lobby.",
  },
  {
    id: "lifestyle-homes",
    title: "Lifestyle Home Spaces",
    category: "Residential",
    status: "Delivered",
    location: "DPS Road, Parvati Nagar, Amravati",
    year: "2025",
    price: "₹48 L - 85 L",
    beds: "2 & 3 BHK",
    baths: "2 - 3",
    area: "1,050 - 1,600 sqft",
    img: "/assets/projects/lifestyle-homes/building/lifestyle-hero-clean-4k.jpg",
    video: "https://cdn.jiro.build/Real%20Estate%20-%20Ospey/video/Video%2002.mp4",
    summary:
      "Ready for immediate possession. Refined 2 & 3 BHK residences and 24 integrated high-street shops on DPS Road, Amravati. 100% Vastu compliant with private balconies and dedicated parking.",
  },
  {
    id: "aura-sky-suites",
    title: "Aura Sky Penthouses",
    category: "Residential",
    status: "In Progress",
    location: "Congress Nagar Road, Camp, Amravati",
    year: "2026",
    price: "₹1.25 Cr - 1.85 Cr",
    beds: "3 BHK Royal",
    baths: "3",
    area: "1,850 sqft",
    img: "/aura/sky-balcony-lifestyle.jpg",
    video: "https://cdn.jiro.build/Real%20Estate%20-%20Ospey/video/Video%2003.mp4",
    summary:
      "Ultra-exclusive upper-floor sky residences with double-height panoramic balconies, viewing deck access, and unhindered skyline vistas across Amravati.",
  },
  {
    id: "lifestyle-retail-galleria",
    title: "Lifestyle DPS Retail Shops",
    category: "Commercial",
    status: "Delivered",
    location: "DPS Road, Parvati Nagar, Amravati",
    year: "2025",
    price: "On Request",
    beds: "—",
    baths: "2",
    area: "3,200 sqft",
    img: "/assets/projects/lifestyle-homes/gallery/lifestyle-shops-commercial.jpg",
    summary:
      "24 ready-to-move commercial shops with premier road frontage on DPS Road, serving an affluent, thriving residential catchment.",
  },
  {
    id: "aura-interior-suite",
    title: "Aura Designer Living Suites",
    category: "Interior",
    status: "In Progress",
    location: "Congress Nagar Road, Camp, Amravati",
    year: "2026",
    price: "Tailored Packages",
    beds: "2 & 3 BHK",
    baths: "3",
    area: "1,450 sqft",
    img: "/aura/luxury-master-bedroom.jpg",
    summary:
      "Custom bespoke interior finishes including Italian marble texture vitrified tiles (800x1600), acoustic glass windows, and designer sanitary fittings.",
  },
];

/** The projects with a walkthrough clip, used by the homepage carousel. */
export const FEATURED_PROJECTS = PROJECTS.filter((project) => project.video);

/** Categories that actually have at least one project behind them. */
export const ACTIVE_CATEGORIES = PROJECT_CATEGORIES.filter((category) =>
  PROJECTS.some((project) => project.category === category)
);
