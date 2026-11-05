"use client";

import React, { useState, useEffect, useRef } from "react";
import { VerifiedUser } from "@/lib/types/auth";
import { normalizePhone } from "@/lib/services/crmLeadService";
import { markLeadSubmitted, submitLead, trackMetaLead } from "@/lib/leads/submitLead";

interface AuthOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: VerifiedUser) => void;
}

export default function AuthOtpModal({
  isOpen,
  onClose,
  onSuccess,
}: AuthOtpModalProps) {
  const [step, setStep] = useState<"phone" | "otp" | "name" | "success">("phone");
  const [phone, setPhone] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState("");

  const OTP_VALIDITY_SECONDS = 60; // 1 minute in sync with resend cooldown

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpTimer, setOtpTimer] = useState(OTP_VALIDITY_SECONDS);
  const [verifiedUser, setVerifiedUser] = useState<VerifiedUser | null>(null);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      setStep("phone");
      setError(null);
      setEnteredOtp("");
      setIsAdminMode(false);
      setAdminPasscode("");
      try {
        const saved = localStorage.getItem("lifestyle_verified_user");
        if (saved) {
          const user = JSON.parse(saved);
          if (user.phone) setPhone(user.phone.replace(/\D/g, "").slice(-10));
          if (user.name && user.name.toLowerCase() !== "lifestyle resident") setName(user.name);
          if (user.email) setEmail(user.email);
        }
      } catch {}
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "otp" && otpTimer > 0) {
      timer = setInterval(() => setOtpTimer((prev) => Math.max(prev - 1, 0)), 1000);
    }
    return () => clearInterval(timer);
  }, [step, otpTimer]);

  if (!isOpen) return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  async function handleSendOtp(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const cleanDigits = phone.replace(/\D/g, "");
    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (cleanDigits.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanDigits }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Failed to send WhatsApp OTP. Please try again.");
        setIsLoading(false);
        return;
      }

      setStep("otp");
      setIsLoading(false);
      setOtpTimer(OTP_VALIDITY_SECONDS);
    } catch {
      setError("Network error. Please try again.");
      setIsLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmittingRef.current) return;
    if (otpTimer <= 0) {
      setError("This verification code has expired. Please tap 'Resend OTP' to receive a new code.");
      return;
    }
    if (!enteredOtp || enteredOtp.trim().length < 4) {
      setError("Please enter the 6-digit OTP received on WhatsApp.");
      return;
    }

    isSubmittingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone.replace(/\D/g, ""),
          otp: enteredOtp.trim(),
          name: name.trim() || undefined,
          email: email.trim() || undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data?.ok === false) {
        setError(data?.error || "Invalid OTP code. Please check your WhatsApp.");
        return;
      }

      const user: VerifiedUser = data.user;
      setVerifiedUser(user);

      if (!name.trim()) {
        setStep("name");
      } else {
        // Fire Meta "Lead" only if the server confirms the CRM saved this sign-in lead.
        if (data?.crmSaved === true) {
          trackMetaLead();
          markLeadSubmitted();
        }
        finishLogin(user);
      }
    } catch {
      setError("Verification failed. Please check your connection.");
    } finally {
      isSubmittingRef.current = false;
      setIsLoading(false);
    }
  }

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmittingRef.current) return;
    if (!verifiedUser) return;
    const finalName = name.trim();
    if (!finalName) return;

    isSubmittingRef.current = true;
    setIsLoading(true);
    try {
      // submitLead fires Meta "Lead" only after the CRM confirms the save.
      const result = await submitLead({
        name: finalName,
        phone: verifiedUser.phone,
        email: email.trim() || undefined,
        project: "Aura by Lifestyle",
        source: "Profile Name Update",
      });
      if (!result.ok) {
        console.warn("Could not sync name to CRM:", result.error);
      }
    } finally {
      isSubmittingRef.current = false;
      setIsLoading(false);
    }

    const updated: VerifiedUser = {
      ...verifiedUser,
      name: finalName,
      email: email.trim() || undefined,
    };
    finishLogin(updated);
  }

  function handleAdminPasscodeLogin(e: React.FormEvent) {
    e.preventDefault();
    const correctPasscode = (process.env.VITE_ADMIN_PASSCODE || "lifestyle@admin2026").trim();
    if (adminPasscode.trim() !== correctPasscode) {
      setError("Incorrect Admin Passcode.");
      return;
    }

    const adminUser: VerifiedUser = {
      phone: normalizePhone(phone || "7498256708"),
      name: name.trim() || "Lifestyle Administrator",
      email: email.trim() || "admin@lifestylehomespaces.com",
      verified: true,
      verifiedAt: new Date().toISOString(),
      isAdmin: true,
    };

    finishLogin(adminUser);
  }

  function finishLogin(user: VerifiedUser) {
    try {
      localStorage.setItem("lifestyle_verified_user", JSON.stringify(user));
      window.dispatchEvent(new CustomEvent("lifestyle_auth_changed", { detail: user }));
    } catch {}

    setStep("success");
    if (onSuccess) onSuccess(user);
    setTimeout(() => {
      onClose();
    }, 4500);
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100005,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(4, 6, 10, 0.78)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        padding: "1rem",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <style>{`
        @keyframes lotliteModalIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(24px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @media (max-width: 680px) {
          .auth-modal-left-panel {
            display: none !important;
          }
          .auth-modal-right-panel {
            padding: 1.75rem 1.25rem !important;
          }
        }
      `}</style>

      {/* Luxury Modal Card: Split Layout on Desktop, Fluid on Mobile */}
      <div
        style={{
          width: "100%",
          maxWidth: "760px",
          background: "linear-gradient(145deg, #1f1209 0%, #130a04 100%)",
          border: "1px solid rgba(197, 168, 128, 0.28)",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(197, 168, 128, 0.12)",
          color: "#F8F5F3",
          position: "relative",
          animation: "lotliteModalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          display: "flex",
          flexDirection: "row",
          maxHeight: "90vh",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close dialog"
          title="Close (Esc)"
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "rgba(197, 168, 128, 0.08)",
            border: "1px solid rgba(197, 168, 128, 0.22)",
            color: "#D9C7A5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 30,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#c5a880";
            e.currentTarget.style.borderColor = "#c5a880";
            e.currentTarget.style.color = "#201005";
            e.currentTarget.style.transform = "rotate(90deg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(197, 168, 128, 0.08)";
            e.currentTarget.style.borderColor = "rgba(197, 168, 128, 0.22)";
            e.currentTarget.style.color = "#D9C7A5";
            e.currentTarget.style.transform = "rotate(0deg)";
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* LEFT SHOWCASE PANEL */}
        <div
          style={{
            width: "38%",
            position: "relative",
            background: "url('/aura/aura-hero-clean-4k.jpg') center/cover no-repeat, #140a04",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "2rem",
            overflow: "hidden",
            flexShrink: 0,
          }}
          className="auth-modal-left-panel"
        >
          {/* Warm Dark Gradient Overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(32, 16, 5, 0.35) 0%, rgba(19, 10, 4, 0.95) 100%)",
              zIndex: 1,
            }}
          />

          {/* Ambient Warm Glow */}
          <div
            style={{
              position: "absolute",
              top: "-20px",
              right: "-20px",
              width: "160px",
              height: "160px",
              borderRadius: "50%",
              background: "rgba(197, 168, 128, 0.25)",
              filter: "blur(40px)",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />

          <div style={{ position: "relative", zIndex: 10 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "3px 10px",
                borderRadius: "9999px",
                background: "rgba(197, 168, 128, 0.16)",
                border: "1px solid rgba(197, 168, 128, 0.35)",
                color: "#C5A880",
                fontSize: "8.5px",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: "0.6rem",
                fontFamily: "var(--font-montserrat), sans-serif",
              }}
            >
              Aura Residences
            </span>
            <h3
              style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
                fontSize: "1.3rem",
                fontWeight: 700,
                color: "#F8F5F3",
                lineHeight: 1.25,
                marginBottom: "0.4rem",
                textShadow: "0 2px 8px rgba(0,0,0,0.8)",
              }}
            >
              Aura by Lifestyle
            </h3>
            <p
              style={{
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: "0.76rem",
                color: "#D9C7A5",
                lineHeight: 1.45,
                margin: 0,
              }}
            >
              15-storey landmark at Congress Nagar, Camp. Verified floor kits &amp; direct concierge support.
            </p>
          </div>
        </div>

        {/* RIGHT FORM CONTAINER */}
        <div
          className="auth-modal-right-panel"
          style={{
            flex: 1,
            minWidth: 0,
            padding: "2.25rem 2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            overflowY: "auto",
            background: "linear-gradient(180deg, rgba(32, 16, 5, 0.5) 0%, rgba(20, 10, 4, 0.8) 100%)",
          }}
        >
          {/* STEP 1: PHONE & NAME INPUT */}
          {step === "phone" && (
            <div>
              <div style={{ marginBottom: "1.1rem" }}>
                <h3
                  style={{
                    fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
                    fontSize: "1.35rem",
                    fontWeight: 700,
                    color: "#F8F5F3",
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  Sign In
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-montserrat), sans-serif",
                    color: "#BCA898",
                    fontSize: "0.78rem",
                    marginTop: "0.25rem",
                    lineHeight: 1.4,
                  }}
                >
                  Verify via WhatsApp OTP
                </p>
              </div>

              {!isAdminMode ? (
                <form onSubmit={handleSendOtp} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "var(--font-montserrat), sans-serif",
                        fontSize: "9px",
                        fontWeight: 700,
                        color: "#C5A880",
                        textTransform: "uppercase",
                        letterSpacing: "0.15em",
                        marginBottom: "0.35rem",
                      }}
                    >
                      Full Name <span style={{ color: "#E0A96D" }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      autoFocus
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "12px",
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(197, 168, 128, 0.22)",
                        color: "#F8F5F3",
                        fontSize: "0.88rem",
                        fontFamily: "var(--font-montserrat), sans-serif",
                        outline: "none",
                        transition: "all 0.2s ease",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#c5a880";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(197, 168, 128, 0.15)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "rgba(197, 168, 128, 0.22)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "var(--font-montserrat), sans-serif",
                        fontSize: "9px",
                        fontWeight: 700,
                        color: "#C5A880",
                        textTransform: "uppercase",
                        letterSpacing: "0.15em",
                        marginBottom: "0.35rem",
                      }}
                    >
                      WhatsApp Number <span style={{ color: "#E0A96D" }}>*</span>
                    </label>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <div
                        style={{
                          padding: "10px 12px",
                          background: "rgba(197, 168, 128, 0.08)",
                          border: "1px solid rgba(197, 168, 128, 0.25)",
                          borderRadius: "12px",
                          color: "#C5A880",
                          fontWeight: 700,
                          fontSize: "0.88rem",
                          fontFamily: "var(--font-montserrat), sans-serif",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        +91
                      </div>
                      <input
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        style={{
                          flex: 1,
                          padding: "10px 14px",
                          borderRadius: "12px",
                          background: "rgba(255, 255, 255, 0.03)",
                          border: "1px solid rgba(197, 168, 128, 0.22)",
                          color: "#F8F5F3",
                          fontSize: "0.88rem",
                          fontFamily: "var(--font-montserrat), sans-serif",
                          outline: "none",
                          transition: "all 0.2s ease",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#c5a880";
                          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(197, 168, 128, 0.15)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "rgba(197, 168, 128, 0.22)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "var(--font-montserrat), sans-serif",
                        fontSize: "9px",
                        fontWeight: 700,
                        color: "#C5A880",
                        textTransform: "uppercase",
                        letterSpacing: "0.15em",
                        marginBottom: "0.35rem",
                      }}
                    >
                      Email <span style={{ color: "#8A786A", textTransform: "none" }}>(Optional)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="Enter email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "12px",
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(197, 168, 128, 0.22)",
                        color: "#F8F5F3",
                        fontSize: "0.88rem",
                        fontFamily: "var(--font-montserrat), sans-serif",
                        outline: "none",
                        transition: "all 0.2s ease",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#c5a880";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(197, 168, 128, 0.15)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "rgba(197, 168, 128, 0.22)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>

                  {error && (
                    <div
                      style={{
                        padding: "8px 12px",
                        background: "rgba(239, 68, 68, 0.12)",
                        border: "1px solid rgba(239, 68, 68, 0.35)",
                        borderRadius: "8px",
                        color: "#ef4444",
                        fontSize: "0.82rem",
                        fontFamily: "var(--font-montserrat), sans-serif",
                        fontWeight: 500,
                      }}
                    >
                      {error}
                    </div>
                  )}

                  {/* Primary CTA */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      width: "100%",
                      padding: "12px 20px",
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #c5a880 0%, #a88756 100%)",
                      color: "#201005",
                      fontFamily: "var(--font-montserrat), sans-serif",
                      fontWeight: 700,
                      fontSize: "11px",
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                      border: "none",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      boxShadow: "0 8px 24px rgba(197, 168, 128, 0.25)",
                      opacity: isLoading ? 0.75 : 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      transition: "all 0.2s ease",
                      marginTop: "0.25rem",
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.background = "linear-gradient(135deg, #d4ba92 0%, #b89664 100%)";
                        e.currentTarget.style.transform = "translateY(-1px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "linear-gradient(135deg, #c5a880 0%, #a88756 100%)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <i className="fa-brands fa-whatsapp" style={{ fontSize: "1rem" }} />
                    {isLoading ? "Sending Code..." : "Get OTP on WhatsApp"}
                  </button>

                  <div style={{ textAlign: "center", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.4rem" }}>
                    <button
                      type="button"
                      onClick={onClose}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#C5A880",
                        fontSize: "0.78rem",
                        cursor: "pointer",
                        fontFamily: "var(--font-montserrat), sans-serif",
                        textDecoration: "underline",
                        transition: "color 0.2s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#F8F5F3")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#C5A880")}
                    >
                      Continue as Guest
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAdminMode(true)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#8A786A",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        fontFamily: "var(--font-montserrat), sans-serif",
                        transition: "color 0.2s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#C5A880")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#8A786A")}
                    >
                      Admin Access
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleAdminPasscodeLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "var(--font-montserrat), sans-serif",
                        fontSize: "9px",
                        fontWeight: 700,
                        color: "#C5A880",
                        textTransform: "uppercase",
                        letterSpacing: "0.15em",
                        marginBottom: "0.35rem",
                      }}
                    >
                      Admin Passcode
                    </label>
                    <input
                      type="password"
                      placeholder="Enter Admin Passcode"
                      value={adminPasscode}
                      onChange={(e) => setAdminPasscode(e.target.value)}
                      required
                      autoFocus
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "12px",
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(197, 168, 128, 0.22)",
                        color: "#F8F5F3",
                        fontSize: "0.88rem",
                        fontFamily: "var(--font-montserrat), sans-serif",
                        outline: "none",
                      }}
                    />
                  </div>

                  {error && (
                    <div
                      style={{
                        padding: "8px 12px",
                        background: "rgba(239, 68, 68, 0.12)",
                        border: "1px solid rgba(239, 68, 68, 0.35)",
                        borderRadius: "8px",
                        color: "#ef4444",
                        fontSize: "0.82rem",
                      }}
                    >
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    style={{
                      width: "100%",
                      padding: "12px 20px",
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #c5a880 0%, #a88756 100%)",
                      color: "#201005",
                      fontFamily: "var(--font-montserrat), sans-serif",
                      fontWeight: 700,
                      fontSize: "11px",
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 8px 24px rgba(197, 168, 128, 0.25)",
                    }}
                  >
                    Verify Admin
                  </button>
                  <div style={{ textAlign: "center", marginTop: "0.4rem" }}>
                    <button
                      type="button"
                      onClick={() => setIsAdminMode(false)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#C5A880",
                        fontSize: "0.78rem",
                        cursor: "pointer",
                        fontFamily: "var(--font-montserrat), sans-serif",
                      }}
                    >
                      ← Back to WhatsApp OTP
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* STEP 2: ENTER OTP */}
          {step === "otp" && (
            <div>
              <div style={{ marginBottom: "1.1rem" }}>
                <h3
                  style={{
                    fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
                    fontSize: "1.35rem",
                    fontWeight: 700,
                    color: "#F8F5F3",
                    margin: 0,
                  }}
                >
                  Enter Code
                </h3>
                <p style={{ color: "#BCA898", fontSize: "0.78rem", marginTop: "0.25rem", fontFamily: "var(--font-montserrat), sans-serif" }}>
                  Sent to <strong style={{ color: "#F8F5F3" }}>+91 {phone.replace(/\D/g, "").slice(-10)}</strong> via WhatsApp
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="••••••"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ""))}
                    required
                    autoFocus
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: "12px",
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1.5px solid #c5a880",
                      color: "#F8F5F3",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      letterSpacing: "8px",
                      textAlign: "center",
                      outline: "none",
                      boxShadow: "0 0 0 3px rgba(197, 168, 128, 0.15)",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "0.8rem",
                    color: "#BCA898",
                    fontFamily: "var(--font-montserrat), sans-serif",
                  }}
                >
                  <span style={{ color: otpTimer === 0 ? "#ef4444" : "#BCA898", fontWeight: otpTimer === 0 ? 600 : 400 }}>
                    {otpTimer > 0 ? `Expires in ${formatTimer(otpTimer)}` : "Code expired"}
                  </span>
                  <button
                    type="button"
                    disabled={otpTimer > 0 || isLoading}
                    onClick={() => handleSendOtp()}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: otpTimer > 0 ? "rgba(255, 255, 255, 0.35)" : "#c5a880",
                      cursor: otpTimer > 0 ? "not-allowed" : "pointer",
                      textDecoration: otpTimer > 0 ? "none" : "underline",
                      fontWeight: 600,
                      fontSize: "0.78rem",
                    }}
                  >
                    {otpTimer > 0 ? `Resend in ${otpTimer}s` : "Resend Code"}
                  </button>
                </div>

                {error && (
                  <div
                    style={{
                      padding: "8px 12px",
                      background: "rgba(239, 68, 68, 0.12)",
                      border: "1px solid rgba(239, 68, 68, 0.35)",
                      borderRadius: "8px",
                      color: "#ef4444",
                      fontSize: "0.82rem",
                    }}
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: "100%",
                    padding: "12px 20px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #c5a880 0%, #a88756 100%)",
                    color: "#201005",
                    fontFamily: "var(--font-montserrat), sans-serif",
                    fontWeight: 700,
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    border: "none",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    boxShadow: "0 8px 24px rgba(197, 168, 128, 0.25)",
                    opacity: isLoading ? 0.75 : 1,
                  }}
                >
                  {isLoading ? "Verifying..." : "Verify & Sign In"}
                </button>

                <div style={{ textAlign: "center" }}>
                  <button
                    type="button"
                    onClick={() => setStep("phone")}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#C5A880",
                      fontSize: "0.78rem",
                      cursor: "pointer",
                      fontFamily: "var(--font-montserrat), sans-serif",
                    }}
                  >
                    ← Change Number
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: OPTIONAL NAME TO FINALIZE */}
          {step === "name" && (
            <div>
              <div style={{ marginBottom: "1.4rem" }}>
                <h3 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.4rem", fontWeight: 700, margin: 0, color: "#F8F5F3" }}>
                  Welcome to Lifestyle
                </h3>
                <p style={{ color: "#BCA898", fontSize: "0.8rem", marginTop: "0.3rem" }}>
                  Please share your name to personalize your visit.
                </p>
              </div>

              <form onSubmit={handleSaveName} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "9px", fontWeight: 700, color: "#C5A880", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "0.35rem" }}>
                    Your Full Name <span style={{ color: "#E0A96D" }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vikram Deshmukh"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoFocus
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "12px",
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(197, 168, 128, 0.22)",
                      color: "#F8F5F3",
                      fontSize: "0.88rem",
                      outline: "none",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "12px 20px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #c5a880 0%, #a88756 100%)",
                    color: "#201005",
                    fontWeight: 700,
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 8px 24px rgba(197, 168, 128, 0.25)",
                  }}
                >
                  Complete Profile
                </button>
              </form>
            </div>
          )}

          {/* STEP 4: SUCCESS CONFIRMATION */}
          {step === "success" && (
            <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  margin: "0 auto 1.25rem",
                  borderRadius: "50%",
                  background: "rgba(197, 168, 128, 0.15)",
                  border: "1px solid rgba(197, 168, 128, 0.35)",
                  color: "#C5A880",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.6rem",
                }}
              >
                ✓
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontSize: "1.45rem",
                  fontWeight: 700,
                  color: "#F8F5F3",
                  marginBottom: "0.4rem",
                }}
              >
                Signed In Successfully
              </h3>
              <p style={{ color: "#BCA898", fontSize: "0.82rem", fontFamily: "var(--font-montserrat), sans-serif", margin: 0 }}>
                Welcome, {name || "Resident"}. Your verified session is active.
              </p>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  background: "rgba(197, 168, 128, 0.12)",
                  border: "1px solid rgba(197, 168, 128, 0.3)",
                  borderRadius: "9999px",
                  color: "#C5A880",
                  fontSize: "10.5px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginTop: "0.9rem",
                  marginBottom: "1rem",
                }}
              >
                ✓ 4K Brochure Dispatched to WhatsApp
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginTop: "0.25rem" }}>
                <a
                  href="https://scymbepzlkfqtkkwnxne.supabase.co/storage/v1/object/public/brochures/Aura-by-Lifestyle-Brochure.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    width: "100%",
                    padding: "11px 18px",
                    borderRadius: "9999px",
                    background: "#c5a880",
                    color: "#201005",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                  }}
                >
                  Download 4K Brochure PDF →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
