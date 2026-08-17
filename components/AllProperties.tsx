import styles from "./AllProperties.module.css";

const ICON_PROPS = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

function BedIcon() {
  return (
    <svg {...ICON_PROPS} className={styles.specIcon}>
      <path d="M2 4v16" />
      <path d="M2 8h18a2 2 0 0 1 2 2v10" />
      <path d="M2 17h20" />
      <path d="M6 8v9" />
    </svg>
  );
}

function BathIcon() {
  return (
    <svg {...ICON_PROPS} className={styles.specIcon}>
      <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
      <line x1="10" x2="8" y1="5" y2="7" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <line x1="7" x2="7" y1="19" y2="21" />
      <line x1="17" x2="17" y1="19" y2="21" />
    </svg>
  );
}

function AreaIcon() {
  return (
    <svg {...ICON_PROPS} className={styles.specIcon}>
      <path d="M8 3H5a2 2 0 0 0-2 2v3" />
      <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
      <path d="M3 16v3a2 2 0 0 0 2 2h3" />
      <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      {...ICON_PROPS}
      width={16}
      height={16}
      className={styles.tourIcon}
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

const LISTINGS = [
  {
    id: "casa-meridian",
    title: "Casa Meridian",
    status: "Delivered",
    img: "/images/project_1_1779380254029.png",
    beds: "4",
    baths: "3",
    area: "3,400 sqft",
    price: "₹2.8 Cr",
  },
  {
    id: "ivory-residence",
    title: "The Ivory Residence",
    status: "Delivered",
    img: "/images/project_2_1779380272507.png",
    beds: "5",
    baths: "4",
    area: "4,800 sqft",
    price: "₹4.2 Cr",
  },
  {
    id: "arken-house",
    title: "Arken House",
    status: "Delivered",
    img: "/images/project_3_1779380290833.png",
    beds: "3",
    baths: "3",
    area: "2,600 sqft",
    price: "₹1.95 Cr",
  },
];

export default function AllProperties() {
  return (
    <section className={styles.section} id="properties-all-show-section">
      <div className={styles.grid}>
        <div className={styles.leftCol}>
          <div className={styles.label}>
            <span className={styles.dot} aria-hidden="true" />
            <span className={styles.labelText}>All Properties</span>
          </div>
          <h2 className={styles.heading}>
            Check On All Properties We Have Available
          </h2>
        </div>

        <div className={styles.cardsStack}>
          {LISTINGS.map((listing, i) => (
            <div
              className={styles.card}
              key={listing.id}
              style={{ top: 120 + i * 40, zIndex: 10 + i }}
            >
              <div className={styles.cardHeader}>
                <div className={styles.thumb}>
                  <img
                    src={listing.img}
                    alt={listing.title}
                    className={styles.thumbImg}
                  />
                </div>
                <div className={styles.headerText}>
                  <span className={styles.badge}>{listing.status}</span>
                  <h3 className={styles.cardTitle}>{listing.title}</h3>
                </div>
              </div>

              <div className={styles.divider} />

              <div className={styles.specs}>
                <div className={styles.spec}>
                  <div className={styles.specLabel}>
                    <BedIcon />
                    <span>Beds</span>
                  </div>
                  <span className={styles.specValue}>{listing.beds}</span>
                </div>
                <div className={styles.spec}>
                  <div className={styles.specLabel}>
                    <BathIcon />
                    <span>Baths</span>
                  </div>
                  <span className={styles.specValue}>{listing.baths}</span>
                </div>
                <div className={styles.spec}>
                  <div className={styles.specLabel}>
                    <AreaIcon />
                    <span>Area</span>
                  </div>
                  <span className={styles.specValue}>{listing.area}</span>
                </div>
              </div>

              <div className={styles.divider} />

              <div className={styles.actionRow}>
                <div className={styles.priceBlock}>
                  <span className={styles.priceLabel}>Price</span>
                  <span className={styles.price}>{listing.price}</span>
                </div>
                <a href="https://wa.me/916398792951" className={styles.tourBtn}>
                  <CalendarIcon />
                  <span className={styles.tourText}>Schedule Tour</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.banner}>
        <video
          autoPlay
          loop
          muted
          playsInline
          className={styles.bannerVideo}
          aria-hidden="true"
        >
          <source
            src="https://cdn.jiro.build/Real%20Estate%20-%20Ospey/video/4th%20box%20video.mp4"
            type="video/mp4"
          />
        </video>
      </div>
    </section>
  );
}
