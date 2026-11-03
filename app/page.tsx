import SolHausShell from "@/components/SolHausShell";
import SiteNav from "@/components/SiteNav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import VslSection from "@/components/VslSection";
import AuraFeatureSequence from "@/components/AuraFeatureSequence";
import AuraFloorPlans from "@/components/AuraFloorPlans";
import MortgageCalculator from "@/components/MortgageCalculator";
import SecondaryProjectSection from "@/components/SecondaryProjectSection";
import JournalSection from "@/components/JournalSection";
import HomeContactSection from "@/components/HomeContactSection";
import SiteFooter from "@/components/SiteFooter";
import Chatbot from "@/components/Chatbot";
import RevealAnimations from "@/components/RevealAnimations";
import { getHome } from "@/lib/content/home";
import { getSettings } from "@/lib/content/settings";

export default async function Home() {
  const [home, settings] = await Promise.all([
    getHome(),
    getSettings(),
  ]);

  return (
    <SolHausShell>
      <RevealAnimations />

      {/* Sleek SOL HAUS Header Navigation (Nested inside Framed Container) */}
      <SiteNav activeHref="/" />

      {/* Hero: Light & Minimal Daytime Architectural Stage & Kinetic Typography */}
      <Hero content={home.hero} />

      {/* Section 1 — About Us: Asymmetric Editorial Composition & Animated Numbers */}
      <About content={home.about} />

      {/* Section 2 — Official Aura Film with 30% Auto-Enquiry Modal & Viewport AutoPlay */}
      <VslSection
        id="aura-vsl"
        project="Aura by Lifestyle"
        preference="2 & 3 BHK Luxury Residences"
        source="VSL Popup (Aura by Lifestyle)"
        videoSrc="/videos/aura-showcase-clip.mp4"
        poster="/aura/rooftop-amenities-3d.jpg"
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

      {/* Section 3 — Aura Feature Sequence: Interactive Architectural 4-Tab Dimension Deck */}
      <AuraFeatureSequence />

      {/* Section 3 — Floor Plans & Cut-Sections: Interactive 2 & 3 BHK Layouts */}
      <AuraFloorPlans />

      {/* Section 3b — Luxury Home Loan & EMI Investment Calculator */}
      <MortgageCalculator projectTitle="Aura by Lifestyle" defaultAmount={8500000} />

      {/* Section 4 — Developer Portfolio: Lifestyle Home Spaces Landmark on DPS Road */}
      <SecondaryProjectSection />

      {/* Section 5 — Journal: Notes from the Studio & Construction Updates */}
      <JournalSection />

      {/* Section 6 — Contact: Minimal Underline Conversation Form */}
      <HomeContactSection settings={settings} />

      {/* Section 7 — Footer: Warm Neutral Band with Brand Menu & Direct Dial */}
      <SiteFooter settings={settings} />

      {/* Discreet Assistant */}
      <Chatbot />
    </SolHausShell>
  );
}
