"use client";

import React, { useState, useRef } from "react";
import { BrandBlogPost } from "@/lib/types/blog";
import { submitLead } from "@/lib/leads/submitLead";

const WHATSAPP_NUMBER = "917498256708";

interface BlogArticleModalProps {
  blog: BrandBlogPost | null;
  onClose: () => void;
  onOpenEnquiry?: (projectTitle?: string) => void;
}

export function renderInlineFormatting(text: string): React.ReactNode {
  if (!text) return text;
  const tokens: React.ReactNode[] = [];
  let keyIndex = 0;

  const regex = /(\[(.*?)\]\((.*?)\)|\*\*(.*?)\*\*|`([^`]+)`|\*(.*?)\*)/g;
  let match: RegExpExecArray | null;
  let lastIndex = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(text.substring(lastIndex, match.index));
    }

    if (match[2] !== undefined && match[3] !== undefined) {
      const linkLabel = match[2];
      const linkUrl = match[3];
      const isExternal = linkUrl.startsWith("http://") || linkUrl.startsWith("https://");

      tokens.push(
        <a
          key={`lnk-${keyIndex++}`}
          href={linkUrl}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          style={{
            color: "#d5bd87",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
            textDecorationColor: "rgba(191, 149, 63, 0.6)",
            fontWeight: 600,
            cursor: "pointer",
            wordBreak: "break-word",
          }}
        >
          {linkLabel}
        </a>
      );
    } else if (match[4] !== undefined) {
      tokens.push(
        <strong key={`bld-${keyIndex++}`} style={{ fontWeight: 700, color: "#f7efdc" }}>
          {match[4]}
        </strong>
      );
    } else if (match[5] !== undefined) {
      tokens.push(
        <code
          key={`cd-${keyIndex++}`}
          style={{
            fontFamily: "monospace",
            fontSize: "0.86em",
            background: "rgba(247, 239, 220, 0.08)",
            padding: "2px 6px",
            borderRadius: "4px",
            color: "#f7efdc",
            border: "1px solid rgba(247, 239, 220, 0.15)",
          }}
        >
          {match[5]}
        </code>
      );
    } else if (match[6] !== undefined) {
      tokens.push(
        <em key={`it-${keyIndex++}`} style={{ fontStyle: "italic", color: "rgba(247, 239, 220, 0.8)" }}>
          {match[6]}
        </em>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push(text.substring(lastIndex));
  }

  return tokens.length > 0 ? tokens : text;
}

export default function BlogArticleModal({
  blog,
  onClose,
}: BlogArticleModalProps) {
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryNote, setInquiryNote] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const isSubmittingRef = useRef(false);

  if (!blog) return null;

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleArticleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;
    if (!inquiryName.trim() || !inquiryPhone.trim()) return;

    isSubmittingRef.current = true;
    setSubmitting(true);
    try {
      const result = await submitLead({
        name: inquiryName.trim(),
        phone: inquiryPhone.trim(),
        project: blog.relatedProject === "lifestyle-homes" ? "Lifestyle Home Spaces" : "Aura by Lifestyle",
        source: `Article Inquiry (${blog.title})`.slice(0, 80),
        message: inquiryNote.trim() || `Inquired via blog publication: ${blog.title}`,
      });
      if (result.ok) {
        setSubmitted(true);
      } else {
        console.error("CRM capture error:", result.error);
      }
    } finally {
      isSubmittingRef.current = false;
      setSubmitting(false);
    }

    const msg = `Hello Lifestyle Team,\n\nI was reading your publication: *"${blog.title}"* and would like to request further details, floor plans, and pricing for this development.\n\n*Name:* ${inquiryName || "Interested Reader"}\n*WhatsApp:* ${inquiryPhone || "Not specified"}\n*Query/Note:* ${inquiryNote || "Please share brochure and schedule an appointment."}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const primaryImage = blog.image || "/aura/aura-hero-clean-4k.jpg";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(5, 5, 5, 0.92)",
        backdropFilter: "blur(18px)",
        padding: "1rem",
        overflowY: "auto",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        style={{
          width: "100%",
          maxWidth: "920px",
          maxHeight: "92vh",
          overflowY: "auto",
          background: "#101210",
          border: "1px solid rgba(191, 149, 63, 0.36)",
          borderRadius: "26px",
          padding: "2.2rem",
          boxShadow: "0 32px 84px rgba(0, 0, 0, 0.85)",
          color: "#f7efdc",
          position: "relative",
          margin: "auto",
          fontFamily: "var(--font-sans)",
        }}
      >
        {/* Top Header Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
            paddingBottom: "1rem",
            borderBottom: "1px solid rgba(247, 239, 220, 0.1)",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                padding: "5px 12px",
                borderRadius: "9999px",
                background: "#bf953f",
                color: "#080808",
                fontSize: "10.5px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
              }}
            >
              {blog.category}
            </span>
            <span
              style={{
                padding: "5px 11px",
                borderRadius: "9999px",
                background: "rgba(191, 149, 63, 0.12)",
                border: "1px solid rgba(191, 149, 63, 0.34)",
                color: "#d5bd87",
                fontSize: "10.5px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              ✓ MahaRERA Verified
            </span>
            {blog.readTime && (
              <span style={{ fontSize: "12px", color: "rgba(247, 239, 220, 0.6)" }}>
                · {blog.readTime}
              </span>
            )}
            {blog.date && (
              <span style={{ fontSize: "12px", color: "rgba(247, 239, 220, 0.6)" }}>
                · {blog.date}
              </span>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={handleShare}
              type="button"
              style={{
                background: "#080808",
                border: "1px solid rgba(247, 239, 220, 0.2)",
                color: "#f7efdc",
                padding: "7px 14px",
                borderRadius: "9999px",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              {isCopied ? "✓ Link Copied" : "Share"}
            </button>
            <button
              onClick={onClose}
              type="button"
              aria-label="Close"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#080808",
                border: "1px solid rgba(247, 239, 220, 0.2)",
                color: "#f7efdc",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.9rem, 3.6vw, 2.8rem)",
            fontWeight: 600,
            lineHeight: 0.98,
            textTransform: "uppercase",
            color: "#f7efdc",
            marginBottom: "0.85rem",
          }}
        >
          {blog.title}
        </h1>

        <p style={{ color: "rgba(247, 239, 220, 0.76)", fontSize: "1rem", lineHeight: 1.65, marginBottom: "1.5rem" }}>
          {renderInlineFormatting(blog.excerpt)}
        </p>

        {/* Featured Visual Header Image */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "clamp(240px, 32vw, 380px)",
            borderRadius: "20px",
            overflow: "hidden",
            marginBottom: "2rem",
            border: "1px solid rgba(191, 149, 63, 0.3)",
            background: "#080808",
          }}
        >
          <img
            src={primaryImage}
            alt={blog.title}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/aura/aura-hero-clean-4k.jpg";
            }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(8, 8, 8, 0.88) 0%, rgba(8, 8, 8, 0.2) 50%, transparent 100%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "16px",
              left: "20px",
              right: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "8px",
              pointerEvents: "none",
            }}
          >
            <span
              style={{
                color: "#d5bd87",
                fontSize: "10.5px",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                fontWeight: 600,
              }}
            >
              LIFESTYLE ARCHITECTURAL INSIGHTS · AMRAVATI
            </span>
            <span
              style={{
                fontSize: "10px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#f7efdc",
                background: "rgba(8, 8, 8, 0.82)",
                padding: "4px 10px",
                borderRadius: "9999px",
                border: "1px solid rgba(247, 239, 220, 0.18)",
              }}
            >
              Full Research Edition
            </span>
          </div>
        </div>

        {/* Key Highlights */}
        {blog.highlights && blog.highlights.length > 0 && (
          <div
            style={{
              padding: "1.4rem 1.6rem",
              background: "rgba(191, 149, 63, 0.08)",
              borderLeft: "3px solid #bf953f",
              borderRadius: "0 16px 16px 0",
              marginBottom: "2rem",
            }}
          >
            <h4
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#d5bd87",
                marginBottom: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
              }}
            >
              KEY ARCHITECTURAL &amp; INVESTMENT TAKEAWAYS
            </h4>
            <ul style={{ margin: 0, paddingLeft: "1.2rem", display: "flex", flexDirection: "column", gap: "0.55rem" }}>
              {blog.highlights.map((h, i) => (
                <li key={i} style={{ color: "rgba(247, 239, 220, 0.9)", fontSize: "0.92rem", lineHeight: 1.55 }}>
                  {renderInlineFormatting(h)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Article Body */}
        <div style={{ color: "rgba(247, 239, 220, 0.86)", fontSize: "1rem", lineHeight: 1.8 }}>
          {blog.markdown ? (
            renderMarkdownContent(blog.markdown, blog.title)
          ) : (
            blog.content.map((p, i) => renderParagraph(p, i))
          )}
        </div>

        {/* Credentials Box */}
        <div
          style={{
            marginTop: "2.5rem",
            padding: "1.2rem 1.6rem",
            borderRadius: "16px",
            background: "rgba(247, 239, 220, 0.03)",
            border: "1px solid rgba(247, 239, 220, 0.12)",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: "rgba(191, 149, 63, 0.14)",
              border: "1px solid rgba(191, 149, 63, 0.36)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#d5bd87",
              fontSize: "0.95rem",
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            ✦
          </div>
          <div>
            <div style={{ fontSize: "0.92rem", fontWeight: 600, color: "#f7efdc" }}>
              Lifestyle Home Spaces Editorial &amp; Engineering Desk
            </div>
            <div style={{ fontSize: "0.8rem", color: "rgba(247, 239, 220, 0.6)", marginTop: "2px" }}>
              Published in accordance with MahaRERA disclosures (Aura: P5030002502915 · Lifestyle: P50300054447).
            </div>
          </div>
        </div>

        {/* Direct CRM Lead Capture & WhatsApp Form */}
        <div
          style={{
            marginTop: "2rem",
            padding: "1.8rem",
            borderRadius: "22px",
            background: "#080808",
            border: "1px solid rgba(191, 149, 63, 0.3)",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: "560px", margin: "0 auto 1.5rem" }}>
            <span
              style={{
                fontSize: "10.5px",
                textTransform: "uppercase",
                letterSpacing: "0.22em",
                color: "#bf953f",
                fontWeight: 700,
                display: "block",
                marginBottom: "0.4rem",
              }}
            >
              FAST INQUIRY &amp; BROCHURE REQUEST
            </span>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                color: "#f7efdc",
                margin: 0,
              }}
            >
              CONNECT WITH SENIOR ADVISORY DESK
            </h3>
            <p style={{ fontSize: "13px", color: "rgba(247, 239, 220, 0.65)", marginTop: "0.35rem" }}>
              Receive verified floor plans and schedule an on-site walkthrough with Amit Talda &amp; Rajesh Mishra.
            </p>
          </div>

          <form onSubmit={handleArticleInquiry} style={{ maxWidth: "460px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            <input
              type="text"
              required
              value={inquiryName}
              onChange={(e) => setInquiryName(e.target.value)}
              placeholder="Your Full Name *"
              style={{
                padding: "11px 16px",
                borderRadius: "12px",
                background: "#101210",
                border: "1px solid rgba(247, 239, 220, 0.16)",
                color: "#f7efdc",
                fontSize: "0.9rem",
                outline: "none",
              }}
            />
            <input
              type="tel"
              required
              value={inquiryPhone}
              onChange={(e) => setInquiryPhone(e.target.value)}
              placeholder="Your Phone / WhatsApp Number *"
              style={{
                padding: "11px 16px",
                borderRadius: "12px",
                background: "#101210",
                border: "1px solid rgba(247, 239, 220, 0.16)",
                color: "#f7efdc",
                fontSize: "0.9rem",
                outline: "none",
              }}
            />
            <textarea
              rows={2}
              value={inquiryNote}
              onChange={(e) => setInquiryNote(e.target.value)}
              placeholder="Specific questions or configuration preference (Optional)"
              style={{
                padding: "11px 16px",
                borderRadius: "12px",
                background: "#101210",
                border: "1px solid rgba(247, 239, 220, 0.16)",
                color: "#f7efdc",
                fontSize: "0.9rem",
                outline: "none",
                resize: "none",
              }}
            />

            <button
              type="submit"
              disabled={submitting}
              style={{
                marginTop: "0.5rem",
                padding: "13px 22px",
                borderRadius: "9999px",
                background: "#bf953f",
                color: "#080808",
                fontWeight: 700,
                fontSize: "11px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                border: "1px solid #d4af37",
                cursor: "pointer",
              }}
            >
              {submitting ? "Connecting..." : "Request Details via WhatsApp →"}
            </button>
            {submitted && (
              <span style={{ textAlign: "center", color: "#d5bd87", fontSize: "0.85rem", marginTop: "4px" }}>
                ✓ Inquiry registered in CRM! Opening WhatsApp desk...
              </span>
            )}
          </form>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            marginTop: "2rem",
            paddingTop: "1.2rem",
            borderTop: "1px solid rgba(247, 239, 220, 0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.8rem",
          }}
        >
          <div style={{ fontSize: "0.85rem", color: "rgba(247, 239, 220, 0.6)" }}>
            Need direct assistance? Call <strong style={{ color: "#f7efdc" }}>+91 7498256708</strong>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "9px 18px",
              borderRadius: "9999px",
              background: "transparent",
              border: "1px solid rgba(247, 239, 220, 0.25)",
              color: "#f7efdc",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Close Article
          </button>
        </div>
      </div>
    </div>
  );
}

function renderParagraph(paragraph: string, index: number) {
  if (paragraph.startsWith("# ")) {
    return (
      <h2
        key={index}
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.8rem",
          textTransform: "uppercase",
          color: "#f7efdc",
          marginTop: "1.8rem",
          marginBottom: "0.8rem",
          fontWeight: 600,
        }}
      >
        {renderInlineFormatting(paragraph.replace("# ", ""))}
      </h2>
    );
  }
  if (paragraph.startsWith("## ")) {
    return (
      <h3
        key={index}
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.5rem",
          textTransform: "uppercase",
          color: "#f7efdc",
          marginTop: "1.5rem",
          marginBottom: "0.6rem",
          fontWeight: 600,
        }}
      >
        {renderInlineFormatting(paragraph.replace("## ", ""))}
      </h3>
    );
  }
  if (paragraph.startsWith("### ")) {
    return (
      <h4 key={index} style={{ fontSize: "1.1rem", color: "#d5bd87", marginTop: "1.2rem", marginBottom: "0.5rem", fontWeight: 600 }}>
        {renderInlineFormatting(paragraph.replace("### ", ""))}
      </h4>
    );
  }
  return (
    <p key={index} style={{ marginBottom: "1.25rem", color: "rgba(247, 239, 220, 0.86)", lineHeight: 1.8 }}>
      {renderInlineFormatting(paragraph)}
    </p>
  );
}

