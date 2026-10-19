"use client";

import React, { useState, useEffect } from "react";
import { VerifiedUser } from "@/lib/types/auth";
import { normalizePhone } from "@/lib/services/crmLeadService";

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

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpExpirySeconds, setOtpExpirySeconds] = useState(300);
  const [verifiedUser, setVerifiedUser] = useState<VerifiedUser | null>(null);

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
    if (resendCooldown > 0) {
      timer = setInterval(() => setResendCooldown((prev) => Math.max(prev - 1, 0)), 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "otp" && otpExpirySeconds > 0) {
      timer = setInterval(() => setOtpExpirySeconds((prev) => Math.max(prev - 1, 0)), 1000);
    }
    return () => clearInterval(timer);
  }, [step, otpExpirySeconds]);

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
      setResendCooldown(60);
      setOtpExpirySeconds(300);
    } catch {
      setError("Network error. Please try again.");
      setIsLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!enteredOtp || enteredOtp.trim().length < 4) {
      setError("Please enter the 6-digit OTP received on WhatsApp.");
      return;
    }

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

      if (!res.ok) {
        setError(data.error || "Invalid OTP code. Please check your WhatsApp.");
        setIsLoading(false);
        return;
      }

      const user: VerifiedUser = data.user;
      setVerifiedUser(user);
      setIsLoading(false);

      if (!name.trim()) {
        setStep("name");
      } else {
        finishLogin(user);
      }
    } catch {
      setError("Verification failed. Please check your connection.");
      setIsLoading(false);
    }
  }

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    if (!verifiedUser) return;
    const finalName = name.trim();
    if (!finalName) return;

    setIsLoading(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: finalName,
          phone: verifiedUser.phone,
          email: email.trim() || undefined,
          project: "Aura by Lifestyle",
          source: "Profile Name Update",
        }),
      });
    } catch (err) {
      console.warn("Could not sync name to CRM:", err);
    }
    setIsLoading(false);

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
    }, 1800);
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
        backgroundColor: "rgba(6, 9, 14, 0.85)",
        backdropFilter: "blur(12px)",
        padding: "1rem",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <style>{`
        @keyframes authModalPopIn {
          from {
            opacity: 0;
            transform: scale(0.94) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "linear-gradient(135deg, #11141b 0%, #0a0d13 100%)",
          border: "1px solid rgba(212, 175, 55, 0.4)",
          borderRadius: "20px",
          padding: "2rem",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(212, 175, 55, 0.18)",
          color: "#ffffff",
          position: "relative",
          animation: "authModalPopIn 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Prominent Luxury Cross (✕) Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close login dialog"
          title="Close (Esc)"
          style={{
            position: "absolute",
            top: "1.15rem",
            right: "1.15rem",
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            background: "rgba(18, 22, 31, 0.9)",
            border: "1.5px solid rgba(212, 175, 55, 0.45)",
            color: "#f5d77f",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.5), 0 0 12px rgba(212, 175, 55, 0.15)",
            transition: "all 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
            zIndex: 10,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(212, 175, 55, 0.22)";
            e.currentTarget.style.borderColor = "#f5d77f";
            e.currentTarget.style.color = "#ffffff";
            e.currentTarget.style.transform = "scale(1.1) rotate(90deg)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(212, 175, 55, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(18, 22, 31, 0.9)";
            e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.45)";
            e.currentTarget.style.color = "#f5d77f";
            e.currentTarget.style.transform = "scale(1) rotate(0deg)";
            e.currentTarget.style.boxShadow = "0 4px 14px rgba(0, 0, 0, 0.5), 0 0 12px rgba(212, 175, 55, 0.15)";
          }}
        >
          <svg
            width="18"
            height="18"
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

        {/* STEP 1: PHONE NUMBER ONLY */}
        {step === "phone" && (
          <div>
            <div style={{ marginBottom: "1.5rem" }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "9999px",
                  background: "linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(232, 67, 147, 0.15))",
                  border: "1px solid rgba(212, 175, 55, 0.35)",
                  color: "#f5d77f",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  marginBottom: "0.6rem",
                }}
              >
                Exclusive Member Sign-In
              </span>
              <h3 style={{ fontSize: "1.45rem", fontWeight: 700, margin: 0 }}>
                WhatsApp OTP Sign-Up
              </h3>
              <p style={{ color: "rgba(255, 255, 255, 0.65)", fontSize: "0.85rem", marginTop: "0.35rem" }}>
                Enter your full name and mobile number to receive an instant verification code on WhatsApp.
              </p>
            </div>

            {!isAdminMode ? (
              <form onSubmit={handleSendOtp}>
                <div style={{ marginBottom: "1.1rem" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      color: "rgba(255, 255, 255, 0.8)",
                      marginBottom: "0.4rem",
                      fontWeight: 500,
                    }}
                  >
                    Your Full Name <span style={{ color: "#e84393" }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name (e.g. Vikram Sharma)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoFocus
                    style={{
                      width: "100%",
                      padding: "0.85rem 1rem",
                      borderRadius: "10px",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(212, 175, 55, 0.3)",
                      color: "#ffffff",
                      fontSize: "0.95rem",
                      outline: "none",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "1.3rem" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      color: "rgba(255, 255, 255, 0.8)",
                      marginBottom: "0.4rem",
                      fontWeight: 500,
                    }}
                  >
                    Mobile Number <span style={{ color: "#e84393" }}>*</span>
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <div
                      style={{
                        padding: "0.85rem 0.9rem",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(212, 175, 55, 0.3)",
                        borderRadius: "10px",
                        color: "#f5d77f",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      +91
                    </div>
                    <input
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      autoFocus
                      style={{
                        flex: 1,
                        padding: "0.85rem 1rem",
                        borderRadius: "10px",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(212, 175, 55, 0.3)",
                        color: "#ffffff",
                        fontSize: "0.95rem",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>

                {error && (
                  <div
                    style={{
                      marginBottom: "1rem",
                      padding: "0.65rem 0.9rem",
                      background: "rgba(232, 67, 147, 0.15)",
                      border: "1px solid rgba(232, 67, 147, 0.4)",
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
                  disabled={isLoading}
                  style={{
                    width: "100%",
                    padding: "0.95rem 1.5rem",
                    borderRadius: "9999px",
                    background: "linear-gradient(135deg, #d4af37 0%, #e84393 100%)",
                    color: "#0a0a0c",
                    fontWeight: 700,
                    fontSize: "0.98rem",
                    border: "none",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    boxShadow: "0 8px 24px rgba(212, 175, 55, 0.25)",
                    opacity: isLoading ? 0.7 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  <i className="fa-brands fa-whatsapp" style={{ fontSize: "1.1rem" }} />
                  {isLoading ? "Sending WhatsApp OTP..." : "Get OTP on WhatsApp"}
                </button>

                <div style={{ marginTop: "1.1rem", textAlign: "center", display: "flex", flexDirection: "column", gap: "0.55rem", alignItems: "center" }}>
                  <button
                    type="button"
                    onClick={onClose}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "rgba(255, 255, 255, 0.6)",
                      fontSize: "0.82rem",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      padding: "0.3rem 0.6rem",
                      borderRadius: "6px",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#f5d77f")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)")}
                  >
                    <span>Explore platform as guest</span>
                    <span style={{ fontSize: "0.85rem", color: "#f5d77f" }}>✕</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAdminMode(true)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "rgba(255, 255, 255, 0.35)",
                      fontSize: "0.75rem",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    Admin Passcode Login
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleAdminPasscodeLogin}>
                <div style={{ marginBottom: "1.3rem" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      color: "rgba(255, 255, 255, 0.8)",
                      marginBottom: "0.4rem",
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
                    style={{
                      width: "100%",
                      padding: "0.85rem 1rem",
                      borderRadius: "10px",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(212, 175, 55, 0.3)",
                      color: "#ffffff",
                      fontSize: "0.95rem",
                      outline: "none",
                    }}
                  />
                </div>

                {error && (
                  <div
                    style={{
                      marginBottom: "1rem",
                      padding: "0.65rem 0.9rem",
                      background: "rgba(232, 67, 147, 0.15)",
                      border: "1px solid rgba(232, 67, 147, 0.4)",
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
                  style={{
                    width: "100%",
                    padding: "0.95rem 1.5rem",
                    borderRadius: "9999px",
                    background: "linear-gradient(135deg, #d4af37, #b8860b)",
                    color: "#0a0a0c",
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Verify Admin Access
                </button>
                <div style={{ marginTop: "1rem", textAlign: "center" }}>
                  <button
                    type="button"
                    onClick={() => setIsAdminMode(false)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#f5d77f",
                      fontSize: "0.82rem",
                      cursor: "pointer",
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
            <div style={{ marginBottom: "1.4rem" }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "9999px",
                  background: "rgba(37, 211, 102, 0.15)",
                  border: "1px solid rgba(37, 211, 102, 0.35)",
                  color: "#25D366",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  marginBottom: "0.6rem",
                }}
              >
                OTP Sent to WhatsApp
              </span>
              <h3 style={{ fontSize: "1.4rem", fontWeight: 700, margin: 0 }}>
                Enter Verification Code
              </h3>
              <p style={{ color: "rgba(255, 255, 255, 0.65)", fontSize: "0.85rem", marginTop: "0.35rem" }}>
                Code sent to <strong>+91 {phone.replace(/\D/g, "").slice(-10)}</strong> via Lifestyle WhatsApp.
              </p>
            </div>

            <form onSubmit={handleVerifyOtp}>
              <div style={{ marginBottom: "1.2rem" }}>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="6-digit OTP code"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ""))}
                  required
                  autoFocus
                  style={{
                    width: "100%",
                    padding: "1rem",
                    borderRadius: "10px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(212, 175, 55, 0.4)",
                    color: "#f5d77f",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    letterSpacing: "6px",
                    textAlign: "center",
                    outline: "none",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "0.82rem",
                  color: "rgba(255, 255, 255, 0.6)",
                  marginBottom: "1.2rem",
                }}
              >
                <span>Expires in: {formatTimer(otpExpirySeconds)}</span>
                <button
                  type="button"
                  disabled={resendCooldown > 0 || isLoading}
                  onClick={() => handleSendOtp()}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: resendCooldown > 0 ? "rgba(255, 255, 255, 0.35)" : "#f5d77f",
                    cursor: resendCooldown > 0 ? "not-allowed" : "pointer",
                    textDecoration: "underline",
                  }}
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                </button>
              </div>

              {error && (
                <div
                  style={{
                    marginBottom: "1rem",
                    padding: "0.65rem 0.9rem",
                    background: "rgba(232, 67, 147, 0.15)",
                    border: "1px solid rgba(232, 67, 147, 0.4)",
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
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "0.95rem 1.5rem",
                  borderRadius: "9999px",
                  background: "linear-gradient(135deg, #d4af37 0%, #e84393 100%)",
                  color: "#0a0a0c",
                  fontWeight: 700,
                  fontSize: "0.98rem",
                  border: "none",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  boxShadow: "0 8px 24px rgba(212, 175, 55, 0.25)",
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isLoading ? "Verifying..." : "Verify & Sign In"}
              </button>

              <div style={{ marginTop: "1rem", textAlign: "center" }}>
                <button
                  type="button"
                  onClick={() => setStep("phone")}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "rgba(255, 255, 255, 0.55)",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                  }}
                >
                  Change Mobile Number
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: OPTIONAL NAME TO FINALIZE */}
        {step === "name" && (
          <div>
            <div style={{ marginBottom: "1.4rem" }}>
              <h3 style={{ fontSize: "1.4rem", fontWeight: 700, margin: 0 }}>
                Welcome to Lifestyle Homes!
              </h3>
              <p style={{ color: "rgba(255, 255, 255, 0.65)", fontSize: "0.85rem", marginTop: "0.35rem" }}>
                What should our team and concierge address you as?
              </p>
            </div>

            <form onSubmit={handleSaveName}>
              <div style={{ marginBottom: "1.1rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.35rem" }}>
                  Your Full Name <span style={{ color: "#e84393" }}>*</span>
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
                    padding: "0.85rem 1rem",
                    borderRadius: "10px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(212, 175, 55, 0.3)",
                    color: "#ffffff",
                    fontSize: "0.95rem",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.35rem", color: "rgba(255, 255, 255, 0.7)" }}>
                  Email Address <span style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "0.8rem" }}>(Optional)</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. vikram@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.85rem 1rem",
                    borderRadius: "10px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(212, 175, 55, 0.2)",
                    color: "#ffffff",
                    fontSize: "0.95rem",
                    outline: "none",
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "0.95rem 1.5rem",
                  borderRadius: "9999px",
                  background: "linear-gradient(135deg, #d4af37 0%, #e84393 100%)",
                  color: "#0a0a0c",
                  fontWeight: 700,
                  fontSize: "0.98rem",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Complete Profile
              </button>
            </form>
          </div>
        )}

        {/* STEP 4: SUCCESS */}
        {step === "success" && (
          <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
            <div
              style={{
                width: "60px",
                height: "60px",
                margin: "0 auto 1.25rem",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #d4af37, #e84393)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.8rem",
              }}
            >
              ✓
            </div>
            <h3
              style={{
                fontSize: "1.45rem",
                fontWeight: 700,
                background: "linear-gradient(135deg, #f5d77f, #e84393)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "0.5rem",
              }}
            >
              Signed In Successfully!
            </h3>
            <p style={{ color: "rgba(255, 255, 255, 0.75)", fontSize: "0.9rem" }}>
              Welcome, {name || "Valued Resident"}. Your verified session is active.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
