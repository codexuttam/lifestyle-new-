/** Shared services catalogue.
 *
 * The homepage section and the dedicated /services page both read from here,
 * so a service is described once and its category stays consistent wherever
 * it shows up. Icons are looked up by key in components/ServiceIcons.tsx,
 * which keeps this file plain data.
 */

export const SERVICE_CATEGORIES = [
  "Construction",
  "Design",
  "Interiors",
  "Renovation",
  "Aftercare",
] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

export const SERVICE_ICON_KEYS = [
  "house",
  "key",
  "layers",
  "users",
  "compass",
  "sofa",
  "roller",
  "hammer",
  "droplet",
  "shield",
  "wrench",
] as const;

export type ServiceIconKey = (typeof SERVICE_ICON_KEYS)[number];

export type Service = {
  id: string;
  title: string;
  category: ServiceCategory;
  icon: ServiceIconKey;
  /** Short copy used on the homepage cards. */
  text: string;
  /** What the package actually covers, listed on the dedicated page. */
  includes: string[];
  /** Indicative commercials, shown on the dedicated page. */
  startingAt: string;
  timeline: string;
  /** Shown on the homepage section — four of these. */
  featured?: boolean;
};

export const SERVICES: Service[] = [
  {
    id: "new-home-construction",
    title: "New Home Construction",
    category: "Construction",
    icon: "house",
    text: "Build from bare plot to finished home with one accountable team — architectural drawings, RCC structure, and finishing delivered on a fixed-price contract.",
    includes: [
      "Site survey, soil test and orientation study",
      "Architectural, structural and MEP drawings",
      "RCC frame in M25 concrete with premium TMT steel",
      "Fixed-price contract with a dedicated site manager",
    ],
    startingAt: "₹1,850 / sqft",
    timeline: "9–14 months",
    featured: true,
  },
  {
    id: "turnkey-handover",
    title: "Turnkey Handover",
    category: "Construction",
    icon: "key",
    text: "Municipal approvals, utilities, snagging and final walkthrough all handled by us, so the only thing you do on possession day is collect the keys.",
    includes: [
      "Municipal sanction and completion certificates",
      "Electricity, water and sewage connections",
      "Snagging list cleared before handover",
      "Warranty and as-built documents on possession day",
    ],
    startingAt: "Included in build",
    timeline: "4–8 weeks",
    featured: true,
  },
  {
    id: "structural-rcc",
    title: "Structural & RCC Works",
    category: "Construction",
    icon: "layers",
    text: "Foundation, columns, slabs and roofing built strictly to IS code, with third-party testing on every concrete pour and steel batch.",
    includes: [
      "Foundation design matched to the soil report",
      "Cube testing on every pour, reports shared with you",
      "Seismic detailing per IS 13920",
      "Shuttering, curing and de-shuttering to schedule",
    ],
    startingAt: "₹1,150 / sqft",
    timeline: "4–7 months",
  },
  {
    id: "design-consulting",
    title: "Design Consulting",
    category: "Design",
    icon: "users",
    text: "Expert guidance on layout, orientation, Vastu and budget — backed by material insight and strategies tailored to how you plan to live.",
    includes: [
      "Plot feasibility and buildable-area study",
      "Layout options with Vastu alignment on request",
      "Material and finish selection within your budget",
      "Cost estimate before a single brick is laid",
    ],
    startingAt: "₹25,000 / consult",
    timeline: "1–3 weeks",
    featured: true,
  },
  {
    id: "architectural-design",
    title: "Architectural Design & 3D Views",
    category: "Design",
    icon: "compass",
    text: "Full drawing sets plus photoreal 3D walkthroughs, so you sign off on how the house actually looks before construction starts.",
    includes: [
      "Floor plans, elevations and sections",
      "Photoreal exterior and interior 3D renders",
      "Working drawings for the site team",
      "Two rounds of revisions included",
    ],
    startingAt: "₹65 / sqft",
    timeline: "3–6 weeks",
  },
  {
    id: "interior-fitout",
    title: "Interior Fit-Out",
    category: "Interiors",
    icon: "sofa",
    text: "Modular kitchens, wardrobes, false ceilings and lighting installed as one coordinated package inside a bare-shell home.",
    includes: [
      "Modular kitchen with branded hardware",
      "Wardrobes and storage joinery",
      "False ceiling, cove and task lighting",
      "Furniture layout and soft-furnishing guidance",
    ],
    startingAt: "₹1,400 / sqft",
    timeline: "8–16 weeks",
  },
  {
    id: "painting-finishing",
    title: "Painting & Finishing",
    category: "Interiors",
    icon: "roller",
    text: "Putty, primer and two-coat finishes in the exact shades you pick — try them on your own walls first in our paint visualizer.",
    includes: [
      "Surface prep, putty and primer",
      "Two-coat emulsion in your chosen shade",
      "Texture, lime wash and accent-wall finishes",
      "Exterior weatherproof coats with a 5-year film warranty",
    ],
    startingAt: "₹38 / sqft",
    timeline: "2–5 weeks",
  },
  {
    id: "renovation-extension",
    title: "Home Renovation & Extension",
    category: "Renovation",
    icon: "hammer",
    text: "Add a floor, reconfigure a layout or bring an older house up to current code — planned so you can keep living in it where possible.",
    includes: [
      "Structural audit of the existing building",
      "Additional floor or rear-extension design",
      "Layout reconfiguration and opening-up of walls",
      "Phased schedule to limit disruption",
    ],
    startingAt: "₹1,600 / sqft",
    timeline: "3–9 months",
  },
  {
    id: "repair-waterproofing",
    title: "Structural Repair & Waterproofing",
    category: "Renovation",
    icon: "droplet",
    text: "Seepage, cracks and spalling traced back to the cause and fixed properly, not patched over until the next monsoon.",
    includes: [
      "Leak tracing and crack-width assessment",
      "Terrace and bathroom waterproofing membranes",
      "Concrete repair, rebar treatment and re-plastering",
      "Post-monsoon inspection included",
    ],
    startingAt: "₹95 / sqft",
    timeline: "2–8 weeks",
  },
  {
    id: "warranty-maintenance",
    title: "Warranty & Maintenance",
    category: "Aftercare",
    icon: "shield",
    text: "A 30-month structural warranty on every build, with maintenance support that keeps your home sound long after the site team has left.",
    includes: [
      "30-month structural warranty in writing",
      "12-month cover on plumbing and electrical work",
      "Scheduled inspection at 6 and 18 months",
      "Priority callout for warranty issues",
    ],
    startingAt: "Included in build",
    timeline: "30 months",
    featured: true,
  },
  {
    id: "annual-maintenance",
    title: "Annual Maintenance Contract",
    category: "Aftercare",
    icon: "wrench",
    text: "One yearly contract covering plumbing, electrical, carpentry and touch-up work, with a single number to call when something breaks.",
    includes: [
      "Quarterly preventive inspection",
      "Plumbing, electrical and carpentry callouts",
      "Annual terrace and drainage check before monsoon",
      "Discounted rates on parts and repainting",
    ],
    startingAt: "₹36,000 / year",
    timeline: "Rolling annual",
  },
];

/** The four services shown on the homepage section. */
export const FEATURED_SERVICES = SERVICES.filter((service) => service.featured);

/** Categories that actually have at least one service behind them. */
export const ACTIVE_SERVICE_CATEGORIES = SERVICE_CATEGORIES.filter((category) =>
  SERVICES.some((service) => service.category === category)
);
