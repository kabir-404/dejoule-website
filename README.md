# DeJoule — Smart Building Intelligence

A pixel-accurate implementation of the DeJoule landing page, built with Next.js 16 App Router, Framer Motion, and Tailwind CSS v4.

## Live Demo

[View Live Demo](https://dejoule-assignment.netlify.app/)

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
  layout.js                  ← root layout, fonts (Geist Sans, Geist Mono, Work Sans)
  page.js                    ← composes all sections
components/
  Navbar.jsx                 ← responsive nav with dropdown, fades on footer intersection
  HeroAndSticky.jsx          ← hero + sticky left-panel phase animation
  ReturnOnIntelligence.jsx   ← scroll-based stacked card deck
  CTA.jsx                    ← contact section with animated modal form
  Footer.jsx                 ← company / solutions / social links
```

> `Hero.jsx` exists in the repo but is not used — `page.js` imports `HeroAndSticky.jsx` directly.

**API routes**

| Route | Method | Description |
|---|---|---|
| `/api/cards` | GET | Reads `data/cards.json`; `force-dynamic` so edits take effect immediately |
| `/api/contact` | POST | Validates fields, appends submission to `data/contacts.json` with `receivedAt` timestamp |

**Data persistence**

- `data/cards.json` — editable card content (committed to git). Changes are served immediately because `/api/cards` is `force-dynamic`.
- `data/contacts.json` — contact form submissions (`.gitignore`d; created on first submission)

**Styling strategy**

- Tailwind v4 utilities for layout, spacing, and responsive breakpoints
- Inline `style` props for pixel-exact values (specific font sizes, letter-spacing, gradients, box-shadows, gradient text via `WebkitBackgroundClip`)

---

## Responsive Approach

- **Navbar** — desktop horizontal links with animated dropdown; mobile collapses to a hamburger with an `AnimatePresence` drawer. Fades out when the footer enters the viewport via `IntersectionObserver`.
- **Hero** — desktop runs the full 5-phase animation sequence; mobile shows a simplified static layout.
- **ReturnOnIntelligence** — desktop uses a 300 vh scroll-capture stack; mobile falls back to a tap-to-expand vertical accordion.
- **CTA / Footer** — single-column on mobile, multi-column on desktop.
- Tailwind breakpoints used: `sm:` (640 px) and `lg:` (1024 px).

---

## Animation Approach

**Library:** Framer Motion 12 (`motion`, `AnimatePresence`, `useInView`, `useScroll`, `useTransform`, `useMotionValueEvent`)

---

### Hero — phase-based timing system

`HeroAndSticky.jsx` uses `setTimeout`-driven phase flags to replicate the Figma Component 138 animation sequence:

| Phase | Trigger (ms)   | What happens |
| ----- | -------------- | ------------ |
| 1     | 0              | Phone enters tilted at −19.71°, slides up |
| 2     | 1 700          | Phone rights to −1.43° |
| 3     | 3 300          | Alert cards slide in; phone screen notifications appear |
| 4     | 5 500          | Phone shifts right 23 vw, scales 1.2×; headline exits left |
| 5+    | 7 000 → 14 500 | Left panel fades in; 4 feature items advance as a moving queue |

All easing uses `[0.22, 1, 0.36, 1]` (spring-like cubic-bezier) throughout.

**Left panel — moving queue**

`ITEMS.slice(activeItem)` renders only the active item and those still to come. The first item is at full opacity; the rest are dimmed (0.2). When the timer fires, the outgoing item exits (`opacity: 0, y: −20`) over 0.6 s; the `layout` prop on every sibling causes them to slide up simultaneously. `AnimatePresence` keeps the exiting element in the DOM until its animation completes.

---

### ROI card stack — scroll-driven stacked deck

`ReturnOnIntelligence.jsx` renders all four cards as absolutely-positioned `motion.div`s inside a 300 vh scroll-capture wrapper.

**Scroll setup**

```jsx
const { scrollYProgress } = useScroll({
  target: wrapperRef,
  offset: ["start start", "end end"],
});
```

**Card positioning**

- Cards are stacked with `position: absolute`, `top: i * PEEK_H` (76 px per card)
- `left: "50%"` + Framer Motion `x: "-50%"` centres each card safely without conflicting with `y` transforms
- The `zIndex` of each card equals `i + 1` so later cards sit on top
- Container height = `3 × 76 + 501 = 729 px`

**Scroll transforms**

| Card | Hook | Input range | Output range |
|------|------|-------------|--------------|
| 3 (back) | `y3` | [0.08, 0.35] | 0 vh → −110 vh |
| 2 | `y2` | [0.35, 0.62] | 0 vh → −110 vh |
| 1 | `y1` | [0.62, 0.89] | 0 vh → −110 vh |
| 0 (front) | — | static `0` | never moves |

All four hooks are declared at component top level — never inside `.map()` — to satisfy the Rules of Hooks.

**Visual depth tapering**

When `currentFront` advances, back cards narrow to signal depth:

| Depth from front | Width |
|------|-------|
| 0 (front) | 100% |
| 1 | 99% |
| 2 | 95% |
| 3+ | 91% |

Width changes animate with `transition: "width 0.6s cubic-bezier(0.22, 1, 0.36, 1)"`.

**`currentFront` tracking**

`useMotionValueEvent` fires on every scroll tick and sets `currentFront` at the boundaries [0.35, 0.62, 0.89].

**Mobile fallback**

On `< lg` screens the 300 vh wrapper is hidden and replaced with a vertical accordion list. Tapping a collapsed card (76 px peek height) expands it to `ExpandedCard`; a `×` button collapses it back.

---

### Feature item accordions

Each `ExpandedCard` contains expandable feature items. Clicking a feature title toggles `AnimatePresence`-driven `height: 0 → auto` for the description, with the `+` icon rotating 45° via `motion.span`.

---

### CTA — section reveals + contact modal

`SectionReveal` wraps children in a `useInView`-triggered `motion.div` (fade + slide). Clicking "Let's connect" opens a `ContactModal` wrapped in `AnimatePresence` (backdrop fade + card slide-up). On success, the form swaps for a confirmation state.

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
- `aria-label` on icon-only buttons (hamburger, close, collapse)
- Contact form `<label>` elements associated with inputs via `htmlFor` / `id`
- Primary text colors maintain WCAG AA contrast against white/light backgrounds

---

## Assumptions & Decisions

| Decision | Reason |
| -------- | ------- |
| JavaScript over TypeScript | Faster iteration for a landing-page assignment; `tsconfig.json` and types still present for optional strict checking |
| `data/cards.json` for card content | Fulfils "editable through backend" requirement without a database |
| `data/contacts.json` for submissions | Simple persistence without an external email provider |
| Framer Motion for all animation | Fine-grained control needed to match Figma timing and easing exactly |
| Tailwind v4 with PostCSS | No config file required; `@import "tailwindcss"` + `@theme inline {}` in CSS |
| Inline styles for Figma values | Tailwind's JIT does not support arbitrary values like `tracking-[-0.84px]` or multi-stop gradients cleanly; gradient text requires `WebkitBackgroundClip` which cannot be expressed in Tailwind |
| 300 vh scroll capture for ROI | Long enough to give each of the 4 cards a deliberate scroll segment while avoiding excessive dead scroll |

---

## Challenges Faced

- **Hero animation sequence** — replicating 8 sub-phases with precise per-element timing and staggering without a timeline library required careful `setTimeout` orchestration and Framer Motion `delay` props
- **Scroll-driven card stack** — `useTransform` cannot be called inside `.map()`; all four transforms must be declared at component top level and mapped to cards by index
- **Framer Motion transform conflict** — using CSS `transform: translateX(-50%)` to centre absolutely-positioned cards conflicts with Framer Motion's internal transform matrix for `y`. Fixed by passing `x: "-50%"` as a Framer Motion style prop so both axes merge correctly
- **Phone screen notification overlay** — positioning skewed/rotated notification cards correctly inside a tilted `<Image>` wrapper required nested transforms with matching `rotate`, `skewX`, and `scale` values
- **Moving queue animation** — achieving "items shift up together" while one exits required combining `AnimatePresence` (animate the outgoing item) with `layout` prop on siblings (they slide into new positions simultaneously)
- **Navbar gradient continuity** — matching the hero section's background so the navbar blends seamlessly on scroll

---

## Future Improvements

- Connect `/api/contact` to a transactional email provider (Resend or SendGrid)
- Build an admin UI to edit `cards.json` without touching the file directly
- Add unit tests for both API routes (validation logic, file read/write)
- Improve mobile hero animation (currently simplified)
- Add smooth page-section scroll transitions
