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
    } catch (err: any) {
      setError(err?.message || "Generation failed. Please try again.");
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
        backgroundColor: "rgba(6, 9, 14, 0.88)",
        backdropFilter: "blur(12px)",
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
          background: "linear-gradient(135deg, #0a1428 0%, #050a16 100%)",
          border: "1px solid rgba(194, 26, 34, 0.4)",
          borderRadius: "20px",
          padding: "2rem",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(194, 26, 34, 0.2)",
          color: "#ffffff",
          position: "relative",
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
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            color: "#ffffff",
            fontSize: "1.2rem",
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
              padding: "0.25rem 0.75rem",
              borderRadius: "9999px",
              background: "linear-gradient(135deg, rgba(194, 26, 34, 0.25), rgba(26, 51, 92, 0.4))",
              border: "1px solid rgba(194, 26, 34, 0.4)",
              color: "#ff7675",
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "0.6rem",
            }}
          >
            ✦ Bitlance SEO AI Agent
          </span>
          <h3 style={{ fontSize: "1.45rem", fontWeight: 700, margin: 0 }}>
            Generate Real Estate Article
          </h3>
          <p style={{ color: "rgba(255, 255, 255, 0.65)", fontSize: "0.85rem", marginTop: "0.35rem" }}>
            Generate high-ranking luxury property analysis and buyer guides for Amravati.
          </p>
        </div>

        <form onSubmit={handleGenerate}>
          <div style={{ marginBottom: "1.2rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.35rem", fontWeight: 500 }}>
              Article Topic / Focus Title <span style={{ color: "#c21a22" }}>*</span>
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
                padding: "0.85rem 1rem",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.16)",
                color: "#ffffff",
                fontSize: "0.95rem",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.2rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.35rem", color: "rgba(255, 255, 255, 0.8)" }}>
              Target Keywords (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. luxury flats amravati, 3 bhk aura highrise, maharera"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.14)",
                color: "#ffffff",
                fontSize: "0.95rem",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.4rem", color: "rgba(255, 255, 255, 0.8)" }}>
              Optimization Mode
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={() => setMode("SEO")}
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  background: mode === "SEO" ? "rgba(194, 26, 34, 0.2)" : "rgba(255, 255, 255, 0.04)",
                  border: mode === "SEO" ? "1px solid #c21a22" : "1px solid rgba(255, 255, 255, 0.1)",
                  color: mode === "SEO" ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  cursor: "pointer",
                }}
              >
                Google SEO
              </button>
              <button
                type="button"
                onClick={() => setMode("GEO")}
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  background: mode === "GEO" ? "rgba(194, 26, 34, 0.3)" : "rgba(255, 255, 255, 0.04)",
                  border: mode === "GEO" ? "1px solid #c21a22" : "1px solid rgba(255, 255, 255, 0.1)",
                  color: mode === "GEO" ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                  fontWeight: 600,
                  fontSize: "0.88rem",
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
                background: "rgba(194, 26, 34, 0.15)",
                border: "1px solid rgba(194, 26, 34, 0.4)",
                borderRadius: "8px",
                color: "#ff7675",
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
              padding: "0.95rem 1.5rem",
              borderRadius: "9999px",
              background: "var(--color-wine, #c21a22)",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "0.98rem",
              border: "none",
              cursor: isGenerating ? "not-allowed" : "pointer",
              boxShadow: "0 8px 24px rgba(194, 26, 34, 0.35)",
              opacity: isGenerating ? 0.7 : 1,
            }}
          >
            {isGenerating ? "Bitlance AI Synthesizing Article..." : "Generate & Publish Article"}
          </button>
        </form>
      </div>
    </div>
  );
}
