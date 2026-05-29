# Frontend Overhaul Design Spec
**Date:** 2026-05-29  
**Scope:** Full custom UI/UX redesign of all pages — landing, auth, dashboard, interview, results

---

## Design Direction

**Aesthetic:** Bold & Energetic with Claude/Anthropic warmth. Editorial, human-designed, decidedly not generic AI-startup. References: Superhuman (asymmetric layouts, product-in-context hero), Anthropic (editorial restraint, warm palette), Linear (functional clarity).

**Anti-patterns to avoid:** Purple gradient orbs, floating glassmorphism cards, centered-text-only heroes, emoji section headers, generic SaaS card grids, Inter/Roboto fonts, template-looking 3-column feature sections.

---

## Design Tokens

### Colors
```
--charcoal:      #1c1917   (primary dark bg, nav, hero, footer)
--charcoal-mid:  #252119   (cards on dark bg)
--coral:         #c96442   (primary accent, CTAs, scores, highlights)
--coral-hover:   #b8563a   (button hover state)
--cream:         #faf8f5   (light section bg)
--cream-warm:    #f5f1eb   (testimonial bg, hover states)
--border:        #e8e0d5   (light section borders)
--border-dark:   rgba(255,255,255,0.07)  (dark section borders)
--muted:         #a8a29e   (secondary text on dark)
--warm-mid:      #78716c   (secondary text on light)
```

### Typography
```
--serif:  'Playfair Display'  — headlines, pull quotes, scores (italic 700/900)
--sans:   'DM Sans'           — body, UI, buttons, nav (300–700)
--mono:   'DM Mono'           — labels, badges, timestamps, metadata (400/500)
```

Google Fonts import: `Playfair Display` (ital 400/700/900) + `DM Sans` (opsz 9–40, wt 300–700) + `DM Mono` (wt 400/500)

### Textures & Effects
- **Grain overlay:** Full-page `position:fixed` SVG noise filter at ~35% opacity, `pointer-events:none`, z-index 9999
- **Graph-paper grid:** `repeating-linear-gradient` at 48×48px, `rgba(255,255,255,0.025)` — used on dark hero and footer CTA sections
- **Coral glow orb:** `radial-gradient` 700px circle, 10% opacity, animated drift (10s ease-in-out infinite) — hero only
- **Backdrop blur:** Nav uses `backdrop-filter: blur(14px)` with semi-transparent charcoal bg

### Shape & Spacing
- Border radius: `5px` for buttons/cards (tight, editorial), `10px` for large document cards
- Consistent section padding: `120px` vertical, `52px` horizontal
- Nav height: `62px`

---

## Pages

### 1. Landing Page (Marketing)

**Nav**
- Dark charcoal with blur, sticky
- Logo: `Prep.AI` — DM Sans 700 uppercase, coral dot
- Center links: How it works / Features / Pricing — DM Sans 500, muted color
- Right: "Sign in" ghost + "Get started free" coral button (5px radius)

**Hero**
- Full-height dark charcoal, graph-paper grid bg, coral glow orb (bottom-right, animated)
- Asymmetric 2-col grid (50/50), left-aligned — NOT centered
- **Left column:**
  - Eyebrow: `—` line + DM Mono uppercase label "AI Interview Coaching"
  - Headline: Playfair Display italic 900, `clamp(54px, 5.5vw, 76px)`, line-height 0.97. Text: *"Walk in confident."* with "confident." in coral (non-italic)
  - Descriptor list: 3 items with `—` coral dash prefix, DM Sans 400 muted. No paragraph.
  - Single CTA: coral button + "No card · 2 min setup" note in very muted text
- **Right column:**
  - Single interview document card, `rotate(1.2deg)`, shadow ghost card behind at `rotate(-1.8deg)`
  - Card header strip: `Stripe · Staff Software Engineer · 3/5` — DM Mono labels + coral company name
  - Question in Playfair italic
  - Truncated answer in small muted DM Sans
  - Score footer: large `8.2` in Playfair italic coral (46px), score bar, feedback text, green STAR pill
  - Stagger-animated in on load (`doc-rise` keyframe)
- Hero animations: left content staggered `rise` (fade + translateY), document delays 0.5s, score bar scales from 0 on load

**Ticker/Marquee**
- Full-width coral strip between hero and How It Works
- DM Mono 11px uppercase, infinite marquee animation
- Keywords: Tailored questions · Behavioral coaching · System design prep · Instant scoring · Improvement tips · STAR framework · Role-matched questions · Session history

**How It Works**
- Cream background, 3 editorial rows (not cards)
- Section header: left headline (Playfair italic) + right descriptive note
- Each row: 3-col grid — large decorative step number (Playfair 64px, border color) | content (title + body) | aside (DM Mono label + detail)
- Full-width hover: warm cream bg transition, step number shifts to faint coral
- Aside has a left border separator
- Scroll-reveal animation on each row

**Features / Manifesto**
- Dark charcoal background
- Section header: vertical DM Mono eyebrow (rotated) + Playfair italic headline
- List of 4 features: 3-col grid — italic serif title | DM Sans description | `→` arrow
- Row hover: very subtle coral tint bg, title brightens, arrow slides right and turns coral
- Full-bleed hover effect via `::after` pseudo-element (extends outside padding)
- Scroll-reveal on each item

