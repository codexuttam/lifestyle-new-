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

const STATS = [
  { target: 12, suffix: "+", label: "Years of Experience" },
  { target: 340, suffix: "+", label: "Homes Built" },
  { target: 98, suffix: "%", label: "Client Satisfaction" },
  { target: 18, suffix: "", label: "Cities Across India" },
];

const PROCESS_STEPS = [
  { title: "Site Visit & Assessment", text: "We visit your plot, study orientation, soil, and surroundings." },
  { title: "Design & Planning", text: "Architectural drawings, structural design, and 3D visualization delivered." },
  { title: "Contract & Approval", text: "Transparent fixed-price contract. Municipal approvals handled by us." },
  { title: "Foundation & Structure", text: "RCC framework built to IS code with premium TMT steel and M25 concrete." },
  { title: "Finishing & Interiors", text: "Plaster, flooring, electrical, plumbing, tiling, paint — all coordinated." },
  { title: "Handover & Warranty", text: "Final walkthrough, snagging list cleared, keys handed over with warranty documents." },
];

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

const BRANDS = [
  "UltraTech Cement",
  "Tata Steel",
  "Havells",
  "Kohler",
  "Asian Paints",
  "Kajaria",
  "Legrand",
  "Jaquar",
  "Saint-Gobain",
  "Somany",
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

export default function Home() {
  return (
    <>
      <RevealAnimations />
      <Hero />

      {/* SECTION 1: ABOUT US */}
      <About />

      {/* SECTION 1b: EXPLORE MORE */}
      <ExploreSection />

      {/* SECTION 1c: PROPERTIES */}
      <Properties />

      {/* SECTION 1d: SERVICES */}
      <Services />

      {/* SECTION 1e: ALL PROPERTIES */}
      <AllProperties />

      {/* SECTION 1f: TESTIMONIALS */}
      <Testimonials />

      {/* SECTION 1g: FAQ */}
      <Faq />

      {/* SECTION 1h: FOOTER */}
      <SiteFooter />

      {/* Sticky Floating Button */}
      <a href="https://wa.me/916398792951" className="floating-wa">
        <i className="fa-brands fa-whatsapp" />
      </a>

      {/* Mobile Sticky Bar */}
      <div className="mobile-sticky-bar">
        <a href="tel:+916398792951" className="call-btn">
          <i className="fa-solid fa-phone" /> Call Now
        </a>
        <a href="https://wa.me/916398792951" className="wa-btn">
          <i className="fa-brands fa-whatsapp" /> WhatsApp
        </a>
      </div>

      <CustomCursor />
    </>
  );
}
