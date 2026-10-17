"use client";

import React, { useState, useEffect } from "react";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import BlogArticleModal from "@/components/BlogArticleModal";
import BlogGeneratorModal from "@/components/BlogGeneratorModal";
import EnquiryModal from "@/components/EnquiryModal";
import { BrandBlogPost } from "@/lib/types/blog";
import { getAllMergedBlogs, deleteStoredAiBlog } from "@/lib/services/blogGeneratorService";
import { SITE_SETTINGS } from "@/data/settings";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BrandBlogPost[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<BrandBlogPost | null>(null);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquiryProject, setEnquiryProject] = useState("Aura by Lifestyle");

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const refreshBlogs = () => {
    try {
      setBlogs(getAllMergedBlogs());
    } catch (e) {
      console.error("Error loading blogs:", e);
    }
  };

  useEffect(() => {
    refreshBlogs();
  }, []);

  const categories = [
    "All",
    "AI Generated",
    ...Array.from(new Set(blogs.map((b) => b?.category).filter(Boolean))),
  ];

  const filteredBlogs = blogs.filter((b) => {
    if (!b) return false;
    const title = b.title || "";
    const excerpt = b.excerpt || "";
    const category = b.category || "";
    const q = searchQuery.toLowerCase().trim();

    if (q) {
      const match =
        title.toLowerCase().includes(q) ||
        excerpt.toLowerCase().includes(q) ||
        category.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (activeCategory === "All") return true;
    if (activeCategory === "AI Generated") return Boolean(b.isAiGenerated);
    return category === activeCategory;
  });

  const handleDeleteAiBlog = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Delete this AI generated blog article?")) {
      deleteStoredAiBlog(id);
      refreshBlogs();
    }
  };

  return (
    <div style={{ backgroundColor: "#06090e", color: "#ffffff", minHeight: "100vh" }}>
      <SiteNav activeHref="/blogs" />

      <main style={{ paddingTop: "7.5rem", paddingBottom: "5rem", maxWidth: "1280px", margin: "0 auto", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
        
        {/* Header Hero */}
        <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 3.5rem" }}>
          <span
            style={{
              display: "inline-block",
              padding: "0.35rem 1rem",
              borderRadius: "9999px",
              background: "linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(232, 67, 147, 0.15))",
              border: "1px solid rgba(212, 175, 55, 0.35)",
              color: "#f5d77f",
              fontSize: "0.82rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "1rem",
            }}
          >
            Insights & Research
          </span>
          <h1
            style={{
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              fontWeight: 700,
              lineHeight: 1.2,
              background: "linear-gradient(135deg, #ffffff 40%, #f5d77f 80%, #e84393 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "1rem",
            }}
          >
            Real Estate Insights & Buyer Folios
          </h1>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.72)",
              fontSize: "1.05rem",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Authoritative property guides, structural engineering standards, and AI-powered market analyses for Amravati homebuyers and commercial investors.
          </p>

          {/* Action: Generate AI Article Button */}
          <div style={{ marginTop: "1.75rem" }}>
            <button
              type="button"
              onClick={() => setIsGeneratorOpen(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.85rem 1.6rem",
                borderRadius: "9999px",
                background: "linear-gradient(135deg, #d4af37 0%, #e84393 100%)",
                color: "#0a0a0c",
                fontWeight: 700,
                fontSize: "0.95rem",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(212, 175, 55, 0.3)",
                transition: "transform 0.2s ease",
              }}
            >
              <span>✦</span> Generate Article with Bitlance AI
            </button>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1.25rem",
            marginBottom: "2.5rem",
            padding: "1rem 1.25rem",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(212, 175, 55, 0.2)",
            borderRadius: "16px",
          }}
        >
          {/* Categories */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: "0.45rem 1rem",
                    borderRadius: "9999px",
                    background: isActive
                      ? "linear-gradient(135deg, rgba(212, 175, 55, 0.3), rgba(232, 67, 147, 0.2))"
                      : "transparent",
                    border: isActive
                      ? "1px solid #d4af37"
                      : "1px solid rgba(255, 255, 255, 0.12)",
                    color: isActive ? "#f5d77f" : "rgba(255, 255, 255, 0.7)",
                    fontSize: "0.85rem",
                    fontWeight: isActive ? 600 : 500,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div style={{ position: "relative", minWidth: "240px", flex: "1 1 240px", maxWidth: "340px" }}>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "0.65rem 1rem 0.65rem 2.2rem",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(212, 175, 55, 0.25)",
                borderRadius: "9999px",
                color: "#ffffff",
                fontSize: "0.88rem",
                outline: "none",
              }}
            />
            <span
              style={{
                position: "absolute",
                left: "0.9rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "rgba(255, 255, 255, 0.4)",
                fontSize: "0.85rem",
              }}
            >
              🔍
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: "0.8rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  color: "rgba(255, 255, 255, 0.5)",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Blog Cards Grid */}
        {filteredBlogs.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              background: "rgba(255, 255, 255, 0.02)",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "1.1rem", marginBottom: "1rem" }}>
              No articles found matching &quot;{searchQuery || activeCategory}&quot;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
              style={{
                padding: "0.6rem 1.4rem",
                borderRadius: "9999px",
                background: "rgba(212, 175, 55, 0.2)",
                border: "1px solid #d4af37",
                color: "#f5d77f",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: "2rem",
            }}
          >
            {filteredBlogs.map((blog) => (
              <article
                key={blog.id}
                onClick={() => setSelectedBlog(blog)}
                style={{
                  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)",
                  border: "1px solid rgba(212, 175, 55, 0.2)",
                  borderRadius: "20px",
                  overflow: "hidden",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.5)";
                  e.currentTarget.style.boxShadow = "0 16px 36px rgba(0, 0, 0, 0.5), 0 0 24px rgba(212, 175, 55, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.2)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Image */}
                <div style={{ height: "210px", width: "100%", overflow: "hidden", position: "relative" }}>
                  <img
                    src={blog.image || "/aura/aura-hero-clean-4k.jpg"}
                    alt={blog.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.4s ease",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(6, 9, 14, 0.9) 0%, transparent 60%)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "1rem",
                      left: "1rem",
                      display: "flex",
                      gap: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        padding: "0.25rem 0.75rem",
                        borderRadius: "9999px",
                        background: "rgba(6, 9, 14, 0.8)",
                        backdropFilter: "blur(6px)",
                        border: "1px solid rgba(212, 175, 55, 0.35)",
                        color: "#f5d77f",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                      }}
                    >
                      {blog.category}
                    </span>
                    {blog.isAiGenerated && (
                      <span
                        style={{
                          padding: "0.25rem 0.65rem",
                          borderRadius: "9999px",
                          background: "rgba(232, 67, 147, 0.85)",
                          backdropFilter: "blur(6px)",
                          color: "#ffffff",
                          fontSize: "0.72rem",
                          fontWeight: 600,
                        }}
                      >
                        ✦ AI Generated
                      </span>
                    )}
                  </div>

                  {blog.isAiGenerated && (
                    <button
                      type="button"
                      title="Delete local AI article"
                      onClick={(e) => handleDeleteAiBlog(e, blog.id)}
                      style={{
                        position: "absolute",
                        top: "1rem",
                        right: "1rem",
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        background: "rgba(0, 0, 0, 0.7)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        color: "#ff7675",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.85rem",
                      }}
                    >
                      🗑
                    </button>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", gap: "0.85rem", fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.5)", marginBottom: "0.75rem" }}>
                    {blog.date && <span>📅 {blog.date}</span>}
                    {blog.readTime && <span>⏱ {blog.readTime}</span>}
                  </div>

                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      lineHeight: 1.4,
                      color: "#ffffff",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {blog.title}
                  </h3>

                  <p
                    style={{
                      color: "rgba(255, 255, 255, 0.7)",
                      fontSize: "0.9rem",
                      lineHeight: 1.6,
                      marginBottom: "1.5rem",
                      flex: 1,
                    }}
                  >
                    {blog.excerpt}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingTop: "1rem",
                      borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                      color: "#f5d77f",
                      fontWeight: 600,
                      fontSize: "0.88rem",
                    }}
                  >
                    <span>Read Full Article &rarr;</span>
                    {blog.relatedProject && (
                      <span style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.45)" }}>
                        {blog.relatedProject === "aura" ? "Aura Flagship" : "Lifestyle Homes"}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <BlogArticleModal
        blog={selectedBlog}
        onClose={() => setSelectedBlog(null)}
        onOpenEnquiry={(proj) => {
          setEnquiryProject(proj || "Aura by Lifestyle");
          setIsEnquiryOpen(true);
        }}
      />

      <BlogGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onBlogGenerated={(newBlog) => {
          refreshBlogs();
          setSelectedBlog(newBlog);
        }}
      />

      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        projectTitle={enquiryProject}
      />

      <SiteFooter settings={SITE_SETTINGS} />
    </div>
  );
}
