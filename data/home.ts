/**
 * Landing page content.
 *
 * The homepage was previously assembled from copy hardcoded across six
 * components, and which records it showed was implicit — a project appeared in
 * the carousel only as a side effect of having a walkthrough video. Both the
 * copy and the composition now live here, and in the CMS.
 */

export type HomeContent = {
  hero: {
    headline: string;
    description: string;
    ctaLabel: string;
    backgroundVideo: string;
    buildingImage: string;
    infoImage: string;
    infoPrice: string;
    infoCaption: string;
  };
  about: {
    label: string;
    statement: string;
    ctaLabel: string;
    cards: {
      img: string;
      alt: string;
      prefix: string;
      target: number;
      suffix: string;
      label: string;
      desc: string;
    }[];
  };
  explore: {
    tag: string;
    headline: string;
    video: string;
    overlayLabel: string;
    overlaySublabel: string;
    progress: number;
  };
  properties: {
    tag: string;
    heading: string;
    description: string;
    ctaLabel: string;
  };
  services: { heading: string; intro: string; ctaLabel: string };
  allProperties: {
    label: string;
    heading: string;
    ctaLabel: string;
    bannerVideo: string;
  };
  testimonials: { badge: string };
  faq: { badge: string; title: string };
  /** Which records appear, and in what order. */
  composition: {
    featuredProjectIds: string[];
    listingProjectIds: string[];
    featuredServiceIds: string[];
    exploreProjectId: string;
  };
};

const CDN = "https://cdn.jiro.build/Real%20Estate%20-%20Ospey";

export const HOME_CONTENT: HomeContent = {
  hero: {
    headline: "Dream Home",
    description:
      "Delivering excellence with every project, ensuring trust and satisfaction.",
    ctaLabel: "More About Us",
    backgroundVideo: `${CDN}/video/Header%20Bg%20Video%20Final.mp4`,
    buildingImage: `${CDN}/Imges/Front%20Image.png`,
    infoImage:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=310&h=300&q=80",
    infoPrice: "₹1.95 Cr",
    infoCaption: "Signature homes starting here — built across Delhi NCR.",
  },
  about: {
    label: "About us",
    statement:
      "The Premium Construction is a turnkey residential builder dedicated to connecting people with homes that truly fit their lifestyle and goals. We combine engineering rigour with expert industry knowledge to simplify the process of designing, building and owning.",
    ctaLabel: "More About Us",
    cards: [
      {
        img: "/images/project_1_1779380254029.png",
        alt: "Casa Meridian, a completed The Premium Construction project",
        prefix: "+",
        target: 340,
        suffix: "",
        label: "Projects Completed",
        desc: "Delivering excellence with every project, ensuring trust and satisfaction.",
      },
      {
        img: "/images/project_2_1779380272507.png",
        alt: "The Ivory Residence, a completed The Premium Construction project",
        prefix: "",
        target: 98,
        suffix: "%",
        label: "Satisfied Clients",
        desc: "Our clients trust us to guide them through their build from plot to possession.",
      },
      {
        img: "/images/project_3_1779380290833.png",
        alt: "Arken House, a completed The Premium Construction project",
        prefix: "+",
        target: 12,
        suffix: "",
        label: "Years Experience",
        desc: "Providing expert construction insight and dedication since 2012.",
      },
    ],
  },
  explore: {
    tag: "Explore more",
    headline:
      "Building Exceptional Residential Communities Designed To Elevate Everyday Living And Create Lasting Value For Generations.",
    video: `${CDN}/video/Explore%20Video.mp4`,
    overlayLabel: "Project 01",
    overlaySublabel: "Interior Finishing",
    progress: 85,
  },
  properties: {
    tag: "Properties",
    heading:
      "Explore signature homes built across Delhi NCR, each one designed around the way its owners actually live.",
    description:
      "Every home here was built turnkey — design, approvals, structure and finishing handled end to end by one team.",
    ctaLabel: "View all projects by category",
  },
  services: {
    heading: "What Services We Provide?",
    intro:
      "our services cover every stage — design, approvals, construction and handover — with transparent pricing, a dedicated site manager, and solutions tailored to how you want to live.",
    ctaLabel: "See all services by category",
  },
  allProperties: {
    label: "All Properties",
    heading: "Check On All Properties We Have Available",
    ctaLabel: "Browse all projects by category",
    bannerVideo: `${CDN}/video/4th%20box%20video.mp4`,
  },
  testimonials: { badge: "Testimonial" },
  faq: { badge: "FAQ", title: "Frequently Asked Questions" },
  composition: {
    featuredProjectIds: ["casa-meridian", "ivory-residence", "arken-house"],
    listingProjectIds: ["casa-meridian", "ivory-residence", "arken-house"],
    featuredServiceIds: [
      "new-home-construction",
      "turnkey-handover",
      "warranty-maintenance",
      "design-consulting",
    ],
    exploreProjectId: "casa-meridian",
  },
};
