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
        <Link href="/projects">Projects</Link>
        <Link href="/services">Services</Link>
        <Link href="/paint-visualizer">Paint Visualizer</Link>
        <a href="https://wa.me/916398792951">Contact</a>
      </div>
    </nav>
  );
}
