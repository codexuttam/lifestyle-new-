import SiteNav from "@/components/SiteNav";
import Chatbot from "@/components/Chatbot";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
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
