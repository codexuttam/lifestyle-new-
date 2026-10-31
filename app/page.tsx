import SolHausShell from "@/components/SolHausShell";
import SiteNav from "@/components/SiteNav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import AuraFeatureSequence from "@/components/AuraFeatureSequence";
import AuraFloorPlans from "@/components/AuraFloorPlans";
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

      {/* Section 2 — Aura Feature Sequence: Interactive Architectural 4-Tab Dimension Deck */}
      <AuraFeatureSequence />

      {/* Section 3 — Floor Plans & Cut-Sections: Interactive 2 & 3 BHK Layouts */}
      <AuraFloorPlans />

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
