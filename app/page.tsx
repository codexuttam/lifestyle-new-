import Hero from "@/components/Hero";
import ExploreSection from "@/components/ExploreSection";
import AuraFloorPlans from "@/components/AuraFloorPlans";
import Properties from "@/components/Properties";
import Services from "@/components/Services";
import AllProperties from "@/components/AllProperties";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
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

      {/* SECTION 1: EXPLORE 3D BUILDING */}
      <ExploreSection
        content={home.explore}
        projectTitle={
          exploreProject
            ? `${exploreProject.title}, ${exploreProject.location}`
            : ""
        }
      />

      {/* SECTION 1bb: AURA ARCHITECTURAL PLANS, 3D CUT-SECTIONS & CONNECTIVITY */}
      <AuraFloorPlans />

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
