"use client";

import React, { useState } from "react";
import { BrandBlogPost } from "@/lib/types/blog";
import { generateBlogWithBitlance } from "@/lib/services/blogGeneratorService";

interface BlogGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBlogGenerated: (blog: BrandBlogPost) => void;
}

export default function BlogGeneratorModal({
  isOpen,
  onClose,
  onBlogGenerated,
}: BlogGeneratorModalProps) {
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [mode, setMode] = useState<"SEO" | "GEO">("SEO");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim()) {
      setError("Please specify an article topic or focus keyword.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const generated = await generateBlogWithBitlance({
        topic: topic.trim(),
        keywords: keywords.trim() || undefined,
        mode,
        companyName: "Lifestyle Homes",
      });

      setIsGenerating(false);
      onBlogGenerated(generated);
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Generation failed. Please try again.";
      setError(message);
      setIsGenerating(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(5, 5, 5, 0.9)",
        backdropFilter: "blur(14px)",
        padding: "1rem",
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
          maxWidth: "480px",
          background: "#101210",
          border: "1px solid rgba(191, 149, 63, 0.38)",
          borderRadius: "24px",
          padding: "2rem",
          boxShadow: "0 28px 68px rgba(0, 0, 0, 0.8)",
          color: "#f7efdc",
          position: "relative",
          fontFamily: "var(--font-sans)",
        }}
      >
        <button
          onClick={onClose}
          type="button"
          aria-label="Close"
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "#080808",
            border: "1px solid rgba(247, 239, 220, 0.18)",
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

        <div style={{ marginBottom: "1.5rem" }}>
          <span
            style={{
              display: "inline-block",
              padding: "5px 12px",
              borderRadius: "9999px",
              background: "rgba(191, 149, 63, 0.1)",
              border: "1px solid rgba(191, 149, 63, 0.38)",
              color: "#d5bd87",
              fontSize: "10px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              marginBottom: "0.6rem",
            }}
          >
            ✦ BITLANCE SEO AI AGENT
          </span>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.85rem",
              fontWeight: 600,
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            GENERATE REAL ESTATE ARTICLE
          </h3>
          <p style={{ color: "rgba(247, 239, 220, 0.65)", fontSize: "13px", marginTop: "0.35rem" }}>
            Generate luxury property analysis and buyer guides for Amravati.
          </p>
        </div>

        <form onSubmit={handleGenerate}>
          <div style={{ marginBottom: "1.2rem" }}>
            <label style={{ display: "block", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.4rem", color: "#d5bd87", fontWeight: 600 }}>
              Article Topic / Focus Title *
            </label>
            <input
              type="text"
              placeholder="e.g. 5 Reasons to Invest in Congress Nagar Amravati"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
              autoFocus
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "12px",
                background: "#080808",
                border: "1px solid rgba(247, 239, 220, 0.16)",
                color: "#f7efdc",
                fontSize: "0.92rem",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.2rem" }}>
            <label style={{ display: "block", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.4rem", color: "rgba(247, 239, 220, 0.72)", fontWeight: 600 }}>
              Target Keywords (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. luxury flats amravati, 3 bhk aura highrise, maharera"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "12px",
                background: "#080808",
                border: "1px solid rgba(247, 239, 220, 0.14)",
                color: "#f7efdc",
                fontSize: "0.92rem",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.45rem", color: "rgba(247, 239, 220, 0.72)", fontWeight: 600 }}>
              Optimization Mode
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={() => setMode("SEO")}
                style={{
                  padding: "10px 14px",
                  borderRadius: "12px",
                  background: mode === "SEO" ? "rgba(191, 149, 63, 0.16)" : "#080808",
                  border: mode === "SEO" ? "1px solid #bf953f" : "1px solid rgba(247, 239, 220, 0.14)",
                  color: mode === "SEO" ? "#f7efdc" : "rgba(247, 239, 220, 0.65)",
                  fontWeight: 600,
                  fontSize: "11.5px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Google SEO
              </button>
              <button
                type="button"
                onClick={() => setMode("GEO")}
                style={{
                  padding: "10px 14px",
                  borderRadius: "12px",
                  background: mode === "GEO" ? "rgba(191, 149, 63, 0.16)" : "#080808",
                  border: mode === "GEO" ? "1px solid #bf953f" : "1px solid rgba(247, 239, 220, 0.14)",
                  color: mode === "GEO" ? "#f7efdc" : "rgba(247, 239, 220, 0.65)",
                  fontWeight: 600,
                  fontSize: "11.5px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                AI Search (GEO)
              </button>
            </div>
          </div>

          {error && (
            <div
              style={{
                marginBottom: "1rem",
                padding: "0.65rem 0.9rem",
                background: "rgba(191, 149, 63, 0.12)",
                border: "1px solid rgba(191, 149, 63, 0.36)",
                borderRadius: "10px",
                color: "#d5bd87",
                fontSize: "0.85rem",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isGenerating}
            style={{
              width: "100%",
              padding: "13px 22px",
              borderRadius: "9999px",
              background: "#bf953f",
              color: "#080808",
              fontWeight: 700,
              fontSize: "11px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              border: "1px solid #d4af37",
              cursor: isGenerating ? "not-allowed" : "pointer",
              opacity: isGenerating ? 0.7 : 1,
            }}
          >
            {isGenerating ? "Bitlance AI Synthesizing Article..." : "Generate & Publish Article →"}
          </button>
        </form>
      </div>
    </div>
  );
}
