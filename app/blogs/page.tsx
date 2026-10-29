"use client";

import React, { useState, useEffect } from "react";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import RevealAnimations from "@/components/RevealAnimations";
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
    <div style={{ backgroundColor: "#080808", color: "#f7efdc", minHeight: "100vh", fontFamily: "var(--font-sans)" }}>
      <RevealAnimations />
      <SiteNav activeHref="/blogs" />

      <main style={{ paddingTop: "8.5rem", paddingBottom: "6rem", maxWidth: "1400px", margin: "0 auto", paddingLeft: "2.5rem", paddingRight: "2.5rem" }}>
        {/* Header Hero Section */}
        <div style={{ maxWidth: "880px", marginBottom: "2.8rem" }} data-reveal>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.8rem, 5.2vw, 4.9rem)",
              fontWeight: 600,
              lineHeight: 0.94,
              textTransform: "uppercase",
              color: "#f7efdc",
              marginBottom: "1rem",
              letterSpacing: "-0.015em",
            }}
          >
            LIFESTYLE ARTICLES &amp; <span style={{ color: "#bf953f" }}>BUYER FOLIOS</span>
          </h1>
          <p
            style={{
              color: "rgba(247, 239, 220, 0.72)",
              fontSize: "15.5px",
              lineHeight: 1.7,
              margin: 0,
              maxWidth: "68ch",
            }}
          >
            Official market analysis, architectural benchmarks, and intelligent property guides for homebuyers and commercial investors across Amravati and Vidarbha.
          </p>

          {/* Action Row: Admin Only vs Normal Visitor Mode */}
          {isAdmin ? (
            <div
              style={{
                marginTop: "1.8rem",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "1.1rem",
              }}
            >
              <button
                type="button"
                onClick={() => setIsGeneratorOpen(true)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.55rem",
                  padding: "13px 24px",
                  borderRadius: "9999px",
                  background: "#bf953f",
                  color: "#080808",
                  fontWeight: 700,
                  fontSize: "11px",
                  border: "1px solid #d4af37",
                  cursor: "pointer",
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                }}
              >
                <span>✦</span> Generate Article with Bitlance AI
              </button>

              <div
                style={{
                  textAlign: "left",
                  fontSize: "11.5px",
                  borderLeft: "2px solid rgba(191, 149, 63, 0.45)",
                  paddingLeft: "0.9rem",
                  color: "rgba(247, 239, 220, 0.75)",
                }}
              >
                <div style={{ color: "#f7efdc", fontWeight: 600 }}>Administrator Session Active</div>
                <div style={{ color: "#d5bd87" }}>Bitlance SEO &amp; GEO Generator Unlocked</div>
              </div>

              <button
                type="button"
                onClick={handleAdminLogout}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(247, 239, 220, 0.22)",
                  color: "rgba(247, 239, 220, 0.75)",
                  padding: "8px 16px",
                  borderRadius: "9999px",
                  fontSize: "11px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Exit Admin Mode
              </button>
            </div>
          ) : (
            <div style={{ marginTop: "1rem" }}>
              <button
                type="button"
                onClick={() => setShowAdminModal(true)}
                title="Admin Authentication"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "rgba(247, 239, 220, 0.42)",
                  cursor: "pointer",
                  fontSize: "11px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "4px 0",
                }}
              >
                Admin Sign In →
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
            padding: "12px 16px",
            background: "#101210",
            border: "1px solid rgba(247, 239, 220, 0.12)",
            borderRadius: "20px",
          }}
        >
          {/* Categories */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: "9px 16px",
                    borderRadius: "9999px",
                    background: isActive ? "#bf953f" : "transparent",
                    border: isActive
                      ? "1px solid #d4af37"
                      : "1px solid rgba(247, 239, 220, 0.14)",
                    color: isActive ? "#080808" : "rgba(247, 239, 220, 0.72)",
                    fontSize: "11px",
                    fontWeight: isActive ? 700 : 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
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
                padding: "10px 34px 10px 16px",
                background: "#080808",
                border: "1px solid rgba(247, 239, 220, 0.16)",
                borderRadius: "9999px",
                color: "#f7efdc",
                fontSize: "13px",
                outline: "none",
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  color: "rgba(247, 239, 220, 0.6)",
                  cursor: "pointer",
                  fontSize: "13px",
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
              background: "#101210",
              borderRadius: "22px",
              border: "1px solid rgba(247, 239, 220, 0.1)",
            }}
          >
            <p style={{ color: "rgba(247, 239, 220, 0.65)", fontSize: "1rem", marginBottom: "1.2rem" }}>
              No articles found matching &quot;{searchQuery || activeCategory}&quot;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
              style={{
                padding: "11px 22px",
                borderRadius: "9999px",
                background: "#bf953f",
                border: "1px solid #d4af37",
                color: "#080808",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            data-reveal-group
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: "24px",
            }}
          >
            {filteredBlogs.map((blog) => (
              <article
                key={blog.id}
                onClick={() => setSelectedBlog(blog)}
                style={{
                  background: "#101210",
                  border: "1px solid rgba(247, 239, 220, 0.12)",
                  borderRadius: "24px",
                  overflow: "hidden",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
                  position: "relative",
                  boxShadow: "0 18px 44px rgba(0, 0, 0, 0.55)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.borderColor = "rgba(191, 149, 63, 0.55)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(247, 239, 220, 0.12)";
                }}
              >
                <div style={{ height: "230px", width: "100%", overflow: "hidden", position: "relative", background: "#080808" }}>
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
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(8, 8, 8, 0.92) 0%, rgba(8, 8, 8, 0.15) 60%, transparent 100%)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "14px",
                      left: "14px",
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        padding: "5px 12px",
                        borderRadius: "9999px",
                        background: "rgba(8, 8, 8, 0.82)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(191, 149, 63, 0.42)",
                        color: "#f7efdc",
                        fontSize: "10px",
                        fontWeight: 600,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                      }}
                    >
                      {blog.category}
                    </span>
                    {blog.isAiGenerated && (
                      <span
                        style={{
                          padding: "5px 11px",
                          borderRadius: "9999px",
                          background: "#bf953f",
                          color: "#080808",
                          fontSize: "10px",
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                        }}
                      >
                        ✦ AI Folio
                      </span>
                    )}
                  </div>

                  {isAdmin && blog.isAiGenerated && (
                    <button
                      type="button"
                      title="Delete AI article (Admin)"
                      onClick={(e) => handleDeleteAiBlog(e, blog.id)}
                      style={{
                        position: "absolute",
                        top: "14px",
                        right: "14px",
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: "rgba(8, 8, 8, 0.85)",
                        border: "1px solid rgba(247, 239, 220, 0.3)",
                        color: "#f7efdc",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", gap: "12px", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#d5bd87", marginBottom: "10px" }}>
                    {blog.date && <span>{blog.date}</span>}
                    {blog.readTime && <span>· {blog.readTime}</span>}
                  </div>

                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.6rem",
                      fontWeight: 600,
                      lineHeight: 1.04,
                      textTransform: "uppercase",
                      color: "#f7efdc",
                      marginBottom: "10px",
                    }}
                  >
                    {blog.title}
                  </h3>

                  <p
                    style={{
                      color: "rgba(247, 239, 220, 0.7)",
                      fontSize: "13.5px",
                      lineHeight: 1.65,
                      marginBottom: "20px",
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
                      paddingTop: "14px",
                      borderTop: "1px solid rgba(247, 239, 220, 0.09)",
                      color: "#bf953f",
                      fontWeight: 600,
                      fontSize: "11px",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                    }}
                  >
                    <span>Read Full Article →</span>
                    {blog.relatedProject && (
                      <span style={{ fontSize: "10.5px", color: "rgba(247, 239, 220, 0.45)" }}>
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
            backgroundColor: "rgba(5, 5, 5, 0.9)",
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
              background: "#101210",
              border: "1px solid rgba(191, 149, 63, 0.4)",
              borderRadius: "24px",
              padding: "2rem",
              boxShadow: "0 28px 70px rgba(0, 0, 0, 0.85)",
              color: "#f7efdc",
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
                background: "#080808",
                border: "1px solid rgba(247, 239, 220, 0.18)",
                color: "#f7efdc",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>

            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  borderRadius: "9999px",
                  border: "1px solid rgba(191, 149, 63, 0.4)",
                  color: "#d5bd87",
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: "10px",
                }}
              >
                EXECUTIVE ACCESS
              </span>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.8rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  color: "#f7efdc",
                  marginBottom: "0.4rem",
                }}
              >
                ADMINISTRATOR PASSCODE
              </h3>
              <p style={{ fontSize: "13px", color: "rgba(247, 239, 220, 0.65)", margin: 0 }}>
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
                    background: "#080808",
                    border: adminPasscodeError
                      ? "1px solid #d5bd87"
                      : "1px solid rgba(247, 239, 220, 0.18)",
                    color: "#f7efdc",
                    fontSize: "0.95rem",
                    outline: "none",
                  }}
                />
                {adminPasscodeError && (
                  <div style={{ color: "#d5bd87", fontSize: "0.8rem", marginTop: "0.4rem" }}>
                    {adminPasscodeError}
                  </div>
                )}
              </div>

              <button
                type="submit"
                style={{
                  padding: "13px 22px",
                  borderRadius: "9999px",
                  background: "#bf953f",
                  color: "#080808",
                  fontWeight: 700,
                  fontSize: "11px",
                  border: "1px solid #d4af37",
                  cursor: "pointer",
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                }}
              >
                Unlock Administrator Access →
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
