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
          <h2 className={styles.heading}>
            RESERVE YOUR PRIVATE <span>SITE WALKTHROUGH</span>
          </h2>
          <p className={styles.lead}>
            Connect directly with Lifestyle Home Spaces to receive official 2 &amp; 3 BHK floor plan plates, unit orientation details, or a guided tour of Aura at Congress Nagar, Camp.
          </p>

          <div className={styles.channelCards}>
            <a
              href={whatsappHref(settings)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.channelCard}
            >
              <span className={styles.channelIndex}>01 · DIRECT WHATSAPP CHAT 💬</span>
              <span className={styles.channelValue}>+91 7498256708</span>
              <span className={styles.channelHint}>Instant Brochure &amp; Floor Plans ↗</span>
            </a>

            <a href={telHref(settings)} className={styles.channelCard}>
              <span className={styles.channelIndex}>02 · SITE OFFICE PHONE 📞</span>
              <span className={styles.channelValue}>+91 7498256708</span>
              <span className={styles.channelHint}>Direct Call With Sales Team →</span>
            </a>

            <a href={mailtoHref(settings)} className={styles.channelCard}>
              <span className={styles.channelIndex}>03 · CAMP SALES OFFICE 📍</span>
              <span className={styles.channelValue}>{settings.email}</span>
              <span className={styles.channelHint}>{settings.address}</span>
            </a>
          </div>
        </div>

        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h3 className={styles.formTitle}>Schedule Callback Or Visit 🏢</h3>
            <p className={styles.formSub}>
              Leave your contact details and our Amravati sales team will connect with you promptly.
            </p>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

