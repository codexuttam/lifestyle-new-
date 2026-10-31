import Image from "next/image";
import Link from "next/link";
import styles from "./JournalSection.module.css";

export default function JournalSection() {
  return (
    <section className={styles.journal} id="journal" aria-label="Aura Journal">
      {/* Centered Editorial Header */}
      <div className={styles.header}>
        <span className={styles.sectionLabel}>JOURNAL</span>
        <h2 className={styles.title}>
          NOTES FROM THE <span className={styles.swashInitial}>S</span>TUDIO
        </h2>
      </div>

      {/* 4 Staggered Article Blocks */}
      <div className={styles.grid}>
        {/* Block 1: White Card */}
        <Link href="/blogs" className={styles.cardBlock}>
          <div>
            <h3 className={styles.cardTitle}>SPACES THAT BREATHE</h3>
            <p className={styles.cardExcerpt}>
              Designing residences that invite slow living, gentle movement, mindful rituals, and
              intentional presence across 15 storeys.
            </p>
          </div>
          <div className={styles.cardAction}>
            <span>READ MORE</span>
            <span>→</span>
          </div>
        </Link>

        {/* Block 2: Textures of Stillness */}
        <Link href="/blogs" className={styles.articleBlock}>
          <div className={`${styles.imageWrap} ${styles.imageWrapSquare}`}>
            <Image
              src="/aura/luxury-bedroom-2.jpg"
              alt="Textures of Stillness"
              fill
              sizes="(max-width: 1024px) 50vw, 280px"
              className={styles.articleImg}
            />
          </div>
          <h4 className={styles.articleTitle}>TEXTURES OF STILLNESS</h4>
        </Link>

        {/* Block 3: Light as a Material (Staggered Down) */}
        <Link href="/blogs" className={`${styles.articleBlock} ${styles.staggerDown}`}>
          <div className={`${styles.imageWrap} ${styles.imageWrapTall}`}>
            <Image
              src="/aura/sky-balcony-lifestyle.jpg"
              alt="Light as a Material"
              fill
              sizes="(max-width: 1024px) 50vw, 280px"
              className={styles.articleImg}
            />
          </div>
          <h4 className={styles.articleTitle}>LIGHT AS A MATERIAL</h4>
        </Link>

        {/* Block 4: The Beauty of Restraint */}
        <Link href="/blogs" className={styles.articleBlock}>
          <div className={`${styles.imageWrap} ${styles.imageWrapDeep}`}>
            <Image
              src="/aura/building-full-4k.jpg"
              alt="The Beauty of Restraint"
              fill
              sizes="(max-width: 1024px) 50vw, 280px"
              className={styles.articleImg}
            />
          </div>
          <h4 className={styles.articleTitle}>THE BEAUTY OF RESTRAINT</h4>
        </Link>
      </div>
    </section>
  );
}
