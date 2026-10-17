"use client";

import React, { useState } from "react";
import { BrandBlogPost } from "@/lib/types/blog";
import { captureLeadInCRM } from "@/lib/services/crmLeadService";

const WHATSAPP_NUMBER = "918530763405";

interface BlogArticleModalProps {
  blog: BrandBlogPost | null;
  onClose: () => void;
  onOpenEnquiry?: (projectTitle?: string) => void;
}

export default function BlogArticleModal({
  blog,
  onClose,
  onOpenEnquiry,
}: BlogArticleModalProps) {
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryNote, setInquiryNote] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
    if (!inquiryName.trim() || !inquiryPhone.trim()) return;

    setSubmitting(true);
    try {
      await captureLeadInCRM({
        name: inquiryName.trim(),
        phone: inquiryPhone.trim(),
        project: blog.relatedProject === "lifestyle-homes" ? "Lifestyle Home Spaces" : "Aura by Lifestyle",
        source: `Article Inquiry (${blog.title})`,
        notes: inquiryNote.trim() || `Inquired via blog publication: ${blog.title}`,
      });
      setSubmitted(true);
    } catch (err) {
      console.error("CRM capture error:", err);
    } finally {
      setSubmitting(false);
    }

    const msg = `Hello Lifestyle Team,\n\nI was reading your publication: *"${blog.title}"* and would like to request further details, floor plans, and pricing for this development.\n\n*Name:* ${inquiryName || "Interested Reader"}\n*WhatsApp:* ${inquiryPhone || "Not specified"}\n*Query/Note:* ${inquiryNote || "Please share brochure and schedule an appointment."}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(6, 9, 14, 0.9)",
        backdropFilter: "blur(16px)",
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
          maxWidth: "880px",
          maxHeight: "92vh",
          overflowY: "auto",
          background: "linear-gradient(135deg, #0d1017 0%, #06080c 100%)",
          border: "1px solid rgba(212, 175, 55, 0.35)",
          borderRadius: "24px",
          padding: "2.2rem",
          boxShadow: "0 25px 70px rgba(0, 0, 0, 0.85), 0 0 40px rgba(212, 175, 55, 0.15)",
          color: "#ffffff",
          position: "relative",
          margin: "auto",
          fontFamily: "var(--font-inter), sans-serif",
        }}
      >
        {/* Top Header Actions */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.6rem" }}>
            <span
              style={{
                padding: "0.3rem 0.85rem",
                borderRadius: "9999px",
                background: "linear-gradient(135deg, rgba(212, 175, 55, 0.25), rgba(192, 24, 83, 0.2))",
                border: "1px solid rgba(212, 175, 55, 0.4)",
                color: "#f5d77f",
                fontSize: "0.78rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {blog.category}
            </span>
            <span
              style={{
                padding: "0.3rem 0.75rem",
                borderRadius: "9999px",
                background: "rgba(37, 211, 102, 0.12)",
                border: "1px solid rgba(37, 211, 102, 0.35)",
                color: "#68d391",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            >
              ✓ MahaRERA Verified
            </span>
            {blog.readTime && (
              <span style={{ fontSize: "0.82rem", color: "rgba(255, 255, 255, 0.6)" }}>
                ⏱ {blog.readTime}
              </span>
            )}
            {blog.date && (
              <span style={{ fontSize: "0.82rem", color: "rgba(255, 255, 255, 0.6)" }}>
                📅 {blog.date}
              </span>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <button
              onClick={handleShare}
              type="button"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "#f5d77f",
                padding: "6px 14px",
                borderRadius: "9999px",
                fontSize: "0.8rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {isCopied ? "✓ Link Copied!" : "🔗 Share"}
            </button>
            <button
              onClick={onClose}
              type="button"
              aria-label="Close"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "#ffffff",
                fontSize: "1.1rem",
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
            fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
            fontWeight: 700,
            lineHeight: 1.25,
            color: "#ffffff",
            marginBottom: "0.8rem",
            background: "linear-gradient(135deg, #ffffff 40%, #f5d77f 80%, #e84393 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {blog.title}
        </h1>

        {/* Excerpt */}
        <p style={{ color: "#cfd3dc", fontSize: "1.05rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
          {blog.excerpt}
        </p>

        {/* Cover Image */}
        {blog.image && (
          <div
            style={{
              width: "100%",
              height: "340px",
              borderRadius: "18px",
              overflow: "hidden",
              marginBottom: "2rem",
              border: "1px solid rgba(212, 175, 55, 0.25)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
            }}
          >
            <img
              src={blog.image}
              alt={blog.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        )}

        {/* Key Highlights */}
        {blog.highlights && blog.highlights.length > 0 && (
          <div
            style={{
              padding: "1.4rem 1.6rem",
              background: "linear-gradient(135deg, rgba(212, 175, 55, 0.12), rgba(192, 24, 83, 0.08))",
              borderLeft: "4px solid #d4af37",
              borderRadius: "0 16px 16px 0",
              marginBottom: "2rem",
            }}
          >
            <h4
              style={{
                fontSize: "0.95rem",
                fontWeight: 700,
                color: "#f5d77f",
                marginBottom: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Key Architectural &amp; Investment Takeaways
            </h4>
            <ul style={{ margin: 0, paddingLeft: "1.2rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {blog.highlights.map((h, i) => (
                <li key={i} style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "0.92rem", lineHeight: 1.55 }}>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Article Body: Markdown Rendered or Formatted Paragraphs */}
        <div style={{ color: "rgba(255, 255, 255, 0.88)", fontSize: "1.02rem", lineHeight: 1.8 }}>
          {blog.markdown ? (
            renderMarkdownContent(blog.markdown)
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
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(212, 175, 55, 0.2)",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "rgba(212, 175, 55, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#d4af37",
              fontSize: "1.2rem",
              flexShrink: 0,
            }}
          >
            🏛️
          </div>
          <div>
            <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#ffffff" }}>
              Lifestyle Home Spaces Editorial &amp; Engineering Desk
            </div>
            <div style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.6)", marginTop: "2px" }}>
              Published in accordance with MahaRERA disclosures (Aura: P5030002502915 | Lifestyle: P50300054447).
            </div>
          </div>
        </div>

        {/* Direct CRM Lead Capture & WhatsApp Form */}
        <div
          style={{
            marginTop: "2rem",
            padding: "1.8rem",
            borderRadius: "20px",
            background: "linear-gradient(135deg, rgba(18, 22, 32, 0.95), rgba(10, 12, 18, 0.95))",
            border: "1px solid rgba(212, 175, 55, 0.35)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: "560px", margin: "0 auto 1.5rem" }}>
            <span
              style={{
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "#d4af37",
                fontWeight: 700,
                display: "block",
                marginBottom: "0.4rem",
              }}
            >
              Fast Inquiry &amp; Brochure Request
            </span>
            <h3 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#ffffff" }}>
              Connect with Senior Advisory Desk
            </h3>
            <p style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.65)", marginTop: "0.3rem" }}>
              Get verified floor plans, pricing signals, and schedule an on-site walkthrough with Amit Talda &amp; Rajesh Mishra.
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
                padding: "10px 16px",
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(212, 175, 55, 0.3)",
                color: "#ffffff",
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
                padding: "10px 16px",
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(212, 175, 55, 0.3)",
                color: "#ffffff",
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
                padding: "10px 16px",
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(212, 175, 55, 0.3)",
                color: "#ffffff",
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
                padding: "12px 20px",
                borderRadius: "9999px",
                background: "linear-gradient(135deg, #f5d77f 0%, #d4af37 45%, #c01853 100%)",
                color: "#070608",
                fontWeight: 800,
                fontSize: "0.95rem",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 18px rgba(192, 24, 83, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <i className="fa-brands fa-whatsapp" style={{ fontSize: "1.1rem" }} />
              <span>{submitting ? "Connecting..." : "Request Details via WhatsApp"}</span>
            </button>
            {submitted && (
              <span style={{ textAlign: "center", color: "#68d391", fontSize: "0.85rem", marginTop: "4px" }}>
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
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.8rem",
          }}
        >
          <div style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.55)" }}>
            Need direct assistance? Call <strong>+91 8530763405</strong>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "0.6rem 1.4rem",
              borderRadius: "9999px",
              background: "transparent",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              color: "#ffffff",
              fontSize: "0.88rem",
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

/** Helper to render plain paragraph */
function renderParagraph(paragraph: string, index: number) {
  if (paragraph.startsWith("# ")) {
    return (
      <h2 key={index} style={{ fontSize: "1.6rem", color: "#f5d77f", marginTop: "1.8rem", marginBottom: "0.8rem" }}>
        {paragraph.replace("# ", "")}
      </h2>
    );
  }
  if (paragraph.startsWith("## ")) {
    return (
      <h3 key={index} style={{ fontSize: "1.35rem", color: "#ffffff", marginTop: "1.5rem", marginBottom: "0.6rem" }}>
        {paragraph.replace("## ", "")}
      </h3>
    );
  }
  if (paragraph.startsWith("### ")) {
    return (
      <h4 key={index} style={{ fontSize: "1.15rem", color: "#f5d77f", marginTop: "1.2rem", marginBottom: "0.5rem" }}>
        {paragraph.replace("### ", "")}
      </h4>
    );
  }
  return (
    <p key={index} style={{ marginBottom: "1.25rem" }}>
      {paragraph}
    </p>
  );
}

/** Markdown parser that recognizes tables, blockquotes, headings, lists */
function renderMarkdownContent(markdown: string) {
  const blocks = markdown.split(/\n\s*\n/);
  const elements: React.ReactNode[] = [];

  blocks.forEach((block, idx) => {
    const trimmed = block.trim();
    if (!trimmed) return;

    // Filter out top meta header block lines
    if (
      trimmed.startsWith("> 📌") ||
      trimmed.startsWith("> 📝") ||
      trimmed.startsWith("> 🔗") ||
      trimmed.startsWith("> ⏱")
    ) {
      return;
    }

    // Markdown Table
    const lines = trimmed.split("\n").map((l) => l.trim());
    if (lines.length >= 2 && lines[0].startsWith("|") && lines[1].includes("|---")) {
      const headerCols = lines[0].split("|").map((c) => c.trim()).filter(Boolean);
      const rowLines = lines.slice(2);

      elements.push(
        <div key={`table-${idx}`} style={{ overflowX: "auto", margin: "1.5rem 0" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.88rem",
              background: "#0c0e14",
              border: "1px solid rgba(212, 175, 55, 0.3)",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <thead>
              <tr style={{ background: "rgba(212, 175, 55, 0.15)", borderBottom: "1px solid rgba(212, 175, 55, 0.3)" }}>
                {headerCols.map((h, hIdx) => (
                  <th key={hIdx} style={{ padding: "10px 14px", textAlign: "left", color: "#f5d77f", fontWeight: 700 }}>
                    {h}
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
                      borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                      background: rIdx % 2 === 0 ? "rgba(255, 255, 255, 0.02)" : "transparent",
                    }}
                  >
                    {cells.map((cell, cIdx) => (
                      <td key={cIdx} style={{ padding: "10px 14px", color: "rgba(255, 255, 255, 0.85)" }}>
                        {cell}
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

    // Blockquote
    if (trimmed.startsWith("> ")) {
      const quoteText = trimmed.replace(/^>\s*/gm, "");
      elements.push(
        <blockquote
          key={`quote-${idx}`}
          style={{
            margin: "1.4rem 0",
            padding: "1rem 1.4rem",
            background: "rgba(212, 175, 55, 0.08)",
            borderLeft: "4px solid #d4af37",
            borderRadius: "0 12px 12px 0",
            color: "#f5e6c8",
            fontSize: "0.95rem",
            fontStyle: "italic",
          }}
        >
          {quoteText}
        </blockquote>
      );
      return;
    }

    // Headings
    if (trimmed.startsWith("# ")) {
      elements.push(
        <h2 key={`h1-${idx}`} style={{ fontSize: "1.6rem", color: "#f5d77f", marginTop: "1.8rem", marginBottom: "0.8rem", fontWeight: 700 }}>
          {trimmed.replace("# ", "")}
        </h2>
      );
      return;
    }
    if (trimmed.startsWith("## ")) {
      elements.push(
        <h3 key={`h2-${idx}`} style={{ fontSize: "1.35rem", color: "#ffffff", marginTop: "1.6rem", marginBottom: "0.7rem", fontWeight: 700 }}>
          {trimmed.replace("## ", "")}
        </h3>
      );
      return;
    }
    if (trimmed.startsWith("### ")) {
      elements.push(
        <h4 key={`h3-${idx}`} style={{ fontSize: "1.15rem", color: "#f5d77f", marginTop: "1.2rem", marginBottom: "0.5rem", fontWeight: 600 }}>
          {trimmed.replace("### ", "")}
        </h4>
      );
      return;
    }

    // Lists (bullet or numbered)
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || /^\d+\.\s/.test(trimmed)) {
      const listItems = trimmed.split("\n").map((l) => l.trim()).filter(Boolean);
      elements.push(
        <ul key={`list-${idx}`} style={{ margin: "1rem 0", paddingLeft: "1.4rem", display: "flex", flexDirection: "column", gap: "0.45rem" }}>
          {listItems.map((li, liIdx) => (
            <li key={liIdx} style={{ color: "rgba(255, 255, 255, 0.88)", fontSize: "0.95rem", lineHeight: 1.55 }}>
              {li.replace(/^[-*]\s+|\d+\.\s+/, "")}
            </li>
          ))}
        </ul>
      );
      return;
    }

    // Standard Paragraph
    elements.push(
      <p key={`p-${idx}`} style={{ marginBottom: "1.25rem", color: "rgba(255, 255, 255, 0.88)" }}>
        {trimmed}
      </p>
    );
  });

  return elements;
}
