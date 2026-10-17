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

interface VerifiedUser {
  phone?: string;
  name?: string;
  email?: string;
  verified?: boolean;
  isAdmin?: boolean;
}

const DEFAULT_ADMIN_PASSCODE = "lifestyle@admin2026";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BrandBlogPost[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<BrandBlogPost | null>(null);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquiryProject, setEnquiryProject] = useState("Aura by Lifestyle");

  const [currentUser, setCurrentUser] = useState<VerifiedUser | null>(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPasscodeInput, setAdminPasscodeInput] = useState("");
  const [adminPasscodeError, setAdminPasscodeError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const refreshBlogs = () => {
    try {
      setBlogs(getAllMergedBlogs());
    } catch (e) {
      console.error("Error loading blogs:", e);
    }
  };

  const loadAuthUser = () => {
    try {
      const saved = localStorage.getItem("lifestyle_verified_user");
      if (saved) {
        const parsed = JSON.parse(saved);
        setCurrentUser(parsed);
      } else {
        setCurrentUser(null);
      }
    } catch {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    refreshBlogs();
    loadAuthUser();

    const handleAuthChange = (e: Event) => {
      const custom = e as CustomEvent<VerifiedUser>;
      if (custom.detail) {
        setCurrentUser(custom.detail);
      } else {
        loadAuthUser();
      }
    };

    window.addEventListener("lifestyle_auth_changed", handleAuthChange);
    return () => window.removeEventListener("lifestyle_auth_changed", handleAuthChange);
  }, []);

  const isAdmin = Boolean(currentUser?.isAdmin);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const expected = (
      process.env.VITE_ADMIN_PASSCODE ||
      process.env.NEXT_PUBLIC_ADMIN_PASSCODE ||
      DEFAULT_ADMIN_PASSCODE
    ).trim();

    if (adminPasscodeInput.trim() === expected) {
      const adminUser: VerifiedUser = {
        name: "Lifestyle Administrator",
        email: "admin@lifestylehomespaces.com",
        phone: "7498256708",
        verified: true,
        isAdmin: true,
      };
      try {
        localStorage.setItem("lifestyle_verified_user", JSON.stringify(adminUser));
        window.dispatchEvent(new CustomEvent("lifestyle_auth_changed", { detail: adminUser }));
      } catch {}
      setCurrentUser(adminUser);
      setShowAdminModal(false);
      setAdminPasscodeInput("");
      setAdminPasscodeError("");
    } else {
      setAdminPasscodeError("Invalid Admin Passcode. Please verify and try again.");
    }
  };

  const handleAdminLogout = () => {
    try {
      localStorage.removeItem("lifestyle_verified_user");
      window.dispatchEvent(new CustomEvent("lifestyle_auth_changed", { detail: null }));
    } catch {}
    setCurrentUser(null);
  };

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
    if (!isAdmin) return;
    if (window.confirm("Delete this AI generated blog article from public listing?")) {
      deleteStoredAiBlog(id);
      refreshBlogs();
    }
  };

  return (
    <div style={{ backgroundColor: "#06090e", color: "#ffffff", minHeight: "100vh" }}>
      <SiteNav activeHref="/blogs" />

      <main style={{ paddingTop: "7.5rem", paddingBottom: "5rem", maxWidth: "1280px", margin: "0 auto", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
        
        {/* Header Hero Section */}
        <div style={{ textAlign: "center", maxWidth: "860px", margin: "0 auto 3.5rem" }}>
          <span
            style={{
              display: "inline-block",
              padding: "0.35rem 1.1rem",
              borderRadius: "9999px",
              background: "linear-gradient(135deg, rgba(212, 175, 55, 0.25), rgba(232, 67, 147, 0.18))",
              border: "1px solid rgba(212, 175, 55, 0.4)",
              color: "#f5d77f",
              fontSize: "0.82rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "1.2px",
              marginBottom: "1rem",
            }}
          >
            Insights &amp; Research · 2026 Buyer Folios
          </span>
          <h1
            style={{
              fontSize: "clamp(2.1rem, 4.5vw, 3.4rem)",
              fontWeight: 800,
              lineHeight: 1.2,
              background: "linear-gradient(135deg, #ffffff 40%, #f5d77f 80%, #e84393 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "1.1rem",
              letterSpacing: "-0.02em",
            }}
          >
            Lifestyle Articles &amp; Buyer Folios
          </h1>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.78)",
              fontSize: "1.05rem",
              lineHeight: 1.7,
              margin: "0 auto",
              maxWidth: "720px",
            }}
          >
            Official market analysis, architectural benchmarks, and intelligent property guides for homebuyers and commercial investors across Amravati and Vidarbha.
          </p>

          {/* Action Row: Admin Only vs Normal Visitor Mode */}
          {isAdmin ? (
            <div
              style={{
                marginTop: "2rem",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                gap: "1.2rem",
              }}
            >
              <button
                type="button"
                onClick={() => setIsGeneratorOpen(true)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.65rem",
                  padding: "0.9rem 1.8rem",
                  borderRadius: "9999px",
                  background: "linear-gradient(135deg, #d4af37 0%, #f5d77f 50%, #e84393 100%)",
                  color: "#0a0a0c",
                  fontWeight: 800,
                  fontSize: "0.92rem",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 8px 24px rgba(212, 175, 55, 0.35)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                <span>✦</span> Generate Article with Bitlance AI
              </button>

              <div
                style={{
                  textAlign: "left",
                  fontSize: "0.78rem",
                  fontFamily: "monospace",
                  borderLeft: "2px solid rgba(212, 175, 55, 0.35)",
                  paddingLeft: "1rem",
                  color: "rgba(255, 255, 255, 0.75)",
                }}
              >
                <div style={{ color: "#ffffff", fontWeight: 700 }}>Administrator Session Active</div>
                <div style={{ color: "#d4af37" }}>Bitlance SEO &amp; GEO Generator Unlocked</div>
              </div>

              <button
                type="button"
                onClick={handleAdminLogout}
                style={{
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "rgba(255, 255, 255, 0.7)",
                  padding: "0.5rem 1rem",
                  borderRadius: "9999px",
                  fontSize: "0.78rem",
                  cursor: "pointer",
                }}
              >
                Exit Admin Mode
              </button>
            </div>
          ) : (
            <div
              style={{
                marginTop: "1.75rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "1rem",
                background: "rgba(255, 255, 255, 0.03)",
                padding: "0.5rem 1.2rem",
                borderRadius: "9999px",
                border: "1px solid rgba(212, 175, 55, 0.2)",
              }}
            >
              <span
                style={{
                  fontSize: "0.82rem",
                  color: "#cfd3dc",
                  fontFamily: "monospace",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#d4af37",
                    boxShadow: "0 0 8px #d4af37",
                  }}
                />
                Official Lifestyle Home Spaces Publications · MahaRERA Verified
              </span>

              <button
                type="button"
                onClick={() => setShowAdminModal(true)}
                title="Admin Authentication"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "rgba(255, 255, 255, 0.4)",
                  cursor: "pointer",
                  fontSize: "0.78rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "2px 6px",
                  borderRadius: "4px",
                }}
              >
                <span>🔒</span> Admin
              </button>
            </div>
          )}
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
                  border: "1px solid rgba(212, 175, 55, 0.22)",
                  borderRadius: "20px",
                  overflow: "hidden",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
                  position: "relative",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.6)";
                  e.currentTarget.style.boxShadow = "0 16px 36px rgba(0, 0, 0, 0.5), 0 0 24px rgba(212, 175, 55, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.22)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.4)";
                }}
              >
                {/* Image Header with Guaranteed Fallback */}
                <div style={{ height: "220px", width: "100%", overflow: "hidden", position: "relative", background: "#11141c" }}>
                  <img
                    src={blog.image || "/aura/aura-hero-clean-4k.jpg"}
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
                      transition: "transform 0.4s ease",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(6, 9, 14, 0.95) 0%, rgba(6, 9, 14, 0.1) 60%, transparent 100%)",
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
                        background: "rgba(6, 9, 14, 0.85)",
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

                  {/* Admin Only Delete Action */}
                  {isAdmin && blog.isAiGenerated && (
                    <button
                      type="button"
                      title="Delete AI article (Admin)"
                      onClick={(e) => handleDeleteAiBlog(e, blog.id)}
                      style={{
                        position: "absolute",
                        top: "1rem",
                        right: "1rem",
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: "rgba(0, 0, 0, 0.75)",
                        border: "1px solid rgba(255, 118, 117, 0.5)",
                        color: "#ff7675",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.9rem",
                      }}
                    >
                      🗑
                    </button>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", gap: "0.85rem", fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.55)", marginBottom: "0.75rem" }}>
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
                      color: "rgba(255, 255, 255, 0.72)",
                      fontSize: "0.92rem",
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

      {/* Admin Passcode Modal */}
      {showAdminModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(6, 9, 14, 0.9)",
            backdropFilter: "blur(16px)",
            padding: "1rem",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAdminModal(false);
              setAdminPasscodeError("");
            }
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "440px",
              background: "linear-gradient(135deg, #12141e 0%, #080a0e 100%)",
              border: "1px solid rgba(212, 175, 55, 0.4)",
              borderRadius: "20px",
              padding: "2rem",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(212, 175, 55, 0.2)",
              color: "#ffffff",
              position: "relative",
            }}
          >
            <button
              onClick={() => {
                setShowAdminModal(false);
                setAdminPasscodeError("");
              }}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#ffffff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>

            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  background: "rgba(212, 175, 55, 0.15)",
                  border: "1px solid rgba(212, 175, 55, 0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.4rem",
                  margin: "0 auto 0.8rem",
                  color: "#d4af37",
                }}
              >
                🔐
              </div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.4rem" }}>
                Administrator Passcode
              </h3>
              <p style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.65)", margin: 0 }}>
                Enter your executive master passcode to unlock the Bitlance AI Blog Generator.
              </p>
            </div>

            <form onSubmit={handleAdminLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <input
                  type="password"
                  required
                  autoFocus
                  value={adminPasscodeInput}
                  onChange={(e) => {
                    setAdminPasscodeInput(e.target.value);
                    setAdminPasscodeError("");
                  }}
                  placeholder="Enter Admin Passcode"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    background: "rgba(255, 255, 255, 0.06)",
                    border: adminPasscodeError ? "1px solid #ff7675" : "1px solid rgba(212, 175, 55, 0.35)",
                    color: "#ffffff",
                    fontSize: "0.95rem",
                    outline: "none",
                    letterSpacing: "1px",
                  }}
                />
                {adminPasscodeError && (
                  <div style={{ color: "#ff7675", fontSize: "0.8rem", marginTop: "0.4rem" }}>
                    {adminPasscodeError}
                  </div>
                )}
              </div>

              <button
                type="submit"
                style={{
                  padding: "12px 20px",
                  borderRadius: "9999px",
                  background: "linear-gradient(135deg, #f5d77f 0%, #d4af37 50%, #c01853 100%)",
                  color: "#080a0e",
                  fontWeight: 800,
                  fontSize: "0.92rem",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 18px rgba(192, 24, 83, 0.35)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Unlock Administrator Access
              </button>
            </form>
          </div>
        </div>
      )}

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
