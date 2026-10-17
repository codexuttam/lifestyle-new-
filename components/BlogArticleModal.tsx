"use client";

import React from "react";
import { BrandBlogPost } from "@/lib/types/blog";

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
  if (!blog) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(6, 9, 14, 0.88)",
        backdropFilter: "blur(14px)",
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
          maxWidth: "820px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "linear-gradient(135deg, #10131a 0%, #080b10 100%)",
          border: "1px solid rgba(212, 175, 55, 0.35)",
          borderRadius: "24px",
          padding: "2.5rem",
          boxShadow: "0 25px 70px rgba(0, 0, 0, 0.8), 0 0 40px rgba(212, 175, 55, 0.12)",
          color: "#ffffff",
          position: "relative",
          margin: "auto",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close"
          style={{
            position: "sticky",
            top: 0,
            float: "right",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#ffffff",
            fontSize: "1.2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 10,
          }}
        >
          ✕
        </button>

        {/* Category & Meta */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
          <span
            style={{
              padding: "0.3rem 0.85rem",
              borderRadius: "9999px",
              background: "linear-gradient(135deg, rgba(212, 175, 55, 0.25), rgba(232, 67, 147, 0.2))",
              border: "1px solid rgba(212, 175, 55, 0.4)",
              color: "#f5d77f",
              fontSize: "0.8rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {blog.category}
          </span>
          {blog.readTime && (
            <span style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.6)" }}>
              ⏱ {blog.readTime}
            </span>
          )}
          {blog.date && (
            <span style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.6)" }}>
              📅 {blog.date}
            </span>
          )}
          {blog.isAiGenerated && (
            <span
              style={{
                padding: "0.2rem 0.6rem",
                borderRadius: "6px",
                background: "rgba(232, 67, 147, 0.2)",
                border: "1px solid rgba(232, 67, 147, 0.4)",
                color: "#ff7675",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            >
              ✦ AI Engineered Article
            </span>
          )}
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            lineHeight: 1.3,
            color: "#ffffff",
            marginBottom: "1.5rem",
          }}
        >
          {blog.title}
        </h2>

        {/* Cover Image */}
        {blog.image && (
          <div
            style={{
              width: "100%",
              height: "340px",
              borderRadius: "16px",
              overflow: "hidden",
              marginBottom: "2rem",
              border: "1px solid rgba(212, 175, 55, 0.25)",
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
              padding: "1.25rem 1.5rem",
              background: "rgba(212, 175, 55, 0.08)",
              borderLeft: "4px solid #d4af37",
              borderRadius: "0 12px 12px 0",
              marginBottom: "2rem",
            }}
          >
            <h4
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "#f5d77f",
                marginBottom: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Key Takeaways
            </h4>
            <ul style={{ margin: 0, paddingLeft: "1.2rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {blog.highlights.map((h, i) => (
                <li key={i} style={{ color: "rgba(255, 255, 255, 0.85)", fontSize: "0.92rem", lineHeight: 1.5 }}>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Article Body Content */}
        <div style={{ color: "rgba(255, 255, 255, 0.85)", fontSize: "1.05rem", lineHeight: 1.8 }}>
          {blog.content.map((paragraph, index) => {
            if (paragraph.startsWith("# ")) {
              return (
                <h3 key={index} style={{ fontSize: "1.5rem", color: "#f5d77f", marginTop: "1.8rem", marginBottom: "0.8rem" }}>
                  {paragraph.replace("# ", "")}
                </h3>
              );
            }
            if (paragraph.startsWith("## ")) {
              return (
                <h4 key={index} style={{ fontSize: "1.25rem", color: "#ffffff", marginTop: "1.5rem", marginBottom: "0.6rem" }}>
                  {paragraph.replace("## ", "")}
                </h4>
              );
            }
            if (paragraph.startsWith("### ")) {
              return (
                <h5 key={index} style={{ fontSize: "1.1rem", color: "#f5d77f", marginTop: "1.2rem", marginBottom: "0.5rem" }}>
                  {paragraph.replace("### ", "")}
                </h5>
              );
            }
            return (
              <p key={index} style={{ marginBottom: "1.25rem" }}>
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            marginTop: "2.5rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div style={{ fontSize: "0.88rem", color: "rgba(255, 255, 255, 0.6)" }}>
            Published by <strong>Lifestyle Homes Research & Advisory</strong> &middot; Amravati
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            {onOpenEnquiry && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenEnquiry(blog.relatedProject === "lifestyle-homes" ? "Lifestyle Home Spaces" : "Aura by Lifestyle");
                }}
                style={{
                  padding: "0.75rem 1.4rem",
                  borderRadius: "9999px",
                  background: "linear-gradient(135deg, #d4af37 0%, #e84393 100%)",
                  color: "#0a0a0c",
                  fontWeight: 700,
                  fontSize: "0.92rem",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Enquire About This Project
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "0.75rem 1.4rem",
                borderRadius: "9999px",
                background: "transparent",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                color: "#ffffff",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
