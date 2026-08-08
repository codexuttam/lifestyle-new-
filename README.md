# Build Constructions — Next.js

Next.js (App Router) conversion of the static `construction` landing page.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Structure

- `app/layout.jsx` — fonts (next/font: Inter, Playfair Display), FontAwesome, metadata
- `app/globals.css` — original `styles.css`, fonts swapped to CSS variables
- `app/page.jsx` — page composition + static sections
- `components/HeroSequence.jsx` — pinned canvas frame-sequence scroll animation (GSAP ScrollTrigger, 213 frames)
- `components/RevealAnimations.jsx` — section reveal + animated counters
- `components/Gallery.jsx` — masonry gallery + lightbox (React state)
- `components/ContactForm.jsx`, `components/Navbar.jsx`, `components/CustomCursor.jsx`
- `public/frames`, `public/images` — assets copied from the original project
