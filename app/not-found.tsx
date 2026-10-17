import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#06090e",
        color: "#ffffff",
        fontFamily: "var(--font-inter), sans-serif",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1
        style={{
          fontSize: "4rem",
          fontWeight: 700,
          background: "linear-gradient(135deg, #f5d77f 0%, #e84393 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "1rem",
        }}
      >
        404
      </h1>
      <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "1.2rem", marginBottom: "2rem" }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        style={{
          display: "inline-block",
          padding: "0.85rem 1.75rem",
          borderRadius: "9999px",
          background: "linear-gradient(135deg, #d4af37, #b8860b)",
          color: "#0a0a0c",
          fontWeight: 600,
          textDecoration: "none",
          transition: "transform 0.2s ease",
        }}
      >
        Return to Home
      </Link>
    </div>
  );
}
