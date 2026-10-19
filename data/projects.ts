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
    price: "Price on Request",
    beds: "2 & 3 BHK Lux",
    baths: "2 - 3",
    area: "1,150 - 1,850 sqft",
    img: "/aura/real-aura.png",
    video: "/videos/aura-showcase-clip.mp4",
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
    price: "Price on Request",
    beds: "2 & 3 BHK",
    baths: "2 - 3",
    area: "1,050 - 1,600 sqft",
    img: "/assets/projects/lifestyle-homes/building/lifestyle-hero-clean-4k.jpg",
    video: "/videos/lifestyle-showcase-clip.mp4",
    summary:
      "Ready for immediate possession. Refined 2 & 3 BHK residences and 24 integrated high-street shops on DPS Road, Amravati. 100% Vastu compliant with private balconies and dedicated parking.",
  },
  {
    id: "lifestyle-retail-galleria",
    title: "Lifestyle Commercial Galleria",
    category: "Commercial",
    status: "Delivered",
    location: "DPS Road, Parvati Nagar, Amravati",
    year: "2025",
    price: "Price on Request",
    beds: "24 Retail Shops",
    baths: "Dedicated",
    area: "3,200 sqft Frontage",
    img: "/assets/projects/lifestyle-homes/gallery/lifestyle-shops-commercial.jpg",
    video: "/videos/lifestyle-showcase-clip.mp4",
    summary:
      "24 delivered road-facing commercial showrooms on 24m DPS Road with dedicated customer parking, high footfalls, and operating brands including Dee Bakers and MORE.",
  },
];

/** The projects with a walkthrough clip, used by the homepage carousel. */
export const FEATURED_PROJECTS = PROJECTS.filter((project) => project.video);

/** Categories that actually have at least one project behind them. */
export const ACTIVE_CATEGORIES = PROJECT_CATEGORIES.filter((category) =>
  PROJECTS.some((project) => project.category === category)
);
