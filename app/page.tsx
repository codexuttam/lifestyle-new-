import Link from "next/link";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ExploreSection from "@/components/ExploreSection";
import Properties from "@/components/Properties";
import Services from "@/components/Services";
import AllProperties from "@/components/AllProperties";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import SiteFooter from "@/components/SiteFooter";
import RevealAnimations from "@/components/RevealAnimations";
import Gallery from "@/components/Gallery";
import ContactForm from "@/components/ContactForm";
import CustomCursor from "@/components/CustomCursor";
import PricingFlipCard from "@/components/PricingFlipCard";
import { getFaqs } from "@/lib/content/faqs";
import { getHome } from "@/lib/content/home";
import { getSettings } from "@/lib/content/settings";
import { telHref, whatsappHref } from "@/lib/schemas/settings";
import { getExploreProject, getFeaturedProjects } from "@/lib/content/projects";
import { getFeaturedServices } from "@/lib/content/services";
import { getTestimonials } from "@/lib/content/testimonials";

const TESTIMONIALS = [
  {
    quote:
      '"The Premium Construction delivered our dream home exactly on time and within budget. The quality of the RCC structure and finishing is exceptional. Couldn\'t have asked for a better team."',
    name: "Rajesh & Priya Malhotra",
    loc: "Casa Meridian, Gurugram",
  },
  {
    quote:
      '"From the first site visit to the final handover, every step was transparent and professional. Our 4BHK turned out better than we imagined."',
    name: "Amit Sharma",
    loc: "Noida Sector 50",
  },
  {
    quote:
      '"The dedicated site manager kept us updated daily. We were in Dubai during construction and had zero stress. Truly turnkey."',
    name: "Sanjay Verma",
    loc: "The Ivory Residence, Delhi",
  },
  {
    quote:
      '"Excellent material quality, no hidden costs, and a beautiful finish. The Premium Construction has set a new benchmark in Delhi NCR construction."',
    name: "Neha & Rohit Kapoor",
    loc: "DLF Phase 2, Delhi",
  },
  {
    quote:
      '"We compared 6 contractors before choosing The Premium Construction. Best decision we made. The 30-month warranty gave us complete peace of mind."',
    name: "Vikram Nair",
    loc: "Sector 43, Gurugram",
  },
];

/** A taste of the catalogue, shown on the homepage teaser. */
const TEASER_SWATCHES = [
  { name: "SAGE", hex: "#a8b5a0", ink: "#1a1613" },
  { name: "TERRACOTTA", hex: "#b5603f", ink: "#ffffff" },
  { name: "INDIGO", hex: "#31415e", ink: "#ffffff" },
  { name: "LINEN", hex: "#ece5d8", ink: "#1a1613" },
];

function TestimonialCard({
  quote,
  name,
  loc,
}: {
  quote: string;
  name: string;
  loc: string;
}) {
  return (
    <div className="testimonial-card">
      <i className="fa-solid fa-quote-left gold-quote" />
      <p className="quote-text">{quote}</p>
      <h4 className="client-name">{name}</h4>
      <p className="client-loc">{loc}</p>
      <div className="stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <i className="fa-solid fa-star" key={i} />
        ))}
      </div>
    </div>
  );
}

export default async function Home() {
  // Client components below cannot fetch, so the page reads once and passes down.
  const [
    home,
    settings,
    featuredProjects,
    featuredServices,
    exploreProject,
    testimonials,
    faqs,
  ] = await Promise.all([
    getHome(),
    getSettings(),
    getFeaturedProjects(),
    getFeaturedServices(),
    getExploreProject(),
    getTestimonials(),
    getFaqs(),
  ]);

  return (
    <>
      <RevealAnimations />
      <Hero content={home.hero} />

      {/* SECTION 1: ABOUT US */}
      <About content={home.about} />

      {/* SECTION 1b: EXPLORE MORE */}
      <ExploreSection
        content={home.explore}
        projectTitle={
          exploreProject
            ? `${exploreProject.title}, ${exploreProject.location}`
            : ""
        }
      />

      {/* SECTION 1c: PROPERTIES */}
      <Properties projects={featuredProjects} content={home.properties} />

      {/* SECTION 1d: SERVICES */}
      <Services services={featuredServices} content={home.services} />

      {/* SECTION 1e: ALL PROPERTIES */}
      <AllProperties content={home.allProperties} />

      {/* SECTION 1f: TESTIMONIALS */}
      <Testimonials testimonials={testimonials} badge={home.testimonials.badge} />

      {/* SECTION 1g: FAQ */}
      <Faq faqs={faqs} content={home.faq} />

      {/* SECTION 1h: FOOTER */}
      <SiteFooter settings={settings} />

      {/* Sticky Floating Button */}
      <a href={whatsappHref(settings)} className="floating-wa">
        <i className="fa-brands fa-whatsapp" />
      </a>

      {/* Mobile Sticky Bar */}
      <div className="mobile-sticky-bar">
        <a href={telHref(settings)} className="call-btn">
          <i className="fa-solid fa-phone" /> Call Now
        </a>
        <a href={whatsappHref(settings)} className="wa-btn">
          <i className="fa-brands fa-whatsapp" /> WhatsApp
        </a>
      </div>

      <CustomCursor />
    </>
  );
}
