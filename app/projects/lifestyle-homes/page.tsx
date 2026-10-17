import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import LifestyleBuildingInspector from "@/components/LifestyleBuildingInspector";
import LifestyleInteractiveShowcase from "@/components/LifestyleInteractiveShowcase";
import RevealAnimations from "@/components/RevealAnimations";
import CustomCursor from "@/components/CustomCursor";
import Faq from "@/components/Faq";
import { getSettings } from "@/lib/content/settings";
import { telHref, whatsappHref } from "@/lib/schemas/settings";
import styles from "./page.module.css";
import aboutStyles from "@/components/About.module.css";

export const metadata: Metadata = {
  title: "Lifestyle Home Spaces | Ready-to-Move 2 & 3 BHK Residences on DPS Road, Amravati",
  description:
    "Delivered residential & commercial landmark by Lifestyle Home Spaces on DPS Road, Parvati Nagar, Amravati. 100% Vastu compliant 2 & 3 BHK homes and 24 high-street retail showrooms with immediate key handover. MahaRERA: P50300054447.",
  alternates: { canonical: "/projects/lifestyle-homes" },
  openGraph: {
    title: "Lifestyle Home Spaces | Delivered 2 & 3 BHK Homes & 24 Shops, Amravati",
    description:
      "Ready for immediate possession. 30 residential suites and 24 commercial shops on DPS Road, Parvati Nagar, Amravati. MahaRERA: P50300054447.",
    images: [{ url: "/assets/projects/lifestyle-homes/building/lifestyle-hero-clean-4k.jpg" }],
  },
};

function SparkleIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C12 2 12.5 8 13.5 10.5C16 11.5 22 12 22 12C22 12 16 12.5 13.5 15C12.5 17.5 12 22 12 22C12 22 11.5 17.5 10.5 15C8 12.5 2 12 2 12C2 12 8 11.5 10.5 10.5C11.5 8 12 2 12 2Z"
        fill="currentColor"
      />
      <path
        d="M12 6C12 6 12.3 9.3 13 11C14.7 11.7 18 12 18 12C18 12 14.7 12.3 13 14C12.3 15.7 12 19 12 19C12 19 11.7 15.7 11 14C9.3 12.3 6 12 6 12C6 12 9.3 11.7 11 11C11.7 9.3 12 6 12 6Z"
        fill="currentColor"
        transform="rotate(45 12 12)"
      />
    </svg>
  );
}

const LIFESTYLE_ABOUT_CARDS = [
  {
    img: "/assets/projects/lifestyle-homes/building/lifestyle-hero-clean-4k.jpg",
    alt: "8-Storey Highrise Architecture",
    prefix: "",
    target: 8,
    suffix: " Storeys",
    label: "Delivered Landmark",
    desc: "Earthquake-resistant RCC framed landmark with dual high-speed elevators including dedicated stretcher lift with automatic rescue device (ARD).",
  },
  {
    img: "/assets/projects/lifestyle-homes/gallery/lifestyle-shops-commercial.jpg",
    alt: "24 Road-Facing High-Street Retail Showrooms",
    prefix: "",
    target: 24,
    suffix: " Shops",
    label: "Commercial Showrooms",
    desc: "Prime commercial frontage on 24-metre wide DPS Road with dedicated customer parking bays and active landmark brand footfalls.",
  },
  {
    img: "/assets/projects/lifestyle-homes/gallery/lifestyle-delivered-front.jpg",
    alt: "100% Ready Possession with Immediate Key Handover",
    prefix: "",
    target: 100,
    suffix: "%",
    label: "Ready for Possession",
    desc: "Ready for immediate possession. MahaRERA registered (P50300054447), pre-approved by all leading nationalized and private banks.",
  },
];

