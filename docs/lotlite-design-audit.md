# Lotlite SIEC Design System Audit & Extraction Manifesto

This audit documents the visual design system, color palette, typography scale, interactive animations, and authentication/admission modal architecture extracted directly from the live reference website: **https://www.lotlitesiec.com/**.

---

## 1. Executive Summary & Source Asset Provenance

- **Reference URL**: `https://www.lotlitesiec.com/`
- **Application Architecture**: Modern Single Page Application built on React, Tailwind CSS design tokens, and Framer Motion spring transitions.
- **Production Bundle Assets**:
  - HTML: `index.html` (includes Preconnect fonts, JSON-LD Schema, and meta tags)
  - Stylesheet: `/assets/index-P8Fk6gyo.css` (182 KB compiled Tailwind CSS & custom property layer)
  - JavaScript Application: `/assets/index-CF2diZJR.js` (1.08 MB compiled React runtime, Framer Motion, and component tree)

---

## 2. Verified Color Token Palette

All values below were extracted directly from `:root`, `@layer theme`, and computed component styles.

| Token Name | Hex / RGBA Value | CSS Variable / Token | Role & Purpose | Contrast & Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Wine Primary** | `#c21a22` | `--color-wine` | Primary Brand Color, CTAs, Hero Badges, Highlight Accents | High contrast on white & dark surfaces |
| **Wine Hover** | `#9e1218` | `--color-wine-hover` | Active & Hover state for primary buttons | Deepened contrast on cursor hover |
| **Wine Light Tint** | `#c21a220d` (5% wine) | `--color-wine-light` | Pill tag background, eyebrow badge fill | Subtle ambient tinting |
| **Wine Light Border** | `#c21a2226` (15% wine) | `--color-wine-light-border`| Eyebrow badge border, card accent boundary | Crisp luxury delineation |
| **Wine Glow RGB** | `194, 26, 34` | `--wine-glow-rgb` | Ambient radial blur glows (`blur-[150px]`) | Atmospheric lighting effects |
| **Card Surface** | `#ffffff` / `#12161f` | `--color-bg-card` | Program cards, floor plan panels, modals | Elevated surface layer |
| **Input Background**| `#f9fafb` / `#0e121a` | `--color-bg-input` | Form inputs, select dropdowns, textareas | Soft recessed surface for inputs |
| **Main Surface** | `#ffffff` / `#090b10` | `--color-bg` | Main page background | Deep luxury canvas |
| **Primary Text** | `#2e2e2e` / `#f8fafc` | `--color-text` | Headings, primary labels, strong text | High legibility (WCAG AAA) |
| **Muted Text** | `#6b7280` / `#94a3b8` | `--color-text-muted` | Subtitles, body copy, timestamps, captions | Secondary reading hierarchy |
| **Border / Divider**| `#00000014` / `rgba(255,255,255,0.08)`| `--color-border` | Subtle dividing lines, card perimeter | 1px clean structure |
| **Badge Background**| `#ffffff` / `rgba(194,26,34,0.12)` | `--color-badge-bg` | Category tags and architectural pill badges| Highlighted state |
| **Badge Text** | `#c21a22` | `--color-badge-text` | Eyebrow badges, tag text | Vibrant uppercase tracking |
| **Success State** | `#16a34a` (green-600) | `--color-green-600` | Verification confirmation, success checkmarks| Positive feedback |
| **Error State** | `#ef4444` (red-500) | `--color-red-500` | Form validation errors, invalid OTP | High visibility warning |

---

## 3. Typography Hierarchy & Scaled System

Lotlite SIEC pairs a geometric, modern sans-serif (**Montserrat**) for UI navigation, badges, inputs, buttons, and captions with an elegant high-contrast serif (**Playfair Display**) for high-impact hero headings and section titles.

```css
:root {
  --font-sans: "Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-serif: "Playfair Display", Georgia, serif;
}
```

### Typographic Scale

| Role | Font Family | Size (Desktop / Mobile) | Weight | Line Height | Letter Spacing | Text Transform |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Display (H1)** | Playfair Display | `3.75rem (60px)` / `2rem (32px)` | 600 (Semibold) | `1.12` | `-0.02em` | None |
| **Section Headings (H2)**| Playfair Display | `2.5rem (40px)` / `1.75rem (28px)` | 600 (Semibold) | `1.2` | `-0.015em` | None |
| **Card / Modal Headings (H3/H4)**| Playfair Display | `1.5rem (24px)` / `1.25rem (20px)` | 600 / 700 | `1.3` | `normal` | None |
| **Eyebrow / Tag Badges** | Montserrat | `10px` / `9px` | 700 (Bold) | `1` | `0.35em` | Uppercase |
| **Primary Buttons & CTAs** | Montserrat | `12px` / `11px` | 700 (Bold) | `1.25` | `0.15em` | Uppercase |
| **Form Field Labels** | Montserrat | `10px` / `9.5px` | 700 (Bold) | `1` | `0.15em` | Uppercase |
| **Form Inputs** | Montserrat | `13px` / `13px` | 500 (Medium) | `1.5` | `normal` | None |
| **Body Paragraphs** | Montserrat | `15px` / `14px` | 400 / 500 | `1.65` | `normal` | None |
| **Captions / Legal Footnotes** | Montserrat | `12px` / `11px` | 400 / 500 | `1.5` | `normal` | None |

