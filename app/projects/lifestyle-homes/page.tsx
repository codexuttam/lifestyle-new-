import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Chatbot from "@/components/Chatbot";
import VslSection from "@/components/VslSection";
import LifestyleInteractiveShowcase from "@/components/LifestyleInteractiveShowcase";
import LifestyleSpecsShowcase from "@/components/LifestyleSpecsShowcase";
import RevealAnimations from "@/components/RevealAnimations";
import CustomCursor from "@/components/CustomCursor";
import Faq from "@/components/Faq";
import { getSettings } from "@/lib/content/settings";
import { telHref, whatsappHref } from "@/lib/schemas/settings";
import AnimatedCounter from "@/components/AnimatedCounter";
import styles from "./page.module.css";

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

const SPOTLIGHT_SPECS = [
  { key: "Possession Status", value: "100% Ready-to-Move" },
  { key: "Prime Address", value: "24m DPS Road, Parvati Nagar" },
  { key: "Residential Scale", value: "30 Vastu 2 & 3 BHK Homes" },
  { key: "Commercial Galleria", value: "24 Road-Facing Showrooms" },
];

const LIFESTYLE_ABOUT_CARDS = [
  {
    img: "/assets/projects/lifestyle-homes/building/lifestyle-hero-clean-4k.jpg",
    alt: "8-Storey Highrise Architecture on DPS Road",
    prefix: "",
    target: 8,
    suffix: " Storeys",
    label: "Delivered Landmark",
    desc: "Earthquake-resistant RCC framed landmark with dual high-speed elevators including dedicated stretcher lift with automatic rescue device (ARD).",
  },
  {
    img: "/assets/projects/lifestyle-homes/gallery/lifestyle-delivered-angled.jpg",
    alt: "24 Road-Facing High-Street Retail Showrooms",
    prefix: "",
    target: 24,
    suffix: " Shops",
    label: "Commercial Showrooms",
    desc: "Prime commercial frontage on 24-metre wide DPS Road with dedicated customer parking bays and active landmark brand footfalls.",
  },
  {
    img: "/assets/projects/lifestyle-homes/interiors/living-room-polished.jpg",
    alt: "100% Ready Possession Finished Living Suite",
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
    desc: "Robust RCC framed structure engineered to IS code standards with red brick masonry and smooth double-coat plaster.",
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
    desc: "Concealed fire-retardant copper wiring with modular switches and dedicated pre-installed inverter backup provision.",
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
    category: "Commercial Core (3 – 4 KM)",
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
        {/* ============ SECTION 1: CINEMATIC ARCHITECTURAL HERO (CHARCOAL) ============ */}
        <section className={styles.hero} id="hero-section" data-hero-stage>
          <div className={styles.videoContainer} data-hero-frame>
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster="/videos/2nd-clip-thumb.png"
              className={styles.heroVideo}
              data-hero-video
              aria-hidden="true"
            >
              <source src="/videos/lifestyle-showcase-clip.mp4" type="video/mp4" />
            </video>
            <div className={styles.heroOverlay} />
          </div>

          <div className={styles.heroInner}>
            <div className={styles.heroBottomDeck}>
              <div className={styles.headlineWrap}>
                <h1 className={styles.headline}>
                  <span className={styles.lineMask}>
                    <span className={styles.lineInner} data-hero-line>
                      LIFESTYLE HOME SPACES
                    </span>
                  </span>
                  <span className={styles.lineMask}>
                    <span
                      className={`${styles.lineInner} ${styles.headlineAccent}`}
                      data-hero-line
                    >
                      2 &amp; 3 BHK RESIDENCES &amp; 24 SHOWROOMS
                    </span>
                  </span>
                </h1>
              </div>

              <div className={styles.heroDivider} data-hero-rule />

              <div className={styles.heroFooterBar} data-hero-fade>
                <div className={styles.heroSpecList}>
                  <div className={styles.heroSpecItem}>
                    <span className={styles.heroSpecKey}>Configurations</span>
                    <span className={styles.heroSpecVal}>2 &amp; 3 BHK Vastu Homes</span>
                  </div>
                  <div className={styles.heroSpecItem}>
                    <span className={styles.heroSpecKey}>High-Street Galleria</span>
                    <span className={styles.heroSpecVal}>24 Retail Showrooms</span>
                  </div>
                  <div className={styles.heroSpecItem}>
                    <span className={styles.heroSpecKey}>MahaRERA Registered</span>
                    <span className={styles.heroSpecVal}>P50300054447</span>
                  </div>
                </div>

                <div className={styles.heroBtnGroup}>
                  <a
                    href="#unit-plans"
                    className={`${styles.btnExplore} roll-button`}
                  >
                    <span className="roll-text" data-text="Explore Landmark ↓">
                      Explore Landmark ↓
                    </span>
                  </a>
                  <a
                    href={waVisitHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.btnSchedule} roll-button`}
                  >
                    <span className="roll-text" data-text="Schedule Site Visit →">
                      Schedule Site Visit →
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ SECTION 2: VIDEO SALES LETTER + 30% POPUP (WARM IVORY) ============ */}
        <VslSection
          id="lifestyle-vsl"
          project="Lifestyle Home Spaces"
          preference="Ready Possession 2 & 3 BHK"
          source="VSL Popup (Lifestyle Home Spaces)"
          videoSrc="/videos/lifestyle-vsl.mp4"
          poster="/videos/2nd-clip-thumb.png"
          eyebrow=""
          headline="Lifestyle Home Spaces: Ready-to-Move Homes on DPS Road"
          intro="See the finished homes, the neighbourhood and the amenities, then book a walkthrough of a ready flat with our team."
          points={[
            "100% delivered: ready for immediate key handover",
            "18 × 2 BHK and 12 × 3 BHK Vastu-compliant residences",
            "24 road-facing retail shops on the ground and first floors",
            "DPS Road, Parvati Nagar, Amravati: 2 min to Delhi Public School, quick Ring Road access",
            "Covered parking, 24/7 security, cross-ventilated layouts. MahaRERA: P50300054447",
          ]}
        />

        {/* ============ SECTION 3: ARCHITECTURAL SPOTLIGHT & BENCHMARK CARDS (CHARCOAL) ============ */}
        <section className={styles.spotlightSection} id="about-lifestyle-section">
          <div className={styles.sectionInner}>
            <div className={styles.spotlightIntro} data-reveal>
              <h2 className={styles.monumentTitle}>
                <span>DELIVERED</span>
                <span className={styles.monumentAccent}>EXCELLENCE</span>
              </h2>
              <p className={styles.spotlightStatement}>
                Crafted for peaceful urban living on 24-metre DPS Road—combining 30 ready-to-move Vastu residences with 24 active ground and first-floor commercial showrooms.
              </p>
            </div>

            <div className={styles.specBar} data-reveal>
              {SPOTLIGHT_SPECS.map((item) => (
                <div className={styles.specCol} key={item.key}>
                  <span className={styles.specKey}>{item.key}</span>
                  <span className={styles.specVal}>{item.value}</span>
                </div>
              ))}
            </div>

            <div className={styles.benchmarkGrid} data-reveal-group>
              {LIFESTYLE_ABOUT_CARDS.map((card, index) => (
                <article className={styles.benchmarkCard} key={card.label}>
                  <div className={styles.benchmarkHeader}>
                    <span className={styles.benchmarkIndex}>(0{index + 1})</span>
                    <span className={styles.benchmarkLabel}>{card.label}</span>
                  </div>

                  <div className={styles.benchmarkImageWrap}>
                    <img
                      src={card.img}
                      alt={card.alt}
                      className={styles.benchmarkImg}
                      loading="lazy"
                    />
                  </div>

                  <div className={styles.benchmarkStatRow}>
                    <AnimatedCounter
                      target={card.target}
                      prefix={card.prefix}
                      suffix={card.suffix}
                      className={styles.benchmarkNumber}
                      unitClassName={styles.benchmarkUnit}
                    />
                  </div>

                  <div className={styles.benchmarkDivider} />
                  <p className={styles.benchmarkDesc}>{card.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============ SECTION 4-6: UNIFIED LANDMARK EXPLORER & 3D LAYOUTS + GALLERY + EMI ============ */}
        <LifestyleInteractiveShowcase
          whatsappHref={whatsappHref(settings)}
          telHref={telHref(settings)}
        />

        {/* ============ SECTION 7: 24 COMMERCIAL SHOPS (WARM IVORY EDITORIAL) ============ */}
        <section className={styles.commercialSection} id="commercial-shops">
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeaderLight} data-reveal>
              <h2 className={styles.sectionTitleLight}>
                24 ROAD-FACING <span>RETAIL SHOWROOMS</span>
              </h2>
              <p className={styles.sectionSubtitleLight}>
                Fronting the prominent 24-metre wide DPS Road with dedicated customer parking and high daily footfall—hosting operating brands including Dee Bakers and MORE Supermarket.
              </p>
            </div>

            <div className={styles.commercialGrid}>
              <div className={styles.commercialImageCol} data-reveal>
                <img
                  src="/assets/projects/lifestyle-homes/building/lifestyle-hero-clean-4k.jpg"
                  alt="Lifestyle Home Spaces Commercial Galleria on DPS Road"
                  className={styles.commercialImg}
                />
              </div>

              <div className={styles.commercialDetailsCol} data-reveal>
                <div className={styles.statBoxRow}>
                  <div className={styles.statBox}>
                    <span className={styles.statVal}>24</span>
                    <span className={styles.statLbl}>Prime Retail Shops</span>
                  </div>
                  <div className={styles.statBox}>
                    <span className={styles.statVal}>24M</span>
                    <span className={styles.statLbl}>DPS Road Frontage</span>
                  </div>
                  <div className={styles.statBox}>
                    <span className={styles.statVal}>100%</span>
                    <span className={styles.statLbl}>Delivered &amp; Active</span>
                  </div>
                </div>

                <div className={styles.shopsTableCard}>
                  <span className={styles.tableCardHeading}>
                    OFFICIAL BROCHURE AREA STATEMENT
                  </span>
                  <div className={styles.tableRow}>
                    <div>
                      <strong>Ground Floor · Shops 1 to 12</strong>
                      <p>Sizes ranging from 191 to 337 SQFT built-up area</p>
                    </div>
                    <span className={styles.tableTag}>Immediate Possession</span>
                  </div>
                  <div className={styles.tableRow}>
                    <div>
                      <strong>First Floor · Shops 1 to 12</strong>
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
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.commercialPrimaryBtn} roll-button`}
                  >
                    <span className="roll-text" data-text="Enquire For Available Shops →">
                      Enquire For Available Shops →
                    </span>
                  </a>
                  <a
                    href={telHref(settings)}
                    className={`${styles.commercialSecondaryBtn} roll-button`}
                  >
                    <span className="roll-text" data-text="Call: +91 70385 00084">
                      Call: +91 70385 00084
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ SECTION 8: TECHNICAL SPECIFICATIONS GRID (CHARCOAL) ============ */}
        <section className={styles.specsSection} id="specifications">
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeaderDark} data-reveal>
              <h2 className={styles.sectionTitleDark}>
                ENGINEERING &amp; <span>MATERIAL SPECIFICATIONS</span>
              </h2>
              <p className={styles.sectionSubtitleDark}>
                Directly verified from the official Lifestyle Home Spaces brochure—engineered with earthquake-resistant RCC structural safety and branded interior finishes.
              </p>
            </div>

            <LifestyleSpecsShowcase specs={OFFICIAL_SPECS} />
          </div>
        </section>

        {/* ============ SECTION 9: LOCATION & STRATEGIC CONNECTIVITY (WARM IVORY) ============ */}
        <section className={styles.locationSection} id="location-connectivity">
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeaderLight} data-reveal>
              <h2 className={styles.sectionTitleLight}>
                LOCATION &amp; <span>STRATEGIC CONNECTIVITY</span>
              </h2>
              <p className={styles.sectionSubtitleLight}>
                Situated on DPS Road in Parvati Nagar connecting Badnera Road to Akoli Road—minutes from leading schools, multi-speciality hospitals, and retail hubs.
              </p>
            </div>

            <div className={styles.locationGrid}>
              <div className={styles.connectivityList} data-reveal-group>
                {CONNECTIVITY_ITEMS.map((item, idx) => (
                  <div className={styles.connItem} key={idx}>
                    <div className={styles.connIconBox}>
                      <i className={item.icon} aria-hidden="true" />
                    </div>
                    <div className={styles.connText}>
                      <h3 className={styles.connCategory}>{item.category}</h3>
                      <p className={styles.connPlaces}>{item.places}</p>
                    </div>
                  </div>
                ))}

                <div className={styles.projectDetailsCard}>
                  <span className={styles.projectDetailsTitle}>
                    OFFICIAL PROJECT CREDENTIALS
                  </span>
                  <div className={styles.credRow}>
                    <span>Promoters</span>
                    <strong>Rajesh Mishra · Amit Talda</strong>
                  </div>
                  <div className={styles.credRow}>
                    <span>MahaRERA Registration</span>
                    <strong className={styles.goldText}>P50300054447</strong>
                  </div>
                  <div className={styles.credRow}>
                    <span>Architect</span>
                    <strong>Rohit Punshi</strong>
                  </div>
                  <div className={styles.credRow}>
                    <span>Structural Designer</span>
                    <strong>Er. Pankaj Deshmukh</strong>
                  </div>
                  <div className={styles.credRow}>
                    <span>Site Address</span>
                    <strong>DPS Road, Parvati Nagar, Near Avinashe Avenue, Amravati</strong>
                  </div>
                </div>
              </div>

              <div className={styles.locationMapCard} data-reveal>
                <div className={styles.mapBlueprintStage}>
                  <img
                    src="/assets/projects/lifestyle-homes/gallery/lifestyle-location-connectivity.jpg"
                    alt="Lifestyle Home Spaces Official Location Map & Shops Area Statement"
                    className={styles.locationMapImg}
                  />
                </div>
                <div className={styles.mapCaption}>
                  <span className={styles.mapPinDot} />
                  <span>DPS Road, Parvati Nagar, Amravati · MahaRERA: P50300054447</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ SECTION 10: DELIVERED REALITY FILM BANNER (CHARCOAL) ============ */}
        <section className={styles.bannersSection}>
          <div className={styles.sectionInner}>
            <div className={styles.lifestyleBanner} data-reveal>
              <video
                autoPlay
                loop
                muted
                playsInline
                poster="/videos/2nd-clip-thumb.png"
                className={styles.lifestyleBannerVideo}
                aria-hidden="true"
              >
                <source src="/videos/lifestyle-showcase-clip.mp4" type="video/mp4" />
              </video>
              <div className={styles.lifestyleBannerOverlay}>
                <div className={styles.lifestyleBannerContent}>
                  <h2 className={styles.bannerTitle}>
                    EXPERIENCE LIFESTYLE HOME SPACES IN MOTION
                  </h2>
                  <p className={styles.bannerDesc}>
                    Watch the completed architectural landmark on DPS Road, Parvati Nagar, Amravati—30 Vastu residences and 24 high-street retail showrooms ready for immediate possession.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ SECTION 11: FREQUENTLY ASKED QUESTIONS ============ */}
        <Faq
          faqs={LIFESTYLE_HOMES_FAQS}
          content={{
            badge: "",
            title: "FREQUENTLY ASKED QUESTIONS",
          }}
        />

        {/* ============ SECTION 12: CROSS-PROJECT PROMO — AURA FLAGSHIP ============ */}
        <section className={styles.auraPromoSection}>
          <div className={styles.sectionInner}>
            <div className={styles.auraBanner} data-reveal>
              <video
                autoPlay
                loop
                muted
                playsInline
                poster="/aura/aura-hero-clean-4k.jpg"
                className={styles.auraBannerVideo}
                aria-hidden="true"
              >
                <source src="/videos/aura-showcase-clip.mp4" type="video/mp4" />
              </video>
              <div className={styles.auraBannerScrim} />
              <div className={styles.auraBannerContent}>
                <h2 className={styles.bannerTitle}>
                  EXPLORE AURA BY LIFESTYLE IN CAMP, AMRAVATI
                </h2>
                <p className={styles.bannerDesc}>
                  Discover 15 storeys of contemporary skyline residences with a rooftop infinity pool, multi-sports turf, and panoramic sky horizons on Congress Nagar Road, Camp.
                </p>
                <Link href="/" className={`${styles.btnSchedule} roll-button`}>
                  <span className="roll-text" data-text="Explore Aura Flagship Showcase →">
                    Explore Aura Flagship Showcase →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter settings={settings} />

      <Chatbot />

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