const LIFESTYLE_HOMES_FAQS = [
  {
    id: "lifestyle-faq-possession",
    order: 1,
    published: true,
    question: "What is the possession status of Lifestyle Home Spaces?",
    answer:
      "Lifestyle Home Spaces is a 100% completed and delivered landmark. Ready-to-move-in 2 & 3 BHK apartments are ready for immediate key handover, with families already residing in the complex and ground-floor retail outlets operational.",
  },
  {
    id: "lifestyle-faq-configs",
    order: 2,
    published: true,
    question: "What unit configurations and specifications are offered?",
    answer:
      "The project offers thoughtfully designed 2 BHK and 3 BHK Vastu-compliant luxury residences featuring private balconies, granite kitchen platform with semi-modular trolley provision, Jaquar bath fittings, 3-track powder coated windows, and heavy teak wood entrance door frames.",
  },
  {
    id: "lifestyle-faq-commercial",
    order: 3,
    published: true,
    question: "What are the commercial showroom details on DPS Road?",
    answer:
      "The project features 24 road-facing retail showrooms across Ground and First floors on the busy 24-metre wide DPS Road with dedicated visitor parking bays, high footfall visibility, and active landmark tenants including Dee Bakers.",
  },
  {
    id: "lifestyle-faq-rera",
    order: 4,
    published: true,
    question: "Is Lifestyle Home Spaces approved by MahaRERA?",
    answer:
      "Yes, Lifestyle Home Spaces is fully registered under MahaRERA with registration number P50300054447. All title deeds, occupancy permissions, and legal documentation are clear and verified.",
  },
  {
    id: "lifestyle-faq-loans",
    order: 5,
    published: true,
    question: "Which banks have approved home loans for this project?",
    answer:
      "Home loans and commercial property loans are pre-approved by all leading financial institutions including State Bank of India (SBI), HDFC Bank, ICICI Bank, Axis Bank, and Bank of Baroda with immediate sanction assistance.",
  },
];

const OFFICIAL_SPECS = [
  {
    icon: "fa-solid fa-cube",
    title: "RCC Earthquake-Resistant Structure",
    desc: "Robust RCC framed structure engineered to IS code standards. Red brick masonry with 6-inch outer and 4-inch inner walls finished with smooth double-coat plaster.",
  },
  {
    icon: "fa-solid fa-border-all",
    title: "Vitrified Flooring & Granite Stairs",
    desc: "Minimum 2' × 4' nano-polished vitrified tiles in Living, Dining, Bedrooms, and Kitchen. Granite stone flooring with SS safety railings on all staircases.",
  },
  {
    icon: "fa-solid fa-utensils",
    title: "Granite Kitchen with Semi-Modular Trolley",
    desc: "Jet-black granite platform with stainless steel sink, ceramic wall tiles up to lintel level, dedicated light & exhaust points, and semi-modular kitchen trolley provision.",
  },
  {
    icon: "fa-solid fa-faucet-drip",
    title: "Jaquar Bath & Concealed CPVC Plumbing",
    desc: "Single-lever diverters with premium Jaquar CP fittings, concealed push cocks in every bathroom, and wash basins in attached toilets with CPVC pipeline network.",
  },
  {
    icon: "fa-solid fa-door-closed",
    title: "Teak Door Frame & Video Doorbell",
    desc: "Main entrance door with heavy teak-wood or veneered frame and integrated video call doorbell. Inner plywood frames with laminated flush door shutters.",
  },
  {
    icon: "fa-solid fa-table-cells-large",
    title: "Powder-Coated 3-Track Windows",
    desc: "Granite window sills with heavy-gauge powder-coated aluminum sliding windows and integrated stainless-steel mosquito mesh on all openings.",
  },
  {
    icon: "fa-solid fa-elevator",
    title: "Dual Elevators (Passenger + Stretcher ARD)",
    desc: "1 passenger elevator plus 1 specialized stretcher elevator with automatic battery backup (ARD), safely landing cabins at nearest floor during power outages.",
  },
  {
    icon: "fa-solid fa-bolt",
    title: "Concealed Wiring & Inverter Provision",
    desc: "Concealed fire-retardant copper wiring with modular switches of reputed brand. Dedicated pre-installed wiring provision for inverter backup in each apartment.",
  },
  {
    icon: "fa-solid fa-water",
    title: "24-Hour Dual Water Supply System",
    desc: "Continuous 24-hour pressurized water supply from common sump well, bore-well with OHT network system, and heavy-duty RCC overhead water storage tank.",
  },
  {
    icon: "fa-solid fa-paintbrush",
    title: "Acrylic Paint & POP Ceiling Finish",
    desc: "External walls finished in weather-shield acrylic paint. Internal walls finished with putty and Tractor Emulsion paint, plus decorative POP in Living, Hall & Bedrooms.",
  },
  {
    icon: "fa-solid fa-video",
    title: "Gated Security & CCTV with 15-Day Backup",
    desc: "Attractive entrance security gate, manned security post, and comprehensive CCTV surveillance coverage across parking and common areas with 15-day recording backup.",
  },
  {
    icon: "fa-solid fa-dumbbell",
    title: "Exclusive Open-Air Fitness Gym",
    desc: "Dedicated open gym and wellness zone provided exclusively for the health and recreation of residential apartment owners.",
  },
];

