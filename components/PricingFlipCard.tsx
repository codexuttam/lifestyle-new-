"use client";

import { useState } from "react";

type PricingFlipCardProps = {
  name: string;
  price: string;
  bestFor: string;
  includes: React.ReactNode;
  notIncluded?: React.ReactNode;
  highlighted?: boolean;
  badge?: React.ReactNode;
  ctaVariant?: "outline" | "solid";
};

export default function PricingFlipCard({
  name,
  price,
  bestFor,
  includes,
  notIncluded,
  highlighted = false,
  badge,
  ctaVariant = "outline",
}: PricingFlipCardProps) {
  // Tap-to-flip for touch devices; desktop flips on hover via CSS.
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`pricing-card flip-card${highlighted ? " highlighted" : ""}${
        flipped ? " flipped" : ""
      }`}
      onClick={() => setFlipped((f) => !f)}
    >
      {badge}
      <div className="flip-inner">
        <div className="flip-face flip-front">
          <h3>{name}</h3>
          <div className="price">
            {price} <span>/ sq ft</span>
          </div>
          <p className="best-for">{bestFor}</p>
          <hr />
          <p className="flip-hint">
            <i className="fa-solid fa-rotate" /> Hover to see what&apos;s included
          </p>
          <button
            className={`cta-button ${ctaVariant} full-width`}
            onClick={(e) => e.stopPropagation()}
          >
            Get Quote
          </button>
        </div>
        <div className="flip-face flip-back">
          <h3>{name}</h3>
          <hr />
          <p>
            <strong>Includes:</strong> {includes}
          </p>
          {notIncluded && (
            <p className="not-included">
              <strong>Not included:</strong> {notIncluded}
            </p>
          )}
          <button
            className={`cta-button ${ctaVariant} full-width`}
            onClick={(e) => e.stopPropagation()}
          >
            Get Quote
          </button>
        </div>
      </div>
    </div>
  );
}
