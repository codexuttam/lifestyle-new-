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
        backgroundColor: "#080808",
        color: "#f7efdc",
        fontFamily: "var(--font-sans), sans-serif",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-display), sans-serif",
          fontSize: "clamp(4.5rem, 10vw, 7.5rem)",
          fontWeight: 600,
          lineHeight: 0.9,
          textTransform: "uppercase",
          color: "#f7efdc",
          margin: "0 0 1rem",
        }}
      >
        404
      </h1>
      <p
        style={{
          color: "rgba(247, 239, 220, 0.68)",
          fontSize: "1rem",
          maxWidth: "460px",
          lineHeight: 1.6,
          marginBottom: "2rem",
        }}
      >
        The page you are looking for does not exist or has been relocated within our portfolio.
      </p>
      <Link
        href="/"
        className="roll-button"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "13px 26px",
          borderRadius: "9999px",
          background: "#bf953f",
          border: "1px solid #d4af37",
          color: "#080808",
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          textDecoration: "none",
        }}
      >
        <span className="roll-text" data-text="Return to Aura →">
          Return to Aura →
        </span>
      </Link>
    </div>
  );
}
