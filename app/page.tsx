import SolHausShell from "@/components/SolHausShell";
import SiteNav from "@/components/SiteNav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import PortfolioSection from "@/components/PortfolioSection";
import ExperienceSection from "@/components/ExperienceSection";
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
      <SiteNav activeHref="/" />

      {/* Hero: Minimal Nav + Dark Espresso Cinematic Architectural Stage */}
      <Hero content={home.hero} />

      {/* Section A — About Us: Asymmetric Editorial Composition */}
      <About content={home.about} />

      {/* Section B — Portfolio: Impressions That Endure (3-Column Showcase) */}
      <PortfolioSection />

      {/* Section C — Services / Living Experience: Dark Panel + 2x2 Floating White Cards */}
      <ExperienceSection />

      {/* Section D — Developer Portfolio: Lifestyle Home Spaces Landmark */}
      <SecondaryProjectSection />

      {/* Section E — Journal: Notes from the Studio (4 Staggered Editorial Blocks) */}
      <JournalSection />

      {/* Section F — Contact: Minimal Underline Conversation Form */}
      <HomeContactSection settings={settings} />

      {/* Section G — Footer: Warm Sand Band with Menu, Socials & Contact */}
      <SiteFooter settings={settings} />

      {/* Discreet Assistant */}
      <Chatbot />
    </SolHausShell>
  );
}
