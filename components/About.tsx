import styles from "./About.module.css";

const CARDS = [
  {
    img: "/images/project_1_1779380254029.png",
    alt: "Casa Meridian, a completed The Premium Construction project",
    prefix: "+",
    target: 340,
    suffix: "",
    label: "Projects Completed",
    desc: "Delivering excellence with every project, ensuring trust and satisfaction.",
  },
  {
    img: "/images/project_2_1779380272507.png",
    alt: "The Ivory Residence, a completed The Premium Construction project",
    prefix: "",
    target: 98,
    suffix: "%",
    label: "Satisfied Clients",
    desc: "Our clients trust us to guide them through their build from plot to possession.",
  },
  {
    img: "/images/project_3_1779380290833.png",
    alt: "Arken House, a completed The Premium Construction project",
    prefix: "+",
    target: 12,
    suffix: "",
    label: "Years Experience",
    desc: "Providing expert construction insight and dedication since 2012.",
  },
];

export default function About() {
  return (
    <section className={styles.about} id="about-us-section">
      <div className={styles.headerRow}>
        <div className={styles.label}>
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.labelText}>About us</span>
        </div>

        <div className={styles.statement}>
          <h2 className={styles.heading}>
            The Premium Construction is a turnkey residential builder dedicated to
            connecting people with homes that truly fit their lifestyle and
            goals. We combine engineering rigour with expert industry knowledge
            to simplify the process of designing, building and owning.
          </h2>
          <a href="#services-section" className={styles.btnMore}>
            More About Us
          </a>
        </div>
      </div>

      <div className={styles.grid}>
        {CARDS.map((card) => (
          <div className={styles.card} key={card.label}>
            <div className={styles.cardTop}>
              <img
                src={card.img}
                alt={card.alt}
                className={styles.cardImage}
              />
              <div className={styles.cardStat}>
                <span className={styles.cardNumber}>
                  {card.prefix}
                  <span className="counter" data-target={card.target}>
                    0
                  </span>
                  {card.suffix}
                </span>
                <span className={styles.cardLabel}>{card.label}</span>
              </div>
            </div>
            <div className={styles.divider} />
            <p className={styles.cardDesc}>{card.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