function renderMarkdownContent(markdown: string, articleTitle?: string) {
  const blocks = markdown.split(/\n\s*\n/);
  const elements: React.ReactNode[] = [];

  blocks.forEach((block, idx) => {
    const trimmed = block.trim();
    if (!trimmed) return;

    if (
      trimmed.startsWith("> 📌") ||
      trimmed.startsWith("> 📝") ||
      trimmed.startsWith("> 🔗") ||
      trimmed.startsWith("> ⏱")
    ) {
      return;
    }

    if (trimmed.startsWith("# ")) {
      const headingText = trimmed.replace(/^#\s+/, "").trim();
      if (articleTitle && headingText.toLowerCase() === articleTitle.toLowerCase()) {
        return;
      }
      elements.push(
        <h2
          key={`h1-${idx}`}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.8rem",
            textTransform: "uppercase",
            color: "#f7efdc",
            marginTop: "1.8rem",
            marginBottom: "0.8rem",
            fontWeight: 600,
          }}
        >
          {renderInlineFormatting(headingText)}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith("## Table of Contents")) {
      const tocLines = trimmed.split("\n").filter((l) => l.trim().startsWith("- ["));
      elements.push(
        <div
          key={`toc-${idx}`}
          style={{
            margin: "2rem 0",
            padding: "1.4rem",
            background: "#080808",
            border: "1px solid rgba(191, 149, 63, 0.25)",
            borderRadius: "16px",
          }}
        >
          <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.18em", color: "#bf953f", fontWeight: 700, marginBottom: "0.8rem" }}>
            TABLE OF CONTENTS
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0.5rem" }}>
            {tocLines.map((line, lIdx) => (
              <div key={lIdx} style={{ fontSize: "0.88rem", color: "rgba(247, 239, 220, 0.8)", lineHeight: 1.5 }}>
                {renderInlineFormatting(line.replace(/^-\s+/, ""))}
              </div>
            ))}
          </div>
        </div>
      );
      return;
    }

    const lines = trimmed.split("\n").map((l) => l.trim());
    if (lines.length >= 2 && lines[0].startsWith("|") && lines[1].includes("|---")) {
      const headerCols = lines[0].split("|").map((c) => c.trim()).filter(Boolean);
      const rowLines = lines.slice(2);

      elements.push(
        <div key={`table-${idx}`} style={{ overflowX: "auto", margin: "1.8rem 0", borderRadius: "14px", border: "1px solid rgba(247, 239, 220, 0.14)" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.88rem",
              background: "#080808",
            }}
          >
            <thead>
              <tr style={{ background: "rgba(191, 149, 63, 0.14)", borderBottom: "1px solid rgba(191, 149, 63, 0.3)" }}>
                {headerCols.map((h, hIdx) => (
                  <th key={hIdx} style={{ padding: "12px 14px", textAlign: "left", color: "#f7efdc", fontWeight: 700 }}>
                    {renderInlineFormatting(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rowLines.map((rowStr, rIdx) => {
                const cells = rowStr.split("|").map((c) => c.trim()).filter(Boolean);
                return (
                  <tr
                    key={rIdx}
                    style={{
                      borderBottom: "1px solid rgba(247, 239, 220, 0.07)",
                      background: rIdx % 2 === 0 ? "rgba(247, 239, 220, 0.02)" : "transparent",
                    }}
                  >
                    {cells.map((cell, cIdx) => (
                      <td key={cIdx} style={{ padding: "11px 14px", color: "rgba(247, 239, 220, 0.85)" }}>
                        {renderInlineFormatting(cell)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
      return;
    }

    if (trimmed.startsWith("![") && trimmed.includes("](") && trimmed.endsWith(")")) {
      const imgMatch = trimmed.match(/!\[(.*?)\]\((.*?)\)/);
      if (imgMatch) {
        elements.push(
          <div key={`img-${idx}`} style={{ margin: "1.8rem 0", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(247, 239, 220, 0.14)" }}>
            <img
              src={imgMatch[2]}
              alt={imgMatch[1] || "Article visual"}
              style={{ width: "100%", maxHeight: "420px", objectFit: "cover", display: "block" }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/aura/aura-hero-clean-4k.jpg";
              }}
            />
            {imgMatch[1] && (
              <div style={{ padding: "8px 14px", background: "#080808", fontSize: "0.8rem", color: "rgba(247, 239, 220, 0.78)" }}>
                {imgMatch[1]}
              </div>
            )}
          </div>
        );
        return;
      }
    }

    if (trimmed.startsWith("> ")) {
      const quoteText = trimmed.replace(/^>\s*/gm, "");
      elements.push(
        <blockquote
          key={`quote-${idx}`}
          style={{
            margin: "1.4rem 0",
            padding: "1rem 1.4rem",
            background: "rgba(191, 149, 63, 0.08)",
            borderLeft: "3px solid #bf953f",
            borderRadius: "0 12px 12px 0",
            color: "rgba(247, 239, 220, 0.88)",
            fontSize: "0.95rem",
            fontStyle: "italic",
          }}
        >
          {renderInlineFormatting(quoteText)}
        </blockquote>
      );
      return;
    }

    if (trimmed.startsWith("## ")) {
      elements.push(
        <h3
          key={`h2-${idx}`}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.55rem",
            textTransform: "uppercase",
            color: "#f7efdc",
            marginTop: "1.6rem",
            marginBottom: "0.7rem",
            fontWeight: 600,
          }}
        >
          {renderInlineFormatting(trimmed.replace("## ", ""))}
        </h3>
      );
      return;
    }
    if (trimmed.startsWith("### ")) {
      elements.push(
        <h4 key={`h3-${idx}`} style={{ fontSize: "1.12rem", color: "#d5bd87", marginTop: "1.2rem", marginBottom: "0.5rem", fontWeight: 600 }}>
          {renderInlineFormatting(trimmed.replace("### ", ""))}
        </h4>
      );
      return;
    }

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || /^\d+\.\s/.test(trimmed)) {
      const listItems = trimmed.split("\n").map((l) => l.trim()).filter(Boolean);
      elements.push(
        <ul key={`list-${idx}`} style={{ margin: "1rem 0", paddingLeft: "1.4rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {listItems.map((li, liIdx) => (
            <li key={liIdx} style={{ color: "rgba(247, 239, 220, 0.86)", fontSize: "0.95rem", lineHeight: 1.6 }}>
              {renderInlineFormatting(li.replace(/^[-*]\s+|\d+\.\s+/, ""))}
            </li>
          ))}
        </ul>
      );
      return;
    }

    elements.push(
      <p key={`p-${idx}`} style={{ marginBottom: "1.25rem", color: "rgba(247, 239, 220, 0.86)", lineHeight: 1.8 }}>
        {renderInlineFormatting(trimmed)}
      </p>
    );
  });

  return elements;
}
