/** Shared project catalogue.
 *
 * The homepage carousel, the sticky "all properties" stack and the dedicated
 * /projects page all read from here, so a project only has to be described
 * once and its category stays consistent everywhere it appears.
 */

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
  /** Walkthrough clip — only the featured projects carry one. */
  video?: string;
  summary: string;
};

export const PROJECTS: Project[] = [
  {
    id: "casa-meridian",
    title: "Casa Meridian",
    category: "Residential",
    status: "Delivered",
    location: "Gurugram",
    year: "2024",
    price: "₹2.8 Cr",
    beds: "4",
    baths: "3",
    area: "3,400 sqft",
    img: "/images/project_1_1779380254029.png",
    video: "https://cdn.jiro.build/Real%20Estate%20-%20Ospey/video/Video%2001.mp4",
    summary:
      "A four-bedroom turnkey build on a corner plot, planned around a double-height living core and a north-lit courtyard.",
  },
  {
    id: "ivory-residence",
    title: "The Ivory Residence",
    category: "Villa",
    status: "Delivered",
    location: "DLF Phase 2, Delhi",
    year: "2024",
    price: "₹4.2 Cr",
    beds: "5",
    baths: "4",
    area: "4,800 sqft",
    img: "/images/project_2_1779380272507.png",
    video: "https://cdn.jiro.build/Real%20Estate%20-%20Ospey/video/Video%2002.mp4",
    summary:
      "A five-bedroom villa in stone and lime plaster, with a basement home theatre and a landscaped rear deck.",
  },
  {
    id: "arken-house",
    title: "Arken House",
    category: "Residential",
    status: "Delivered",
    location: "Noida Sector 50",
    year: "2023",
    price: "₹1.95 Cr",
    beds: "3",
    baths: "3",
    area: "2,600 sqft",
    img: "/images/project_3_1779380290833.png",
    video: "https://cdn.jiro.build/Real%20Estate%20-%20Ospey/video/Video%2003.mp4",
    summary:
      "A compact three-bedroom home built to a fixed-price contract, handed over four weeks ahead of schedule.",
  },
  {
    id: "verde-courtyard",
    title: "Verde Courtyard Villa",
    category: "Villa",
    status: "Delivered",
    location: "Sector 43, Gurugram",
    year: "2023",
    price: "₹3.6 Cr",
    beds: "4",
    baths: "4",
    area: "4,100 sqft",
    img: "/images/gallery_1_1779379484199.png",
    summary:
      "Built around a planted central court so every bedroom gets cross ventilation without opening onto the street.",
  },
  {
    id: "sterling-offices",
    title: "Sterling Corporate Block",
    category: "Commercial",
    status: "Delivered",
    location: "Udyog Vihar, Gurugram",
    year: "2024",
    price: "On request",
    beds: "—",
    baths: "6",
    area: "12,000 sqft",
    img: "/images/gallery_2_1779379510372.png",
    summary:
      "A three-floor office block delivered shell-and-core, with the fit-out coordinated for a single tenant.",
  },
  {
    id: "aurum-retail",
    title: "Aurum Retail Frontage",
    category: "Commercial",
    status: "In Progress",
    location: "Sector 18, Noida",
    year: "2026",
    price: "On request",
    beds: "—",
    baths: "4",
    area: "7,200 sqft",
    img: "/images/gallery_3_1779379534787.png",
    summary:
      "A double-height retail frontage with a glazed street elevation, currently in the finishing stage.",
  },
  {
    id: "linen-apartment",
    title: "Linen Apartment Interiors",
    category: "Interior",
    status: "Delivered",
    location: "Golf Course Road, Gurugram",
    year: "2025",
    price: "₹48 L",
    beds: "3",
    baths: "3",
    area: "2,150 sqft",
    img: "/images/gallery_4_1779379550084.png",
    summary:
      "A full interior package — modular kitchen, wardrobes, false ceiling and lighting — inside a bare-shell apartment.",
  },
  {
    id: "ochre-duplex",
    title: "Ochre Duplex Fit-Out",
    category: "Interior",
    status: "Delivered",
    location: "Vasant Kunj, Delhi",
    year: "2024",
    price: "₹62 L",
    beds: "4",
    baths: "4",
    area: "3,000 sqft",
    img: "/images/gallery_5_1779379567777.png",
    summary:
      "Warm oak joinery and lime-washed walls through a duplex, with the staircase rebuilt in steel and stone.",
  },
  {
    id: "heritage-kothi",
    title: "Heritage Kothi Restoration",
    category: "Renovation",
    status: "Delivered",
    location: "Civil Lines, Delhi",
    year: "2023",
    price: "₹1.4 Cr",
    beds: "5",
    baths: "4",
    area: "5,200 sqft",
    img: "/images/gallery_6_1779379588256.png",
    summary:
      "A 1960s kothi taken back to structure, retrofitted for seismic code and rebuilt with its original façade intact.",
  },
  {
    id: "brick-house-revival",
    title: "Brick House Revival",
    category: "Renovation",
    status: "In Progress",
    location: "Sector 15, Faridabad",
    year: "2026",
    price: "₹85 L",
    beds: "3",
    baths: "2",
    area: "2,400 sqft",
    img: "/images/gallery_7_1779379605692.png",
    summary:
      "An exposed-brick rebuild adding a floor over an existing slab, with the roof and plumbing replaced end to end.",
  },
];

/** The projects with a walkthrough clip, used by the homepage carousel. */
export const FEATURED_PROJECTS = PROJECTS.filter((project) => project.video);

/** Categories that actually have at least one project behind them. */
export const ACTIVE_CATEGORIES = PROJECT_CATEGORIES.filter((category) =>
  PROJECTS.some((project) => project.category === category)
);