const CONNECTIVITY_ITEMS = [
  {
    category: "Education (Within 2 KM)",
    icon: "fa-solid fa-graduation-cap",
    places: "DPS School · Vijaya Convent · Samarth High School",
  },
  {
    category: "Healthcare (Within 2 KM)",
    icon: "fa-solid fa-hospital",
    places: "Lifecare Multi-Speciality Hospital · RIMS Hospital",
  },
  {
    category: "Shopping & Retail (Within 2 KM)",
    icon: "fa-solid fa-cart-shopping",
    places: "Tapadiya City Mall · D-Mart · On-Site Commercial Galleria",
  },
  {
    category: "Transit Hubs (Within 1.5 KM)",
    icon: "fa-solid fa-train-subway",
    places: "New Amravati Railway Station · Saturna Central Bus Terminal",
  },
  {
    category: "Dining & Hospitality (Within 2 KM)",
    icon: "fa-solid fa-utensils",
    places: "Rangoli Grand Hotel · Neelam Luxury Hotel & Dining",
  },
  {
    category: "Commercial Core (3 - 4 KM)",
    icon: "fa-solid fa-briefcase",
    places: "Rajapeth Business Square · Nawathe Commercial Hub · Rajkamal Chowk",
  },
];

export default async function LifestyleHomesPage() {
  const settings = await getSettings();

  const waVisitHref = `${whatsappHref(settings)}?text=${encodeURIComponent(
    "Hello Lifestyle Homes, I would like to schedule an on-site visit and inspect delivered ready-to-move units at Lifestyle Home Spaces on DPS Road."
  )}`;

  return (
    <>
      <RevealAnimations />
      <SiteNav activeHref="/projects/lifestyle-homes" />

      <main className={styles.page}>
        {/* ============ DRAMATIC LUXURY HERO SECTION (Identical Aura Format) ============ */}
        <section className={styles.hero} id="hero-section">
          {/* 4K Zoomed-out Building Background Image */}
          <div className={styles.buildingContainer}>
            <img
              src="/assets/projects/lifestyle-homes/building/lifestyle-hero-clean-4k.jpg"
              alt="Lifestyle Home Spaces Delivered 8-Storey Highrise"
              className={styles.buildingImage}
            />
            <div className={styles.heroOverlay} />
          </div>

          {/* Giant Clean Headline */}
          <div className={styles.headlineContainer}>
            <h1 className={styles.headline}>LIFESTYLE</h1>
          </div>

          {/* Bottom-left content */}
          <div className={styles.leftBox}>
            <div className={styles.sparkle} aria-hidden="true">
              <SparkleIcon />
            </div>
            <p className={styles.leftDescription}>
              Delivered residential &amp; commercial destination offering spacious ready-to-move 2 &amp; 3 BHK Vastu-compliant homes and 24 high-street retail showrooms with immediate key handover on DPS Road, Amravati.
            </p>
            <div className={styles.btnRow}>
              <a href="#unit-plans" className={styles.btnMore}>
                Explore 3D Floor Plans
              </a>
              <a href={waVisitHref} className={styles.btnOtherProject}>
                Book Site Walkthrough →
              </a>
            </div>
          </div>
        </section>

        {/* ============ ABOUT LIFESTYLE HOMES (Identical Aura Architecture) ============ */}
        <section className={aboutStyles.about} id="about-lifestyle-section">
          <div className={aboutStyles.headerRow}>
            <div className={aboutStyles.statement}>
              <h2 className={aboutStyles.heading}>
                Crafted For Peaceful Urban Living. 2 &amp; 3 BHK Vastu Residences &amp; 24 High-Street Showrooms.
              </h2>
              <a href={waVisitHref} className={aboutStyles.btnMore}>
                Schedule Site Visit →
              </a>
            </div>
          </div>

          <div className={aboutStyles.grid}>
            {LIFESTYLE_ABOUT_CARDS.map((card) => (
              <div className={aboutStyles.card} key={card.label}>
                <div className={aboutStyles.cardTop}>
                  <img
                    src={card.img}
                    alt={card.alt}
                    className={aboutStyles.cardImage}
                  />
                  <div className={aboutStyles.cardStat}>
                    <span className={aboutStyles.cardNumber}>
                      {card.prefix}
                      <span className="counter" data-target={card.target}>
                        0
                      </span>
                      {card.suffix}
                    </span>
                    <span className={aboutStyles.cardLabel}>{card.label}</span>
                  </div>
                </div>
                <div className={aboutStyles.divider} />
                <p className={aboutStyles.cardDesc}>{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============ 4K INTERACTIVE BUILDING INSPECTOR ============ */}
        <LifestyleBuildingInspector whatsappHref={waVisitHref} />

        {/* ============ DYNAMIC INTERACTIVE SHOWCASE (3D Floor Plans & Gallery) ============ */}
        <LifestyleInteractiveShowcase
          whatsappHref={whatsappHref(settings)}
          telHref={telHref(settings)}
        />

        {/* ============ 24 COMMERCIAL SHOPS SECTION ============ */}
        <section className={styles.commercialSection} id="commercial-shops">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              24 High-Street <span>Retail Showrooms</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Facing the prominent 24-metre wide DPS Road with direct customer parking and massive daily footfall. Hosting landmark tenants like Dee Bakers and MORE Supermarket.
            </p>
          </div>

          <div className={styles.commercialGrid}>
            <div className={styles.commercialImageCol}>
              <img
                src="/assets/projects/lifestyle-homes/gallery/lifestyle-shops-commercial.jpg"
                alt="Lifestyle Homes Commercial Galleria"
                className={styles.commercialImg}
              />
              <div className={styles.commercialBadge}>
                <span className={styles.commercialBadgeDot} />
                <span>12 Ground + 12 First Floor Showrooms</span>
              </div>
            </div>

            <div className={styles.commercialDetailsCol}>
              <div className={styles.statBoxRow}>
                <div className={styles.statBox}>
                  <span className={styles.statVal}>24</span>
                  <span className={styles.statLbl}>Prime Retail Shops</span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statVal}>24 M</span>
                  <span className={styles.statLbl}>DPS Road Width</span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statVal}>100%</span>
                  <span className={styles.statLbl}>Delivered &amp; Active</span>
                </div>
              </div>

              <div className={styles.shopsTableCard}>
                <h3 className={styles.tableCardHeading}>Official Brochure Area Statement</h3>
                <div className={styles.tableRow}>
                  <div>
                    <strong>Ground Floor (Shops 1 to 12)</strong>
                    <p>Sizes ranging from 191 to 337 SQFT built-up area</p>
                  </div>
                  <span className={styles.tableTag}>Immediate Possession</span>
                </div>
                <div className={styles.tableRow}>
                  <div>
                    <strong>First Floor (Shops 1 to 12)</strong>
                    <p>Sizes ranging from 170 to 400 SQFT built-up area</p>
                  </div>
                  <span className={styles.tableTag}>Immediate Possession</span>
                </div>
              </div>

              <div className={styles.commercialCtas}>
                <a
                  href={`${whatsappHref(settings)}?text=${encodeURIComponent(
                    "Hello Lifestyle Homes, I am interested in leasing or purchasing a commercial retail showroom at Lifestyle Home Spaces on DPS Road."
                  )}`}
                  className={styles.commercialPrimaryBtn}
                >
                  <i className="fa-brands fa-whatsapp" />
                  <span>Enquire For Available Shops</span>
                </a>
                <a href={telHref(settings)} className={styles.commercialSecondaryBtn}>
                  <i className="fa-solid fa-phone" />
                  <span>Call: +91 70385 00084</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ============ TECHNICAL SPECIFICATIONS GRID ============ */}
        <section className={styles.specsSection} id="specifications">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Engineering &amp; <span>Material Specifications</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Directly extracted from Page 16 of the official Lifestyle Home Spaces brochure. Built with earthquake-resistant structural safety and branded materials.
            </p>
          </div>

          <div className={styles.specsGrid}>
            {OFFICIAL_SPECS.map((spec, idx) => (
              <div className={styles.specCard} key={idx}>
                <div className={styles.specIconBox}>
                  <i className={spec.icon} />
                </div>
                <h3 className={styles.specTitle}>{spec.title}</h3>
                <p className={styles.specDesc}>{spec.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============ LOCATION & STRATEGIC CONNECTIVITY ============ */}
        <section className={styles.locationSection} id="location-connectivity">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Location &amp; <span>Strategic Connectivity</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Situated on DPS Road in Parvati Nagar, connecting Badnera Road to Akoli Road, minutes away from top institutions, medical hubs, and shopping destinations.
            </p>
          </div>

          <div className={styles.locationGrid}>
            <div className={styles.connectivityList}>
              {CONNECTIVITY_ITEMS.map((item, idx) => (
                <div className={styles.connItem} key={idx}>
                  <div className={styles.connIconBox}>
                    <i className={item.icon} />
                  </div>
                  <div className={styles.connText}>
                    <h3 className={styles.connCategory}>{item.category}</h3>
                    <p className={styles.connPlaces}>{item.places}</p>
                  </div>
                </div>
              ))}

              <div className={styles.projectDetailsCard}>
                <h3 className={styles.projectDetailsTitle}>Official Project Credentials</h3>
                <div className={styles.credRow}>
                  <span>Promoters:</span>
                  <strong>Rajesh Mishra | Amit Talda</strong>
                </div>
                <div className={styles.credRow}>
                  <span>MahaRERA Registration:</span>
                  <strong className={styles.goldText}>P50300054447</strong>
                </div>
                <div className={styles.credRow}>
                  <span>Architect:</span>
                  <strong>Rohit Punshi</strong>
                </div>
                <div className={styles.credRow}>
                  <span>Structural Designer:</span>
                  <strong>Er. Pankaj Deshmukh</strong>
                </div>
                <div className={styles.credRow}>
                  <span>Site Address:</span>
                  <strong>DPS Road, Parvati Nagar, Near Avinashe Avenue, Amravati</strong>
                </div>
              </div>
            </div>

            <div className={styles.locationMapCard}>
              <img
                src="/assets/projects/lifestyle-homes/gallery/lifestyle-location-connectivity.jpg"
                alt="Lifestyle Homes Official Location Map"
                className={styles.locationMapImg}
              />
              <div className={styles.mapCaption}>
                <span className={styles.mapPinDot} />
                <span>DPS Road, Parvati Nagar, Amravati — MahaRERA: P50300054447</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============ FREQUENTLY ASKED QUESTIONS (Identical Aura Accordion) ============ */}
        <Faq
          faqs={LIFESTYLE_HOMES_FAQS}
          content={{
            badge: "Lifestyle FAQ",
            title: "FREQUENTLY ASKED QUESTIONS",
          }}
        />

        {/* ============ CROSS-PROJECT PROMO: AURA FLAGSHIP ============ */}
        <div className={styles.auraBannerWrapper}>
          <div className={styles.auraBanner}>
            <div className={styles.auraBannerBg}>
              <img
                src="/aura/aura-hero-clean-4k.jpg"
                alt="Aura by Lifestyle 15-Storey Tower in 4K"
                className={styles.auraBannerImg}
              />
            </div>
            <div className={styles.auraBannerContent}>
              <div className={styles.auraBannerBadge}>
                <i className="fa-solid fa-gem" /> Flagship 15-Storey Sky Living Landmark
              </div>
              <h2 className={styles.auraBannerTitle}>
                Explore Aura by Lifestyle in Camp, Amravati
              </h2>
              <p className={styles.auraBannerDesc}>
                Looking for iconic highrise living with rooftop sky pool, 40+ luxury amenities, and 15 storeys of bespoke residential luxury? Discover Aura by Lifestyle — Amravati’s premier architectural landmark.
              </p>
              <Link href="/" className={styles.auraBannerBtn}>
                <span>Explore Aura Flagship Showcase</span>
                <i className="fa-solid fa-arrow-right" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter settings={settings} />

      {/* Sticky Floating Button */}
      <a
        href={whatsappHref(settings)}
        className="floating-wa"
        aria-label="Chat with Lifestyle Homes on WhatsApp"
      >
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
