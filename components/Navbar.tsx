"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
      <Link href="/" className="logo">
        BUILD CONSTRUCTIONS
      </Link>
      <div className="nav-links">
        <a href="/#projects">Projects</a>
        <a href="/#process">Process</a>
        <Link href="/paint-visualizer">Paint Visualizer</Link>
        <a href="/#contact">Contact</a>
      </div>
    </nav>
  );
}
