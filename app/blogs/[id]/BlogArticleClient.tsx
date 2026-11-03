"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import EnquiryModal from "@/components/EnquiryModal";
import RevealAnimations from "@/components/RevealAnimations";
import type { BrandBlogPost } from "@/lib/types/blog";
import type { SettingsRecord } from "@/lib/schemas/settings";
import { renderInlineFormatting } from "@/components/BlogArticleModal";
import styles from "./page.module.css";

interface BlogArticleClientProps {
  id: string;
  initialBlog: BrandBlogPost | null;
  settings: SettingsRecord;
  allInitialBlogs: BrandBlogPost[];
}

export default function BlogArticleClient({
  id,
  initialBlog,
  settings,
  allInitialBlogs,
}: BlogArticleClientProps) {
  const [blog, setBlog] = useState<BrandBlogPost | null>(initialBlog);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!blog && typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("lifestyle_ai_generated_blogs");
        if (stored) {
          const list: BrandBlogPost[] = JSON.parse(stored);
          const match = list.find((b) => b.id === id);
          if (match) setBlog(match);
        }
      } catch (e) {
        console.error("Error reading stored blogs:", e);
      }
    }
  }, [id, blog]);

  const handleShare = () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  if (!blog) {
    return (
      <div className={styles.notFoundWrap}>
        <SiteNav activeHref="/blogs" />
        <main className={styles.notFoundMain}>
          <span className={styles.categoryBadge}>JOURNAL PERSPECTIVE</span>
          <h1 className={styles.notFoundTitle}>Article Not Found</h1>
          <p className={styles.notFoundText}>
            The requested editorial perspective or update could not be located.
          </p>
          <Link href="/blogs" className={styles.backBtn}>
            ← Return to Journal
          </Link>
        </main>
        <SiteFooter settings={settings} />
      </div>
    );
  }

  const relatedProjectTitle =
    blog.relatedProject === "lifestyle-homes"
      ? "Lifestyle Home Spaces"
      : "Aura by Lifestyle";

  const relatedProjectSub =
    blog.relatedProject === "lifestyle-homes"
      ? "Delivered Ready-to-Move 2 & 3 BHK Homes & 24 High-Street Retail Showrooms on 24m DPS Road, Parvati Nagar. MahaRERA: P50300054447."
      : "Amravati's Premier 15-Storey Highrise Tower on Congress Nagar Road, Camp. 2 & 3 BHK Sky Suites & Crown Level 15 Sky Deck. MahaRERA: P5030002502915.";

  const relatedBlogs = allInitialBlogs
    .filter((b) => b.id !== blog.id)
    .slice(0, 2);

  return (
    <div className={styles.pageContainer}>
      <RevealAnimations />
      <SiteNav activeHref="/blogs" />

      <main className={styles.articleMain}>
        {/* Editorial Top Navigation Breadcrumb */}
        <div className={styles.topBar}>
          <Link href="/blogs" className={styles.backLink}>
            ← Back to Journal &amp; Articles
          </Link>
          <div className={styles.shareRow}>
            <button
              type="button"
              className={styles.shareBtn}
              onClick={handleShare}
              aria-label="Copy link to article"
            >
              {copied ? "✓ Link Copied" : "🔗 Copy Article Link"}
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `${blog.title} - Read more on Lifestyle Journal: ${typeof window !== "undefined" ? window.location.href : ""}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.shareWhatsApp}
            >
              Share via WhatsApp ↗
            </a>
          </div>
        </div>

        {/* Article Header */}
        <header className={styles.header}>
          <div className={styles.metaRow}>
            <span className={styles.categoryBadge}>{blog.category}</span>
            {blog.date && <span className={styles.metaItem}>{blog.date}</span>}
            {blog.readTime && (
              <>
                <span className={styles.metaDot}>·</span>
                <span className={styles.metaItem}>{blog.readTime}</span>
              </>
            )}
          </div>

          <h1 className={styles.articleTitle}>{blog.title}</h1>
          <p className={styles.articleExcerpt}>{blog.excerpt}</p>
        </header>

        {/* Hero Visual Image */}
        <div className={styles.heroMediaWrap}>
          <img
            src={blog.image}
            alt={blog.title}
            className={styles.heroImg}
          />
        </div>

        {/* Key Takeaways & Architectural Highlights Card */}
        {blog.highlights && blog.highlights.length > 0 && (
          <aside className={styles.highlightsCard} aria-label="Key Takeaways">
            <span className={styles.highlightsEyebrow}>KEY EDITORIAL TAKEAWAYS</span>
            <ul className={styles.highlightsList}>
              {blog.highlights.map((h, i) => (
                <li key={i} className={styles.highlightItem}>
                  <span className={styles.highlightBullet} aria-hidden="true">✦</span>
                  <span>{renderInlineFormatting(h)}</span>
                </li>
              ))}
            </ul>
          </aside>
        )}

        {/* Full Article Content */}
        <article className={styles.contentBody}>
          {blog.content && blog.content.length > 0 ? (
            blog.content.map((paragraph, idx) => (
              <p key={idx} className={styles.paragraph}>
                {renderInlineFormatting(paragraph)}
              </p>
            ))
          ) : (
            <p className={styles.paragraph}>{renderInlineFormatting(blog.excerpt)}</p>
          )}
        </article>

        {/* Connected Project Banner with Direct Verified Enquiry Flow */}
        <section className={styles.projectBanner}>
          <div className={styles.projectBannerContent}>
            <span className={styles.bannerTag}>FEATURED DEVELOPMENT</span>
            <h2 className={styles.bannerTitle}>{relatedProjectTitle}</h2>
            <p className={styles.bannerDesc}>{relatedProjectSub}</p>
            <div className={styles.bannerActions}>
              <button
                type="button"
                className={styles.enquirePrimaryBtn}
                onClick={() => setIsEnquiryOpen(true)}
              >
                <span>Enquire About {relatedProjectTitle} →</span>
              </button>
              <Link
                href={
                  blog.relatedProject === "lifestyle-homes"
                    ? "/projects/lifestyle-homes"
                    : "/"
                }
                className={styles.viewProjectBtn}
              >
                Explore Project Details
              </Link>
            </div>
          </div>
        </section>

        {/* Related Articles Row */}
        {relatedBlogs.length > 0 && (
          <section className={styles.relatedSection}>
            <h3 className={styles.relatedTitle}>MORE FROM THE JOURNAL</h3>
            <div className={styles.relatedGrid}>
              {relatedBlogs.map((item) => (
                <Link
                  key={item.id}
                  href={`/blogs/${item.id}`}
                  className={styles.relatedCard}
                >
                  <div className={styles.relatedImgWrap}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className={styles.relatedImg}
                      loading="lazy"
                    />
                  </div>
                  <div className={styles.relatedCardBody}>
                    <span className={styles.relatedCategory}>{item.category}</span>
                    <h4 className={styles.relatedCardTitle}>{item.title}</h4>
                    <span className={styles.readMoreLink}>Read Article →</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Official Project Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        projectTitle={relatedProjectTitle}
        defaultPreference={`Enquiry from Journal Article: ${blog.title}`}
        source={`Journal Article (${blog.id})`}
      />

      <SiteFooter settings={settings} />
    </div>
  );
}