**Testimonial**
- Cream-warm background
- Large decorative `"` in Playfair (320px, border color), absolute positioned top-left
- Quote in Playfair italic 32px
- Attribution: coral avatar circle + name/role

**Footer CTA**
- Dark charcoal, graph-paper grid overlay
- 2-col layout: large Playfair italic headline left, button + note right
- Headline: *"Your next offer starts here."* with "here." in coral

**Footer**
- Charcoal, top border
- 3-col: logo | nav links | copyright — all very muted

---

### 2. Auth Page (`/auth`)

Replace the current plain card on `bg-slate-50` with:
- **Split-screen layout**, full viewport height
- **Left half:** Dark charcoal with graph-paper grid, coral glow. Large Playfair italic headline: *"Your next offer starts here."*. 3 descriptor items with `—` dashes. Subtle branding at bottom.
- **Right half:** Cream background. Centered form card with no visible card border — just content. DM Sans form fields. Toggle between Sign In / Sign Up as tab switcher (not separate pages). Coral submit button full-width.
- Form inputs: `border: 1px solid var(--border)`, focus ring uses coral, no shadcn card wrapper

---

### 3. Dashboard (`/dashboard`)

Replace the `bg-slate-50` flat list with:
- **Charcoal nav header** across top: logo left, user email + "Start new interview" coral button right
- **Cream body** below
- Section title: Playfair italic "Your sessions."
- **Session cards:** Replaced with editorial row layout — similar to the "How It Works" rows. Each row shows: job description snippet (truncated) | date in DM Mono | score badge. Hover lifts slightly.
- **Score badge:** Coral for ≥7, amber for ≥5, muted for <5. DM Mono font.
- **Empty state:** Centered Playfair italic quote-style message, coral CTA button

---

### 4. Interview Page (`/interview/[id]`)

Replace the current `InterviewClient` with a focus-mode design:
- **Full dark charcoal** background (no light bg during interview — focus mode)
- Top bar: `Prep.AI` logo left, progress indicator center (`Question 3 of 5` in DM Mono), subtle exit link right
- **Question card:** Centered, max-width 680px. Question number in DM Mono muted. Question text in Playfair italic 24px cream.
- **Answer textarea:** Large, dark, borderless-ish textarea with a very subtle border. DM Sans 14px, warm white text. No placeholder clutter.
- **Submit button:** Coral, full-width below textarea, disabled until answer has content
- **Loading state:** Subtle coral pulse animation, "Scoring your answer..." in DM Mono

---

### 5. Results Page (`/interview/[id]/results`)

Replace the plain `bg-slate-50` layout with:
- **Charcoal header:** Overall score displayed as a large Playfair italic number in coral, `/10` in muted. Session context (role, date) in DM Mono below.
- **Cream body:** Per-question breakdown
- **Per-question row:** Question in Playfair italic (smaller), answer excerpt in muted DM Sans, score bar + number, feedback text, improvement tip in a coral-bordered aside
- **Footer actions:** "Practice again" (new interview) + "Back to dashboard" as side-by-side buttons

---

## Component Architecture

### New/Modified Files
```
app/
  globals.css               — design tokens, font imports, grain overlay, base resets
  layout.tsx                — update metadata title/description, font variables
  page.tsx                  — full landing page rebuild
  auth/page.tsx             — split-screen auth layout
  dashboard/page.tsx        — new dashboard layout
  interview/[id]/page.tsx   — focus-mode interview layout (server)
  interview/[id]/results/page.tsx — new results layout

components/
  ui/button.tsx             — restyle to match design tokens (coral primary, 5px radius)
  interview/InterviewClient.tsx — full redesign
  interview/InterviewSetupForm.tsx — redesign form inputs
  dashboard/SessionCard.tsx — replace with editorial row
  results/ResultsSummary.tsx — redesign with score breakdown
```

### shadcn Usage
Keep shadcn primitives for: `Input`, `Label`, `Textarea` (form functionality only). Remove shadcn `Card` usage from page layouts — build custom layout divs. Override `Button` component styles.

---

## Animations Summary

| Element | Animation | Trigger |
|---|---|---|
| Hero left content | `fade-up` staggered (0.1–0.44s delay) | Page load |
| Interview document | `doc-rise` (fade + rotate + scale) | Page load, 0.5s |
| Score bar fill | `scaleX` from 0→width | Page load, 1.2s |
| Coral glow orb | `glow-drift` pulse, 10s infinite | Always |
| Ticker/marquee | `marquee` 28s infinite | Always |
| Section rows | `fade-up` via IntersectionObserver | Scroll into view |
| Feature rows | Hover: bg tint + arrow slide | Hover |
| Process rows | Hover: bg shift + step number color | Hover |

---

## Spec Self-Review

- No placeholder sections or TBDs
- All colors, fonts, and component decisions are explicit
- Landing page design validated against mockup (v3)
- Inner pages follow the same token system — no new color or font introductions
- Scope is a single implementation cycle (one PR, all pages)
- No contradictions between sections
