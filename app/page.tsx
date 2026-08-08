import Link from "next/link";
import Navbar from "@/components/Navbar";
import HeroSequence from "@/components/HeroSequence";
import RevealAnimations from "@/components/RevealAnimations";
import Gallery from "@/components/Gallery";
import ContactForm from "@/components/ContactForm";
import CustomCursor from "@/components/CustomCursor";
import TiltCard from "@/components/TiltCard";
import PricingFlipCard from "@/components/PricingFlipCard";

const PROJECTS = [
  {
    img: "/images/project_1_1779380254029.png",
    location: "SECTOR 43, GURUGRAM",
    title: "Casa Meridian",
    details: "Plot: 200 sq yd · Built: 3,400 sq ft · ₹2.8 Cr · Delivered 2024",
  },
  {
    img: "/images/project_2_1779380272507.png",
    location: "DLF PHASE 2, DELHI",
    title: "The Ivory Residence",
    details: "Plot: 300 sq yd · Built: 4,800 sq ft · ₹4.2 Cr · Delivered 2023",
  },
  {
    img: "/images/project_3_1779380290833.png",
    location: "NOIDA SECTOR 50",
    title: "Arken House",
    details: "Plot: 150 sq yd · Built: 2,600 sq ft · ₹1.95 Cr · Delivered 2024",
  },
];

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
      '"Build Constructions delivered our dream home exactly on time and within budget. The quality of the RCC structure and finishing is exceptional. Couldn\'t have asked for a better team."',
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
      '"Excellent material quality, no hidden costs, and a beautiful finish. Build Constructions has set a new benchmark in Delhi NCR construction."',
    name: "Neha & Rohit Kapoor",
    loc: "DLF Phase 2, Delhi",
  },
  {
    quote:
      '"We compared 6 contractors before choosing Build Constructions. Best decision we made. The 30-month warranty gave us complete peace of mind."',
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
      <Navbar />
      <HeroSequence />

      {/* SECTION 1: FEATURED PROJECTS */}
      <section id="projects" className="section featured-projects reveal-section">
        <div className="container">
          <div className="section-header">
            <h2 className="hero-text">Our Signature Builds</h2>
            <p className="body-text">
              Each project is a testament to precision, design, and lasting quality.
            </p>
          </div>
          <div className="projects-grid">
            {PROJECTS.map((project) => (
              <TiltCard key={project.title}>
                <img src={project.img} alt={project.title} className="project-img" />
                <div className="project-overlay" />
                <div className="project-content">
                  <div className="project-location">{project.location}</div>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-details">{project.details}</p>
                  <button className="cta-button outline hover-slide">View Project</button>
                </div>
              </TiltCard>
            ))}
          </div>
          <div className="text-center" style={{ marginTop: 40 }}>
            <a href="#" className="gold-link">
              View All Projects &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 2: WHY CHOOSE US */}
      <section id="why-us" className="section why-us reveal-section">
        <div className="container two-col">
          <div className="stats-grid">
            {STATS.map((stat) => (
              <div className="stat-item" key={stat.label}>
                <div className="stat-number">
                  <span className="counter" data-target={stat.target}>
                    0
                  </span>
                  {stat.suffix && <span className="stat-plus">{stat.suffix}</span>}
                </div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="usp-list">
            <h2 className="hero-text">Built Different. Built Right.</h2>
            <ul>
              <li>
                <i className="fa-solid fa-check gold-icon" />{" "}
                <strong>Fixed Price Contracts</strong> — No hidden costs, ever.
              </li>
              <li>
                <i className="fa-solid fa-check gold-icon" />{" "}
                <strong>30-Month Structural Warranty</strong> on every build.
              </li>
              <li>
                <i className="fa-solid fa-check gold-icon" />{" "}
                <strong>Dedicated Site Manager</strong> assigned to your project.
              </li>
              <li>
                <i className="fa-solid fa-check gold-icon" />{" "}
                <strong>Turnkey Delivery</strong> — design, build, finish, handover.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW WE BUILD */}
      <section id="process" className="section process reveal-section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="hero-text">From Plot to Possession</h2>
            <p className="body-text text-center">
              A transparent, step-by-step process designed around you.
            </p>
          </div>
          <div className="timeline">
            <div className="timeline-line" />
            {PROCESS_STEPS.map((step, index) => (
              <div className="timeline-step" key={step.title}>
                <div className="step-circle">{index + 1}</div>
                <h4>{step.title}</h4>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: PRICING PACKAGES */}
      <section id="pricing" className="section pricing reveal-section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="hero-text">Transparent Pricing. Zero Surprises.</h2>
            <p className="body-text text-center">
              Choose a construction package that fits your vision and budget.
            </p>
          </div>
          <div className="pricing-grid">
            <PricingFlipCard
              name="Essential Build"
              price="₹1,650"
              bestFor="Best for: Budget-conscious quality builds"
              includes="RCC structure · Brick walls · Standard flooring · Basic fittings · 1 coat exterior paint"
              notIncluded="Modular kitchen · Premium tiles · False ceiling"
            />
            <PricingFlipCard
              name="Premium Build"
              price="₹2,200"
              bestFor="Best for: Modern family homes"
              includes="Everything in Essential + Vitrified flooring · Premium sanitary · False ceiling in living · Modular kitchen · 2-coat texture exterior"
              highlighted
              ctaVariant="solid"
              badge={
                <div className="popular-badge">
                  <i className="fa-solid fa-star" /> MOST POPULAR
                </div>
              }
            />
            <PricingFlipCard
              name="Luxury Build"
              price="₹3,100"
              bestFor="Best for: High-end villas and bungalows"
              includes="Everything in Premium + Italian marble · Home automation · Designer lighting · Landscaping · Architect-designed interiors"
            />
          </div>
          <p className="pricing-note text-center">
            * All prices per sq ft of built-up area. GST applicable. Site visit
            required for final quote.
          </p>
        </div>
      </section>

      {/* SECTION 5: PHOTO GALLERY + LIGHTBOX */}
      <Gallery />

      {/* SECTION 5b: PAINT VISUALIZER TEASER */}
      <section className="section visualizer-teaser reveal-section">
        <div className="container teaser-inner">
          <div>
            <h3 className="small-caps">Free Tool</h3>
            <h2 className="hero-text">Try The Colour On Your Wall First</h2>
            <p className="body-text">
              Click a wall, pick a shade, and see the room repainted instantly —
              shadows, texture and all. Upload your own photo or start from one
              of our finished homes, then copy the exact HEX, RGB and HSL codes
              for your painter.
            </p>
            <Link href="/paint-visualizer" className="cta-button solid">
              Open Paint Visualizer
            </Link>
          </div>
          <div className="teaser-swatches" aria-hidden="true">
            {TEASER_SWATCHES.map((swatch) => (
              <div
                className="teaser-swatch"
                key={swatch.hex}
                style={{ background: swatch.hex, color: swatch.ink }}
              >
                {swatch.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: CLIENT TESTIMONIALS */}
      <section id="testimonials" className="section testimonials reveal-section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="hero-text">Words From Our Homeowners</h2>
          </div>
        </div>
        <div className="carousel-container">
          <div className="carousel-track">
            {TESTIMONIALS.map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
            {/* Duplicate first two for seamless loop */}
            {TESTIMONIALS.slice(0, 2).map((t) => (
              <TestimonialCard key={`${t.name}-dup`} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: EMPANELLED BRANDS */}
      <section className="section brands reveal-section">
        <h3 className="small-caps text-center" style={{ marginBottom: 40 }}>
          We Build With The Best
        </h3>
        <div className="marquee-container">
          <div className="marquee-content">
            {BRANDS.map((brand) => (
              <span key={brand}>{brand}</span>
            ))}
            {/* Duplicate for seamless loop */}
            {BRANDS.map((brand) => (
              <span key={`${brand}-dup`}>{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: CONTACT FORM */}
      <section id="contact" className="section contact reveal-section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="hero-text">Let&apos;s Build Together</h2>
            <p className="body-text text-center">
              Tell us about your project and we will get back within 24 hours.
            </p>
          </div>
          <div className="contact-grid">
            <div className="contact-info">
              <div className="info-item">
                <i className="fa-solid fa-location-dot gold-icon" />
                <div>
                  <h4>Address</h4>
                  <p>412, Suncity Business Tower, Sector 54, Gurugram, Haryana 122003</p>
                </div>
              </div>
              <div className="info-item">
                <i className="fa-solid fa-phone gold-icon" />
                <div>
                  <h4>Phone</h4>
                  <p>+91 98100 45231</p>
                </div>
              </div>
              <div className="info-item">
                <i className="fa-solid fa-envelope gold-icon" />
                <div>
                  <h4>Email</h4>
                  <p>hello@buildconstructions.in</p>
                </div>
              </div>
              <div className="info-item">
                <i className="fa-solid fa-clock gold-icon" />
                <div>
                  <h4>Office Hours</h4>
                  <p>Mon–Sat, 9:00 AM – 7:00 PM</p>
                </div>
              </div>
              <div className="map-placeholder">
                <img
                  src="https://picsum.photos/600/300?random=99"
                  alt="Map Placeholder"
                  style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <i className="fa-solid fa-map-location-dot fa-2x" />
                </div>
              </div>
            </div>
            <div className="contact-form">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col brand-col">
              <h2 className="hero-text" style={{ fontSize: 24, marginBottom: 10 }}>
                BUILD CONSTRUCTIONS
              </h2>
              <p className="tagline">Building Dreams, Delivering Legacies.</p>
              <p className="about-line">
                Delhi NCR&apos;s most trusted residential construction company since 2012.
              </p>
              <div className="social-links">
                <a href="#">
                  <i className="fa-brands fa-instagram" />
                </a>
                <a href="#">
                  <i className="fa-brands fa-youtube" />
                </a>
                <a href="#">
                  <i className="fa-brands fa-facebook-f" />
                </a>
                <a href="#">
                  <i className="fa-brands fa-linkedin-in" />
                </a>
              </div>
            </div>
            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#process">Our Process</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#gallery">Gallery</a></li>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Services</h4>
              <ul>
                <li><a href="#">New Home Construction</a></li>
                <li><a href="#">Villa &amp; Bungalow</a></li>
                <li><a href="#">Renovation &amp; Remodelling</a></li>
                <li><a href="#">Commercial Construction</a></li>
                <li><a href="#">Interior Design</a></li>
                <li><a href="#">Plot Development</a></li>
                <li><a href="#">Vastu-Compliant Design</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Contact</h4>
              <ul>
                <li>412, Suncity Business Tower, Sector 54, Gurugram</li>
                <li>+91 98100 45231</li>
                <li>hello@buildconstructions.in</li>
              </ul>
              <a href="https://wa.me/919810045231" className="whatsapp-btn">
                <i className="fa-brands fa-whatsapp" /> Chat on WhatsApp
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            &copy; 2025 Build Constructions Pvt. Ltd. All rights reserved. &middot;{" "}
            <a href="#">Privacy Policy</a> &middot; <a href="#">Terms of Use</a>
          </div>
        </div>
      </footer>

      {/* Sticky Floating Button */}
      <a href="https://wa.me/919810045231" className="floating-wa">
        <i className="fa-brands fa-whatsapp" />
      </a>

      {/* Mobile Sticky Bar */}
      <div className="mobile-sticky-bar">
        <a href="tel:+919810045231" className="call-btn">
          <i className="fa-solid fa-phone" /> Call Now
        </a>
        <a href="https://wa.me/919810045231" className="wa-btn">
          <i className="fa-brands fa-whatsapp" /> WhatsApp
        </a>
      </div>

      <CustomCursor />
    </>
  );
}
