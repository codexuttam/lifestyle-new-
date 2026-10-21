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
        backgroundColor: "#050a16",
        color: "#ffffff",
        fontFamily: "var(--font-sans), 'Montserrat', sans-serif",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1
        style={{
          fontSize: "5rem",
          fontWeight: 800,
          background: "linear-gradient(135deg, #ffffff 40%, var(--color-wine, #c21a22) 100%)",
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
          background: "var(--color-wine, #c21a22)",
          color: "#ffffff",
          fontWeight: 700,
          textDecoration: "none",
          transition: "transform 0.2s ease",
          boxShadow: "0 4px 18px rgba(194, 26, 34, 0.4)",
        }}
      >
        Return to Home
      </Link>
    </div>
  );
}
