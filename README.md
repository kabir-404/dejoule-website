# DeJoule — Smart Building Intelligence

A pixel-accurate implementation of the DeJoule landing page, built with Next.js 16 App Router, Framer Motion, and Tailwind CSS v4.

## Live Demo

🔗 [View Live Demo](https://dejoule-assignment.netlify.app/)

---

## Project Setup

**Prerequisites:** Node.js 18+

```bash
git clone <repo-url>
cd dejoule
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run start      # serve production build
npm run lint       # ESLint (flat config)
```

---

## Architecture Overview

**Stack**

- Next.js 16.2.6 — App Router, JavaScript (no TypeScript at runtime)
- React 19.2.4
- Framer Motion 12
- Tailwind CSS v4 via `@tailwindcss/postcss` (no `tailwind.config.js`)

**Component tree**

```
app/
  layout.js          ← root layout, fonts
  page.js            ← composes all sections
components/
  Navbar.jsx
  HeroAndSticky.jsx  ← hero + sticky left-panel animation
  Hero.jsx           ← used by HeroAndSticky
  ReturnOnIntelligence.jsx
  CTA.jsx
  Footer.jsx
```

**API routes**
| Route | Method | Description |
|---|---|---|
| `/api/cards` | GET | Reads `data/cards.json`; `force-dynamic` so edits take effect immediately |
| `/api/contact` | POST | Validates fields, appends submission to `data/contacts.json` with `receivedAt` timestamp |

**Data persistence**

- `data/cards.json` — editable card content (committed to git). To update cards without redeploying, edit this file directly; changes are served immediately because `/api/cards` is `force-dynamic`.
- `data/contacts.json` — contact form submissions (`.gitignore`d; created on first submission)

**Styling strategy**

- Tailwind v4 utilities for layout, spacing, and responsive breakpoints
- Inline `style` props for pixel-exact Figma values (specific font sizes, letter-spacing, gradients, box-shadows)

---

## Responsive Approach

- **Navbar** — desktop horizontal links; mobile collapses to hamburger with an animated full-screen drawer. The navbar scrolls with the page and hides when the footer enters the viewport (detected via `IntersectionObserver`).
- **Hero** — desktop runs the full 5-phase animation sequence; mobile shows a simplified static layout
- **ReturnOnIntelligence cards** — accordion/stack collapses to single-column on mobile; image panel hidden on small screens
- **CTA / Footer** — single-column on mobile, multi-column on desktop
- Tailwind breakpoints used: `sm:` (640px) and `lg:` (1024px)

---

## Animation Approach

**Library:** Framer Motion v12 (`motion`, `AnimatePresence`, `useInView`)

**Hero — phase-based timing system**

`HeroAndSticky.jsx` uses `setTimeout`-driven phase flags to replicate the Figma Component 138 animation sequence:

| Phase | Trigger (ms)   | What happens                                                                         |
| ----- | -------------- | ------------------------------------------------------------------------------------ |
| 1     | 0              | Phone enters tilted at −19.71°, slides up                                            |
| 2     | 1 700          | Phone rights to −1.43°                                                               |
| 3     | 3 300          | Alert cards slide in; phone screen notifications appear                              |
| 4     | 5 500          | Phone shifts right 23 vw, scales 1.2×; headline exits left                           |
| 5+    | 7 000 → 14 500 | Left panel fades in; 4 feature items advance as a moving queue |

All easing uses `[0.22, 1, 0.36, 1]` (spring-like cubic-bezier) throughout.

**Left panel — moving queue**

`ITEMS.slice(activeItem)` renders only the active item and those still to come. The first item in the slice is at full opacity (1.0); the rest are dimmed (0.2). When the timer fires, the outgoing item exits (`opacity: 0, y: −20`) over 0.6 s; the `layout` prop on every sibling causes them to slide up simultaneously. `AnimatePresence` keeps the exiting element in the DOM until its animation completes.

**ROI card stack — stacked deck**

`ReturnOnIntelligence.jsx` renders all four cards as absolutely-positioned `motion.div`s. Collapsed cards peek from above the expanded card: the back card sits at `y = 0`, each subsequent card 80 px lower, and the active (expanded) card at the bottom (`y = (n−1) × 80 px`). The active card has the highest `z-index` so it visually covers the lower portions of the peek cards. Clicking the active card's title triggers a dismiss: the card flies upward (`y − 300, opacity → 0`) over 0.5 s, then the next card becomes active. After all four are dismissed the stack resets via a `resetKey` increment (forces remount so `initial` fires with no transition).

**Scroll animations:** `useInView` triggers fade/slide-in on the ROI section header, CTA, and footer on first scroll into view.

---

## Performance Optimizations

- `next/image` for automatic WebP conversion, lazy loading, and `srcset` generation
- `priority` prop on the hero phone image (LCP element) to preload it
- `/api/cards` set to `force-dynamic` — no stale static cache
- App Router automatic route-level code splitting
- Below-fold images use default `loading="lazy"`

---

## Accessibility

- Semantic landmarks: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- Keyboard navigation on navbar and mobile menu (focus-visible styles retained)
- `aria-label` on icon-only buttons (hamburger, close)
- Contact form `<label>` elements associated with inputs via `htmlFor` / `id`
- Primary text colors maintain WCAG AA contrast against white/light backgrounds

---

## Assumptions & Decisions

| Decision                             | Reason                                                                                                        |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| JavaScript over TypeScript           | Faster iteration for a landing-page assignment; tsconfig and types still present for optional strict checking |
| `data/cards.json` for card content   | Fulfils "editable through backend" requirement without a database                                             |
| `data/contacts.json` for submissions | Simple persistence without an external email provider                                                         |
| Framer Motion for all animation      | Fine-grained control needed to match Figma timing and easing exactly                                          |
| Tailwind v4 with PostCSS             | No config file required; `@import "tailwindcss"` + `@theme inline {}` in CSS                                  |
| Inline styles for Figma values       | Tailwind's JIT does not support arbitrary values like `tracking-[-0.84px]` or multi-stop gradients cleanly    |

---

## Challenges Faced

- **Hero animation sequence** — replicating 8 sub-phases with precise per-element timing and staggering without a timeline library required careful `setTimeout` orchestration and Framer Motion `delay` props
- **Phone screen notification overlay** — positioning skewed/rotated notification cards correctly inside a tilted `<Image>` wrapper required nested transforms with matching `rotate`, `skewX`, and `scale` values to keep cards flush with the phone screen at all viewport sizes
- **Stacked card deck (peek-from-top layout)** — matching the Figma design where collapsed cards peek from *above* the expanded card (not below) required inverting the y-positioning formula so the back card sits at `y = 0` and the active card sits at the bottom of the container, with z-index covering the lower portions of peek cards
- **Moving queue animation** — achieving the "items shift up together" effect while one exits required combining `AnimatePresence` (to animate the outgoing item) with Framer Motion's `layout` prop on siblings (so they slide into their new positions simultaneously rather than snapping after the exit completes)
- **Navbar gradient continuity** — matching the hero section's background so the navbar blends seamlessly on scroll

---

## Future Improvements

- Connect `/api/contact` to a transactional email provider (Resend or SendGrid)
- Build an admin UI to edit `cards.json` without touching the file directly
- Add unit tests for both API routes (validation logic, file read/write)
- Improve mobile hero animation (currently simplified)
- Add smooth page-section scroll transitions
