import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { SITE_SETTINGS } from "@/data/settings";

export const metadata: Metadata = {
  title: "Privacy Policy & Disclaimer | Aura by Lifestyle & Lifestyle Homes",
  description:
    "Official privacy policy, legal disclaimers, MahaRERA registration disclosures, and terms for Aura by Lifestyle and Lifestyle Home Spaces in Amravati.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div style={{ backgroundColor: "#050a16", color: "#ffffff", minHeight: "100vh", fontFamily: "var(--font-sans), 'Montserrat', sans-serif" }}>
      <SiteNav activeHref="/privacy" />

      <main
        style={{
          paddingTop: "7.5rem",
          paddingBottom: "5rem",
          maxWidth: "960px",
          margin: "0 auto",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "3rem", borderBottom: "1px solid rgba(255, 255, 255, 0.12)", paddingBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
              fontWeight: 800,
              color: "#ffffff",
              marginBottom: "0.75rem",
            }}
          >
            Privacy Policy &amp; Legal Disclaimer
          </h1>
          <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "1rem", lineHeight: 1.6, margin: 0 }}>
            Official regulatory disclosures, MahaRERA compliance, and data protection policies for Lifestyle Home Spaces &amp; Aura by Lifestyle.
          </p>
          <div
            style={{
              marginTop: "1.25rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "1.25rem",
              fontSize: "0.85rem",
              color: "#ffffff",
              background: "rgba(194, 26, 34, 0.12)",
              border: "1px solid rgba(194, 26, 34, 0.35)",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
            }}
          >
            <span><strong>MahaRERA Reg. No.:</strong> P5030002502915</span>
            <span><strong>Jurisdiction:</strong> Amravati, Maharashtra</span>
          </div>
        </div>

        {/* Content Clauses */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", color: "rgba(255, 255, 255, 0.82)", lineHeight: 1.8 }}>
          
          <section>
            <h2 style={{ fontSize: "1.35rem", color: "#ffffff", marginBottom: "0.75rem", fontWeight: 700 }}>
              1. MahaRERA Statutory Disclaimer
            </h2>
            <p>
              Aura by Lifestyle is officially registered under the Maharashtra Real Estate Regulatory Authority (MahaRERA) with Registration Number <strong>P5030002502915</strong>. All project details, sanctioned building plans, layout approvals, specifications, and commencement certificates are available for public verification on the official MahaRERA website at <a href="https://maharera.maharashtra.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-wine, #c21a22)", textDecoration: "underline" }}>maharera.maharashtra.gov.in</a>.
            </p>
            <p style={{ marginTop: "0.5rem" }}>
              Lifestyle Home Spaces on DPS Road is delivered with immediate possession available. All transactions are governed strictly in accordance with statutory MahaRERA consumer protection norms.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.35rem", color: "#ffffff", marginBottom: "0.75rem", fontWeight: 700 }}>
              2. Architectural Renderings &amp; Visual Representation
            </h2>
            <p>
              The 3D artistic impressions, walkthrough videos, visual perspectives, and cut-sections featured on this website are conceptual representations intended to illustrate the design philosophy of the project. While every reasonable effort is made to maintain fidelity to approved architectural blueprints, actual elevations, landscaping, fixtures, and interior decor may vary slightly based on final engineering sanction and local municipal guidelines.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.35rem", color: "#ffffff", marginBottom: "0.75rem", fontWeight: 700 }}>
              3. Information Collection &amp; Use
            </h2>
            <p>
              When you submit an enquiry form, schedule a site walkthrough, or verify your mobile number via WhatsApp OTP, we collect your name, contact phone number, and optional email address. This information is used exclusively to:
            </p>
            <ul style={{ paddingLeft: "1.5rem", marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <li>Register your formal enquiry in our Real Estate CRM system under a unique Reference ID.</li>
              <li>Provide you with authentic floor plan PDFs, pricing kits, and availability updates.</li>
              <li>Facilitate direct communication between you and our authorized sales and engineering directors.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "1.35rem", color: "#ffffff", marginBottom: "0.75rem", fontWeight: 700 }}>
              4. Zero Commercial Trading of Personal Data
            </h2>
            <p>
              Lifestyle Home Spaces and Aura by Lifestyle maintain strict data privacy principles. We do not sell, rent, lease, or trade your personal contact information to any third-party marketing brokers or external commercial agencies under any circumstances. Information is accessed solely by authorized company executives and trusted banking partners assisting with your home loan paperwork.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.35rem", color: "#ffffff", marginBottom: "0.75rem", fontWeight: 700 }}>
              5. WhatsApp Communications &amp; OTP Verification
            </h2>
            <p>
              By opting into our WhatsApp concierge or signing in via mobile OTP, you consent to receive authentic transactional updates, verification codes, and project brochures via the official Meta WhatsApp Business API. You may opt out of promotional messages at any time by simply replying &quot;STOP&quot; to our official WhatsApp channel.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.35rem", color: "#ffffff", marginBottom: "0.75rem", fontWeight: 700 }}>
              6. Official Developer &amp; Site Office Contact
            </h2>
            <p>
              For formal legal disclosures, documentation verification, or inquiries regarding our privacy practices, please contact our administrative desk:
            </p>
            <div
              style={{
                marginTop: "0.75rem",
                padding: "1.25rem",
                borderRadius: "12px",
                background: "#0a1428",
                border: "1px solid rgba(255, 255, 255, 0.12)",
              }}
            >
              <p style={{ margin: "0 0 0.4rem" }}><strong>Entity:</strong> Lifestyle Home Spaces &amp; Aura by Lifestyle</p>
              <p style={{ margin: "0 0 0.4rem" }}><strong>Site &amp; Head Office:</strong> Aura by Lifestyle, Congress Nagar Road, Next to Dreamz Signature, Camp, Amravati — 444606</p>
              <p style={{ margin: "0 0 0.4rem" }}><strong>Direct Sales Desk:</strong> +91 7498256708</p>
              <p style={{ margin: 0 }}><strong>Email:</strong> admin@lifestylehomespaces.com</p>
            </div>
          </section>

        </div>
      </main>

      <SiteFooter settings={SITE_SETTINGS} />
    </div>
  );
}