---

## 4. Animation & Motion System

Lotlite SIEC's motion is refined, smooth, and purposeful:

1. **Continuous Marquee Ticker**:
   - Class: `animate-marquee` and `animate-marquee-reverse`
   - Keyframe: `0% { transform: translate(0); } 100% { transform: translate(-100%); }`
   - Timing: `30s linear infinite`
2. **Floating Graphic / Pill**:
   - Class: `animate-floating`
   - Keyframe: `0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-20px) rotate(10deg); }`
   - Timing: `6s ease-in-out infinite`
3. **Card Hover Elevation**:
   - Transition: `all 0.3s cubic-bezier(0.16, 1, 0.3, 1)`
   - Hover transform: `translateY(-4px)`
   - Hover shadow: `0 20px 40px rgba(0, 0, 0, 0.08), 0 0 20px rgba(194, 26, 34, 0.12)`
   - Hover border: `border-color: rgba(194, 26, 34, 0.25)`
4. **Button Hover & Active**:
   - Hover: `transform: translateY(-2px)`, `box-shadow: 0 8px 24px rgba(194, 26, 34, 0.35)`
   - Active: `transform: translateY(0px)`, `scale(0.98)`
   - Transition: `all 0.18s ease`
5. **Modal Spring Reveal**:
   - Framer Motion Spring config: `damping: 25`, `stiffness: 300`
   - CSS Transition equivalent: `transform: scale(0.95) translateY(20px) -> scale(1) translateY(0)`, `opacity: 0 -> 1` via `cubic-bezier(0.16, 1, 0.3, 1)` in `280ms`.
6. **Accessibility**:
   - `@media (prefers-reduced-motion: reduce)` disables all transforms, loops, and marquees.

---

## 5. Login & Admission Modal Card Architecture

The reference application provides a signature split-card layout for Admissions / Profiling and a focused centered dialog for OTP / Authentication:

### A. Dimensions & Structure
- **Max Width**:
  - Admission / Profiling Modal: Desktop `max-w-[850px]`, Tablet `max-w-[480px]`, Mobile `w-[92%]`
  - Login / Verification Modal: `max-w-md (448px)`
- **Border Radius**: `24px` (`rounded-3xl`)
- **Border**: `1px solid var(--color-border)` (`rgba(255, 255, 255, 0.1)`)
- **Backdrop**: `rgba(0, 0, 0, 0.6)` with `backdrop-filter: blur(12px)`
- **Left Hero Showcase Panel (Desktop `38%` width)**:
  - Deep architectural background image with dark overlay (`rgba(0, 0, 0, 0.65)`)
  - Ambient radial wine glow (`bg-wine/30 blur-2xl`)
  - Uppercase pill badge: `bg-wine text-white text-[9px] font-extrabold tracking-widest`
  - High-impact serif heading: `text-xl font-serif text-white`
- **Right Form Container (Desktop `62%` width)**:
  - Padding: `24px (mobile)` to `32px (desktop)`
  - Close Button: `top-4 right-4 w-9 h-9 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-wine/20 transition-all`

### B. Form Controls
- **Inputs**:
  - `background: var(--color-bg-input)`
  - `border: 1px solid var(--color-border)`
  - `border-radius: 12px` (`var(--radius-lg)`)
  - `padding: 10px 14px`
  - `focus: outline: none; border-color: var(--color-wine); box-shadow: 0 0 0 3px rgba(194, 26, 34, 0.15)`
- **Primary CTA Button**:
  - `background: var(--color-wine)` (`#c21a22`)
  - `hover: background: var(--color-wine-hover)` (`#9e1218`)
  - `color: #ffffff`
  - `border-radius: 12px`
  - `padding: 14px 24px`
  - `font-size: 11px`
  - `font-weight: 700`
  - `letter-spacing: 0.15em`
  - `text-transform: uppercase`
  - `box-shadow: 0 8px 24px rgba(194, 26, 34, 0.25)`

---

## 6. Real Estate Adaptation Strategy

1. **Brand Architecture**:
   - **Aura by Lifestyle**: The primary flagship real-estate landmark. Owns the homepage (`/`), the hero visual identity, 15-storey building highlights, architectural floor plans, amenities, and main enquiry flow.
   - **Lifestyle Home Spaces**: The related developer portfolio project with its own dedicated route (`/projects/lifestyle-homes`), interactive building showcase, specifications, and dedicated CRM lead attribution.
2. **Minimal Enquiry Form**:
   - Strictly 3 fields: **Full Name** (required), **Mobile Number** (required), **Email Address** (optional).
   - Styled with Lotlite's uppercase tracking labels, 12px rounded input tokens, and wine focus ring.
3. **CRM Contact Naming Guarantee**:
   - `splitName` sanitized to strip leading and trailing `Client` / `Customer` tokens.
   - Storing a lead for `"Uttam"` records `firstName: "Uttam"`, `lastName: ""` (never `"Client Uttam"`).
