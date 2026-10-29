import SiteNav from "@/components/SiteNav";
import Chatbot from "@/components/Chatbot";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import VslSection from "@/components/VslSection";
import About from "@/components/About";
import Services from "@/components/Services";
import ExploreSection from "@/components/ExploreSection";
import AuraFloorPlans from "@/components/AuraFloorPlans";
import AuraFeatureSequence from "@/components/AuraFeatureSequence";
import Properties from "@/components/Properties";
import AllProperties from "@/components/AllProperties";
import BuyingJourney from "@/components/BuyingJourney";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import HomeContactSection from "@/components/HomeContactSection";
import SiteFooter from "@/components/SiteFooter";
import RevealAnimations from "@/components/RevealAnimations";
import CustomCursor from "@/components/CustomCursor";
import { getFaqs } from "@/lib/content/faqs";
import { getHome } from "@/lib/content/home";
import { getSettings } from "@/lib/content/settings";
import { telHref, whatsappHref } from "@/lib/schemas/settings";
import { getExploreProject, getFeaturedProjects } from "@/lib/content/projects";
import { getFeaturedServices } from "@/lib/content/services";
import { getTestimonials } from "@/lib/content/testimonials";

export default async function Home() {
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
    <main style={{ width: "100%" }}>
      <RevealAnimations />
      <SiteNav activeHref="/" />

      {/* 01. Full-Screen Architectural Hero with Scroll-Morphing Video Stage (Dark Charcoal) */}
      <Hero content={home.hero} />

      {/* 02. Verified Landmark Credentials & MahaRERA Strip (Warm Ivory) */}
      <TrustStrip />

      {/* 02b. Video Sales Letter Walkthrough + 30% Completion Contact Popup (Warm Ivory) */}
      <VslSection
        id="aura-vsl"
        project="Aura by Lifestyle"
        preference="2 & 3 BHK Luxury Residences"
        source="VSL Popup (Aura by Lifestyle)"
        videoSrc="/videos/aura-showcase-clip.mp4"
        poster="/aura/aura-hero-clean-4k.jpg"
        eyebrow="OFFICIAL ARCHITECTURAL FILM · CAMP, AMRAVATI"
        headline="Aura by Lifestyle: 15-Storey Skyline Residences"
        intro="Take a cinematic walkthrough of Amravati's premier 15-storey highrise tower. Discover 2 & 3 BHK luxury residences, Level 15 rooftop sky oasis with infinity pool, and panoramic horizons over Camp."
        points={[
          "15-Storey landmark highrise tower on Congress Nagar Road, Camp",
          "1,150 to 1,850 SQFT 2 & 3 BHK luxury suites with 100% Vastu compliance",
          "Crown Level 15: Rooftop sky pool, kids pool, multi-sports turf & sky deck",
          "Double-height designer arrival lobby, 4 high-speed ARD elevators & generator backup",
          "MahaRERA Registered (P5030002502915) with leading bank home loan approvals",
        ]}
        primaryCta="Schedule Private Preview →"
        secondaryCta="Request VIP Floor Kit"
      />

      {/* 03. Architectural Spotlight & Converging Monumental Title (Dark Charcoal) */}
      <About content={home.about} />

      {/* 04. 3D Perspective Grid & Scroll-Revealed Engineering Craftsmanship (Warm Ivory) */}
      <Services services={featuredServices} content={home.services} />

      {/* 05. Interactive Tower Hotspots & Floor-Plate Exploration (Dark Charcoal) */}
      <ExploreSection
        content={home.explore}
        projectTitle={
          exploreProject
            ? `${exploreProject.title} · ${exploreProject.location}`
            : ""
        }
      />
      <AuraFloorPlans />

      {/* 06. Pinned 3D Fanning Video & Render Card Deck (Warm Ivory) */}
      <AuraFeatureSequence />

      {/* 07. Interactive Portfolio Stage & Sticky 3D Dynamic Card Stack (Deep Charcoal) */}
      <Properties projects={featuredProjects} content={home.properties} />
      <AllProperties content={home.allProperties} />

      {/* 08. Homebuying & Possession Journey Timeline with Blueprint SVGs (Warm Ivory) */}
      <BuyingJourney />

      {/* 09. Real Project Clips & Resident Testimonials (Dark + Warm Ivory Split) */}
      <Testimonials testimonials={testimonials} badge={home.testimonials.badge} />

      {/* 10. Accessible Hairline FAQ Accordion (Warm Ivory) */}
      <Faq faqs={faqs} content={home.faq} />

      {/* 11. Direct Developer Contact & Clean Architectural Footer (Dark Charcoal) */}
      <HomeContactSection settings={settings} />
      <SiteFooter settings={settings} />

      {/* Interactive Portfolio Concierge */}
      <Chatbot />

      {/* Mobile Sticky Action Bar */}
      <div className="mobile-sticky-bar">
        <a href={telHref(settings)} className="call-btn">
          <i className="fa-solid fa-phone" /> Call Desk
        </a>
        <a href={whatsappHref(settings)} className="wa-btn">
          <i className="fa-brands fa-whatsapp" /> WhatsApp
        </a>
      </div>

      <CustomCursor />
    </main>
  );
}
