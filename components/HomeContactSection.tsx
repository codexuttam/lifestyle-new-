import ContactForm from "@/components/ContactForm";
import {
  mailtoHref,
  telHref,
  whatsappHref,
  type SettingsRecord,
} from "@/lib/schemas/settings";
import styles from "./HomeContactSection.module.css";

export default function HomeContactSection({ settings }: { settings: SettingsRecord }) {
  return (
    <section className={styles.section} id="contact-section">
      <div className={styles.radialGlow} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.leftCol}>
          <span className={styles.eyebrow}>PROJECT ENQUIRY &amp; VISITS</span>
          <h2 className={styles.heading}>
            YOUR NEXT CHAPTER <span>STARTS HERE.</span>
          </h2>
          <p className={styles.lead}>
            Connect directly with the development team to receive official 2 &amp; 3 BHK floor plates, pricing schedules, or to book a private site visit to Aura at Congress Nagar, Camp.
          </p>

          <div className={styles.channelCards}>
            <a
              href={whatsappHref(settings)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.channelCard}
            >
              <span className={styles.channelIndex}>01 · WHATSAPP CONVERSATION</span>
              <span className={styles.channelValue}>+91 7498256708</span>
              <span className={styles.channelHint}>Instant Brochure &amp; Floor Plans ↗</span>
            </a>

            <a href={telHref(settings)} className={styles.channelCard}>
              <span className={styles.channelIndex}>02 · DIRECT SITE DESK</span>
              <span className={styles.channelValue}>+91 7498256708</span>
              <span className={styles.channelHint}>Speak With Our Property Advisors →</span>
            </a>

            <a href={mailtoHref(settings)} className={styles.channelCard}>
              <span className={styles.channelIndex}>03 · CAMP SALES OFFICE</span>
              <span className={styles.channelValue}>{settings.email}</span>
              <span className={styles.channelHint}>{settings.address}</span>
            </a>
          </div>
        </div>

        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h3 className={styles.formTitle}>Direct Enquiry &amp; Site Visit</h3>
            <p className={styles.formSub}>
              Share your details and our team will get back to you with confirmed availability.
            </p>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

