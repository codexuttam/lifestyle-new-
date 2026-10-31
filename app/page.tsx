import SiteNav from "@/components/SiteNav";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import VslSection from "@/components/VslSection";
import About from "@/components/About";
import AuraFloorPlans from "@/components/AuraFloorPlans";
import AuraFeatureSequence from "@/components/AuraFeatureSequence";
import GallerySection from "@/components/GallerySection";
import DeveloperSection from "@/components/DeveloperSection";
import OtherProjectsSection from "@/components/OtherProjectsSection";
import JournalSection from "@/components/JournalSection";
import Faq from "@/components/Faq";
import HomeContactSection from "@/components/HomeContactSection";
import SiteFooter from "@/components/SiteFooter";
import Chatbot from "@/components/Chatbot";
import RevealAnimations from "@/components/RevealAnimations";
import { getFaqs } from "@/lib/content/faqs";
import { getHome } from "@/lib/content/home";
import { getSettings } from "@/lib/content/settings";

export default async function Home() {
  const [home, settings, faqs] = await Promise.all([
    getHome(),
    getSettings(),
    getFaqs(),
  ]);

  return (
    <main style={{ width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
      <RevealAnimations />
      <SiteNav activeHref="/" />

      {/* Section 1 — Full-Screen Hero: Aura Real 15-Storey Tower + SOL HAUS Editorial Typography */}
      <Hero content={home.hero} />

      {/* Verified Credentials & MahaRERA Trust Strip */}
      <TrustStrip />

      {/* Cinematic Walkthrough Film with 30% Auto-Enquiry Modal */}
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

      {/* Section 2 — About Aura: More Than Four Walls. A Way of Living. (Dynamic Scroll Reveal) */}
      <About content={home.about} />

      {/* Section 3 — The Project: Discover Your Aura (Interactive Floor Plans & 2/3 BHK Configs) */}
      <AuraFloorPlans />

      {/* Section 4 — Living Experience: Every Detail. A Better Experience (Dynamic Diagonal Animation) */}
      <AuraFeatureSequence />

      {/* Section 5 — Gallery: Curated Architectural Moments & Full-Screen Lightbox */}
      <GallerySection />

      {/* Section 6 — Lifestyle, The Developer: A Vision by Lifestyle */}
      <DeveloperSection />

      {/* Section 7 — Secondary Project: Lifestyle Home Spaces (DPS Road Landmark) */}
      <OtherProjectsSection />

      {/* Section 8 — Journal: Thoughts on Better Living */}
      <JournalSection />

      {/* Verified FAQ Accordion */}
      <Faq faqs={faqs} content={home.faq} />

      {/* Section 9 — Contact: Let's Begin A Conversation (API Wired) */}
      <HomeContactSection settings={settings} />

      {/* Section 10 — Footer: Aura by Lifestyle Primary Identity + Developer Attribution */}
      <SiteFooter settings={settings} />

      {/* Real Estate Assistant */}
      <Chatbot />
    </main>
  );
}
