# Frontend Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild all five pages (landing, auth, dashboard, interview, results) with a premium Charcoal/Coral/Cream design system using Playfair Display + DM Sans + DM Mono typography — no generic AI-startup aesthetics.

**Architecture:** Design tokens live in `globals.css` + `@theme inline` so they generate Tailwind utilities (`bg-charcoal`, `text-coral`, etc). The landing page is split into focused section components under `components/landing/`. All inner pages are restyled in-place. Existing API logic, Supabase calls, and routing are untouched — only JSX and styles change.

**Tech Stack:** Next.js 15, React 19, Tailwind v4, CSS custom properties, `next/font/google` (Playfair Display + DM Sans + DM Mono), shadcn `Input`/`Label`/`Textarea` kept for form functionality only.

---

### Task 1: Design Tokens + Font Setup

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Add brand tokens and keyframes to globals.css**

Open `app/globals.css`. Add the following block immediately after the three `@import` lines, before `@custom-variant dark`:

```css
/* ── Brand tokens ── */
:root {
  --charcoal: #1c1917;
  --charcoal-mid: #252119;
  --coral: #c96442;
  --coral-hover: #b8563a;
  --cream: #faf8f5;
  --cream-warm: #f5f1eb;
  --border-light: #e8e0d5;
  --border-dark: rgba(255, 255, 255, 0.07);
  --stone: #a8a29e;
  --warm-mid: #78716c;
}
```

Then add the following block at the very end of `globals.css`:

```css
/* ── Keyframes ── */
@keyframes rise {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes doc-rise {
  from { opacity: 0; transform: rotate(1.2deg) translateY(28px) scale(0.97); }
  to   { opacity: 1; transform: rotate(1.2deg) translateY(0) scale(1); }
}
@keyframes bar-grow {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
@keyframes glow-drift {
  0%, 100% { transform: translate(0, 0); }
  50%       { transform: translate(-30px, -20px); }
}
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

/* ── Scroll reveal ── */
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.65s ease, transform 0.65s ease;
}
.reveal.visible {
  opacity: 1;
  transform: none;
}

/* ── Graph-paper grid (used on dark hero/footer sections) ── */
.grid-bg {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
  background-size: 48px 48px;
}

/* ── Grain overlay ── */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 9999;
  opacity: 0.4;
}
```

In the `@theme inline` block, add these lines (they generate Tailwind utilities like `bg-charcoal`, `text-coral`, `font-serif`):

```css
@theme inline {
  /* … existing lines kept … */

  /* Brand colors */
  --color-charcoal:    var(--charcoal);
  --color-charcoal-mid: var(--charcoal-mid);
  --color-coral:       var(--coral);
  --color-coral-hover: var(--coral-hover);
  --color-cream:       var(--cream);
  --color-cream-warm:  var(--cream-warm);
  --color-stone:       var(--stone);
  --color-warm-mid:    var(--warm-mid);

  /* Fonts — values come from next/font variables set on <html> */
  --font-serif: var(--font-playfair);
  --font-sans:  var(--font-dm-sans);
  --font-mono:  var(--font-dm-mono);
}
```

- [ ] **Step 2: Update layout.tsx with fonts and metadata**

Replace `app/layout.tsx` entirely with:

```tsx
import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans, DM_Mono } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '700', '900'],
  display: 'swap',
})

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

const dmMono = DM_Mono({
  variable: '--font-dm-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Prep.AI — AI Interview Coaching',
  description:
    'Practice interviews tailored to your resume and target role. Get instant AI-powered feedback and scores.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-charcoal">
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: compiles with no TypeScript errors. If font names are wrong, check [next/font/google docs](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) — underscore-separated names like `Playfair_Display`.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "feat: add design tokens, brand fonts, keyframes, grain overlay"
```

---

### Task 2: Landing — Nav Component

**Files:**
- Create: `components/landing/Nav.tsx`

- [ ] **Step 1: Create Nav.tsx**

```tsx
import Link from 'next/link'

export default function Nav() {
  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between h-16 px-13 border-b"
      style={{
        background: 'rgba(28,25,23,0.9)',
        backdropFilter: 'blur(14px)',
        borderColor: 'var(--border-dark)',
      }}
    >
      <div
        className="font-sans font-bold text-[13px] tracking-[0.07em] uppercase text-cream"
      >
        Prep<span style={{ color: 'var(--coral)' }}>.</span>AI
      </div>

      <ul className="hidden md:flex gap-8 list-none">
        {['How it works', 'Features', 'Pricing'].map(label => (
          <li key={label}>
            <a
              href={`#${label.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-[13px] font-medium transition-colors"
              style={{ color: 'var(--warm-mid)' }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--stone)')}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--warm-mid)')}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2">
        <Link
          href="/auth?tab=login"
          className="text-[13px] font-medium px-4 py-2 rounded"
          style={{ color: 'var(--stone)' }}
        >
          Sign in
        </Link>
        <Link
          href="/auth"
          className="text-[13px] font-bold text-white px-4 py-2 rounded-[5px] transition-colors"
          style={{ background: 'var(--coral)' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'var(--coral-hover)')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'var(--coral)')}
        >
          Get started free
        </Link>
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/landing/Nav.tsx
git commit -m "feat: add landing Nav component"
```

---

### Task 3: Landing — Hero Component

**Files:**
- Create: `components/landing/Hero.tsx`

- [ ] **Step 1: Create Hero.tsx**

```tsx
export default function Hero() {
  return (
    <section
      className="relative flex overflow-hidden grid-bg"
      style={{
        background: 'var(--charcoal)',
        minHeight: 'calc(100vh - 64px)',
      }}
    >
      {/* Coral glow orb */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 700,
          height: 700,
          background: 'radial-gradient(circle, rgba(201,100,66,0.1) 0%, transparent 60%)',
          bottom: -200,
          right: -100,
          animation: 'glow-drift 10s ease-in-out infinite',
        }}
      />

      <div
        className="relative z-10 w-full max-w-[1280px] mx-auto px-13 grid items-center"
        style={{ gridTemplateColumns: '1fr 1fr' }}
      >
        {/* ── Left ── */}
        <div className="py-20 pr-16 flex flex-col justify-center">
          {/* Eyebrow */}
          <div
            className="flex items-center gap-3 mb-9"
            style={{ opacity: 0, animation: 'rise 0.6s 0.1s ease forwards' }}
          >
            <div className="h-px w-6" style={{ background: 'var(--coral)' }} />
            <span
              className="font-mono text-[11px] tracking-[0.1em] uppercase"
              style={{ color: '#5a5450' }}
            >
              AI interview coaching
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-serif font-black italic leading-[0.97] tracking-[-0.03em] text-cream mb-8"
            style={{
              fontSize: 'clamp(54px, 5.5vw, 76px)',
              opacity: 0,
              animation: 'rise 0.7s 0.2s ease forwards',
            }}
          >
            Walk in<br />
            <span style={{ color: 'var(--coral)', fontStyle: 'normal' }}>
              confident.
            </span>
          </h1>

          {/* Descriptor list */}
          <div
            className="flex flex-col gap-2 mb-11"
            style={{ opacity: 0, animation: 'rise 0.7s 0.32s ease forwards' }}
          >
            {[
              'Paste your resume and job description',
              'Get five questions tailored to the actual role',
              'Score every answer. Improve fast.',
            ].map(item => (
              <div key={item} className="flex items-baseline gap-3 text-[14px] font-sans font-light" style={{ color: 'var(--stone)' }}>
                <span style={{ color: 'var(--coral)', fontSize: 12 }}>—</span>
                {item}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div
            className="flex items-center gap-6"
            style={{ opacity: 0, animation: 'rise 0.7s 0.44s ease forwards' }}
          >
            <a
              href="/auth"
              className="font-sans font-bold text-[14px] text-white px-8 py-4 rounded-[5px] transition-colors"
              style={{ background: 'var(--coral)' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'var(--coral-hover)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'var(--coral)')}
            >
              Start practicing free
            </a>
            <span className="font-sans text-[12px]" style={{ color: '#4a4540' }}>
              No card · 2 min setup
            </span>
          </div>
        </div>

        {/* ── Right — Interview document ── */}
        <div className="py-20 pl-10 flex items-center justify-center">
          <div
            className="w-full max-w-[460px] relative"
            style={{
              opacity: 0,
              animation: 'doc-rise 0.9s 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
            }}
          >
            {/* Ghost shadow card */}
            <div
              className="absolute inset-0 rounded-[14px] -z-10"
              style={{
                background: 'rgba(201,100,66,0.08)',
                border: '1px solid rgba(201,100,66,0.12)',
                transform: 'rotate(-1.8deg) translate(-4px, 6px)',
              }}
            />

            {/* Main document card */}
            <div
              className="rounded-[10px] overflow-hidden"
              style={{
                background: '#211e1a',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 40px 100px rgba(0,0,0,0.55), 0 4px 20px rgba(0,0,0,0.3)',
                transform: 'rotate(1.2deg)',
              }}
            >
              {/* Header strip */}
              <div
                className="flex items-center justify-between px-5 py-3.5"
                style={{ background: '#191614', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="font-mono text-[11px] font-medium tracking-[0.06em] uppercase"
                    style={{ color: 'var(--coral)' }}
                  >
                    Stripe
                  </span>
                  <div className="w-px h-3" style={{ background: 'rgba(255,255,255,0.1)' }} />
                  <span className="font-sans text-[11px] font-medium" style={{ color: 'var(--stone)' }}>
                    Staff Software Engineer
                  </span>
                </div>
                <span className="font-mono text-[10px]" style={{ color: '#4a4540' }}>3 / 5</span>
              </div>

              {/* Body */}
              <div className="px-6 pt-6 pb-5">
                <div
                  className="font-mono text-[10px] font-medium tracking-[0.1em] uppercase mb-3"
                  style={{ color: '#4a4540' }}
                >
                  Question
                </div>
                <p
                  className="font-serif italic font-bold text-cream leading-[1.45] mb-5 pb-5"
                  style={{ fontSize: 18, borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                >
                  "Walk me through how you'd debug a cascading failure across a distributed payment system under active production load."
                </p>

                <div
                  className="font-mono text-[10px] font-medium tracking-[0.1em] uppercase mb-2.5"
                  style={{ color: '#4a4540' }}
                >
                  Your answer
                </div>
                <p className="font-sans text-[13px] leading-[1.65] mb-5" style={{ color: '#7a7268' }}>
                  During an incident at my last role, our payment orchestration service started dropping roughly 3% of transactions. First thing I did was isolate which service in the chain was emitting the first error — checked our{' '}
                  <strong style={{ color: 'var(--stone)', fontWeight: 500 }}>distributed traces in Datadog</strong>, found the auth token refresh service was timing out...
                </p>

                {/* Score row */}
                <div
                  className="flex items-center gap-4 -mx-6 -mb-5 px-6 py-4"
                  style={{ background: '#191614', borderTop: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <div
                    className="font-serif italic font-black leading-none tracking-[-0.03em]"
                    style={{
                      fontSize: 46,
                      color: 'var(--coral)',
                      textShadow: '0 0 40px rgba(201,100,66,0.35)',
                    }}
                  >
                    8.2
                  </div>
                  <div className="flex-1">
                    <div
                      className="font-mono text-[10px] font-medium tracking-[0.08em] uppercase mb-1.5"
                      style={{ color: '#4a4540' }}
                    >
                      Score / 10
                    </div>
                    <div
                      className="h-[3px] rounded-sm overflow-hidden mb-2"
                      style={{ background: 'rgba(255,255,255,0.07)' }}
                    >
                      <div
                        className="h-full rounded-sm origin-left"
                        style={{
                          width: '82%',
                          background: 'var(--coral)',
                          animation: 'bar-grow 1.2s 1.2s ease backwards',
                        }}
                      />
                    </div>
                    <p className="font-sans text-[11px] italic" style={{ color: 'var(--warm-mid)' }}>
                      Strong incident framing. Quantify the business impact.
                    </p>
                    <span
                      className="inline-block mt-1.5 font-mono text-[10px] font-medium px-2 py-0.5 rounded-[3px]"
                      style={{
                        color: '#7ec8a0',
                        background: 'rgba(126,200,160,0.1)',
                        border: '1px solid rgba(126,200,160,0.18)',
                      }}
                    >
                      STAR structure ✓
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/landing/Hero.tsx
git commit -m "feat: add landing Hero component with document card and animations"
```

---

### Task 4: Landing — Ticker, HowItWorks, Manifesto

**Files:**
- Create: `components/landing/Ticker.tsx`
- Create: `components/landing/HowItWorks.tsx`
- Create: `components/landing/Manifesto.tsx`

- [ ] **Step 1: Create Ticker.tsx**

```tsx
const ITEMS = [
  'Tailored questions', 'Behavioral coaching', 'System design prep',
  'Instant scoring', 'Improvement tips', 'STAR framework',
  'Role-matched questions', 'Session history',
]

export default function Ticker() {
  const doubled = [...ITEMS, ...ITEMS]
  return (
    <div
      className="overflow-hidden whitespace-nowrap py-3"
      style={{ background: 'var(--coral)' }}
      aria-hidden="true"
    >
      <div
        className="inline-flex"
        style={{ animation: 'marquee 28s linear infinite' }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="font-mono text-[11px] font-medium tracking-[0.08em] uppercase px-10" style={{ color: 'rgba(255,255,255,0.85)' }}>
            {item}
            {i < doubled.length - 1 && (
              <span className="ml-10" style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
            )}
          </span>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create HowItWorks.tsx**

```tsx
const STEPS = [
  {
    num: '01',
    title: 'Paste your resume\n& job description',
    body: 'Drop in both. The AI reads your experience alongside the actual job posting and maps exactly what the interviewer will want to probe.',
    asideLabel: 'What you bring',
    asideBody: 'Your resume in any format. The job description from the posting. No templates, no setup.',
    asideBold: ['resume', 'job description'],
  },
  {
    num: '02',
    title: 'Answer five\ntailored questions',
    body: 'Behavioral, technical, and situational — five questions calibrated to your background and the seniority of the role you\'re targeting.',
    asideLabel: 'Question types',
    asideBody: 'Behavioral drawn from your specific past experience. Technical or system design matched to the role\'s stack and scope.',
    asideBold: ['Behavioral', 'Technical', 'system design'],
  },
  {
    num: '03',
    title: 'Get scored,\nget better',
    body: 'Every answer is scored 1–10 with written feedback. After the session, one sharp improvement tip per answer — specific to what you said.',
    asideLabel: 'What you get',
    asideBody: 'A score per answer. Written feedback on what was strong and what to fix. Your overall score saved to session history.',
    asideBold: ['score', 'Written feedback', 'overall score'],
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-30 px-13" style={{ background: 'var(--cream)' }}>
      {/* Header */}
      <div
        className="reveal flex items-end justify-between mb-18 pb-7"
        style={{ borderBottom: '1px solid var(--border-light)' }}
      >
        <h2
          className="font-serif italic font-bold leading-[1.05] tracking-[-0.02em]"
          style={{ fontSize: 46, color: 'var(--charcoal)' }}
        >
          Three steps to<br />your next offer.
        </h2>
        <p className="font-sans text-[13px] text-right max-w-[240px] leading-[1.7]" style={{ color: 'var(--warm-mid)' }}>
          No courses. No flashcards. Deliberate practice matched to the actual job.
        </p>
      </div>

      {/* Rows */}
      <div style={{ borderTop: '1px solid var(--border-light)' }}>
        {STEPS.map(step => (
          <div
            key={step.num}
            className="reveal group grid items-start py-13 -mx-13 px-13 transition-colors duration-200"
            style={{
              gridTemplateColumns: '80px 1fr 1fr',
              gap: '0 48px',
              borderBottom: '1px solid var(--border-light)',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'var(--cream-warm)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
          >
            {/* Number */}
            <div
              className="font-serif font-black leading-none select-none transition-colors duration-300 -mt-2"
              style={{ fontSize: 64, color: 'var(--border-light)' }}
              data-step-num
            >
              {step.num}
            </div>

            {/* Content */}
            <div>
              <h3
                className="font-sans font-bold text-[20px] leading-[1.25] tracking-[-0.01em] mb-2.5"
                style={{ color: 'var(--charcoal)' }}
              >
                {step.title.split('\n').map((line, i) => (
                  <span key={i}>{line}{i === 0 && <br />}</span>
                ))}
              </h3>
              <p className="font-sans text-[14px] leading-[1.8] max-w-[320px]" style={{ color: 'var(--warm-mid)' }}>
                {step.body}
              </p>
            </div>

            {/* Aside */}
            <div className="pl-12" style={{ borderLeft: '1px solid var(--border-light)' }}>
              <div
                className="font-mono text-[10px] font-medium tracking-[0.1em] uppercase mb-2.5"
                style={{ color: 'var(--stone)' }}
              >
                {step.asideLabel}
              </div>
              <p className="font-sans text-[13px] leading-[1.75]" style={{ color: 'var(--warm-mid)' }}>
                {step.asideBody}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create Manifesto.tsx**

```tsx
const FEATURES = [
  {
    title: 'Tailored\nquestions',
    desc: "Every question is generated from your actual resume and the specific job description — not pulled from a list. If you've never done distributed systems, you won't be asked about them unless the role requires it.",
  },
  {
    title: 'Instant\nscoring',
    desc: 'Submit your answer and get a score in seconds — on a 1–10 scale with specific commentary on clarity, relevance, and structure. No waiting, no vague feedback.',
  },
  {
    title: 'Session\nhistory',
    desc: 'Every session is saved with your scores and tips. Practice multiple sessions for the same role and watch your performance arc improve over time.',
  },
  {
    title: 'Honest\ntips',
    desc: 'After each session, one specific improvement tip per question. Not "be more confident." Real guidance on exactly what to change in your answer next time.',
  },
]

export default function Manifesto() {
  return (
    <section
      id="features"
      className="py-30 px-13"
      style={{ background: 'var(--charcoal)' }}
    >
      {/* Header */}
      <div
        className="reveal flex items-end gap-8 mb-18 pb-7"
        style={{ borderBottom: '1px solid var(--border-dark)' }}
      >
        <div
          className="font-mono text-[10px] font-medium tracking-[0.14em] uppercase flex-shrink-0 mb-1"
          style={{
            color: 'var(--coral)',
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            transform: 'rotate(180deg)',
          }}
        >
          Features
        </div>
        <h2
          className="font-serif italic font-bold leading-[1.05] tracking-[-0.02em]"
          style={{ fontSize: 46, color: 'var(--cream)' }}
        >
          Built for people<br />
          who take this{' '}
          <em style={{ fontStyle: 'normal', color: 'var(--coral)' }}>seriously.</em>
        </h2>
      </div>

      {/* Feature list */}
      <ul style={{ borderTop: '1px solid var(--border-dark)' }}>
        {FEATURES.map(f => (
          <li
            key={f.title}
            className="reveal group relative flex items-center py-9 cursor-default transition-all duration-250"
            style={{
              display: 'grid',
              gridTemplateColumns: '220px 1fr 28px',
              gap: '0 48px',
              borderBottom: '1px solid var(--border-dark)',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              const bg = el.querySelector('[data-row-bg]') as HTMLElement
              if (bg) bg.style.opacity = '1'
              const arrow = el.querySelector('[data-arrow]') as HTMLElement
              if (arrow) { arrow.style.color = 'var(--coral)'; arrow.style.transform = 'translateX(5px)' }
              const title = el.querySelector('[data-title]') as HTMLElement
              if (title) title.style.color = 'white'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              const bg = el.querySelector('[data-row-bg]') as HTMLElement
              if (bg) bg.style.opacity = '0'
              const arrow = el.querySelector('[data-arrow]') as HTMLElement
              if (arrow) { arrow.style.color = 'rgba(255,255,255,0.08)'; arrow.style.transform = 'none' }
              const title = el.querySelector('[data-title]') as HTMLElement
              if (title) title.style.color = 'var(--cream)'
            }}
          >
            {/* Full-bleed hover bg */}
            <div
              data-row-bg
              className="absolute pointer-events-none transition-opacity duration-250"
              style={{
                inset: 0,
                left: '-52px',
                right: '-52px',
                background: 'rgba(201,100,66,0.04)',
                opacity: 0,
              }}
            />

            {/* Title */}
            <div
              data-title
              className="font-serif italic font-bold leading-[1.2] transition-colors duration-200 relative z-10"
              style={{ fontSize: 24, color: 'var(--cream)' }}
            >
              {f.title.split('\n').map((line, i) => (
                <span key={i}>{line}{i === 0 && <br />}</span>
              ))}
            </div>

            {/* Description */}
            <p
              className="font-sans text-[13px] leading-[1.8] max-w-[480px] relative z-10"
              style={{ color: 'var(--stone)' }}
            >
              {f.desc}
            </p>

            {/* Arrow */}
            <div
              data-arrow
              className="text-[18px] transition-all duration-200 relative z-10 flex-shrink-0"
              style={{ color: 'rgba(255,255,255,0.08)' }}
            >
              →
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add components/landing/Ticker.tsx components/landing/HowItWorks.tsx components/landing/Manifesto.tsx
git commit -m "feat: add Ticker, HowItWorks, Manifesto landing sections"
```

---

### Task 5: Landing — Testimonial, FooterCTA, SiteFooter + Page Assembly

**Files:**
- Create: `components/landing/Testimonial.tsx`
- Create: `components/landing/FooterCTA.tsx`
- Create: `components/landing/SiteFooter.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create Testimonial.tsx**

```tsx
export default function Testimonial() {
  return (
    <section className="relative py-30 px-13 overflow-hidden" style={{ background: 'var(--cream-warm)' }}>
      {/* Decorative opening quote */}
      <div
        className="absolute pointer-events-none select-none font-serif leading-none"
        style={{ fontSize: 320, color: 'var(--border-light)', top: -40, left: 32, lineHeight: 1 }}
        aria-hidden="true"
      >
        &ldquo;
      </div>

      <div className="reveal relative z-10 max-w-[720px]">
        <blockquote
          className="font-serif italic font-bold leading-[1.45] tracking-[-0.015em] mb-10"
          style={{ fontSize: 32, color: 'var(--charcoal)' }}
        >
          "I did three sessions the night before my Google interview. The questions were scarily accurate — one came up almost word for word. The feedback helped me fix answers I didn't know were weak."
        </blockquote>

        <div className="flex items-center gap-4">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-[15px] font-bold text-white flex-shrink-0"
            style={{ background: 'var(--coral)' }}
          >
            S
          </div>
          <div>
            <div className="font-sans font-bold text-[14px] mb-1" style={{ color: 'var(--charcoal)' }}>
              Sarah K.
            </div>
            <div className="font-sans text-[12px]" style={{ color: 'var(--warm-mid)' }}>
              Software Engineer — now at Google
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create FooterCTA.tsx**

```tsx
import Link from 'next/link'

export default function FooterCTA() {
  return (
    <section
      className="grid-bg relative py-30 px-13 flex items-center justify-between gap-12"
      style={{
        background: 'var(--charcoal)',
        borderTop: '1px solid var(--border-dark)',
      }}
    >
      <h2
        className="reveal font-serif italic font-black leading-[0.97] tracking-[-0.03em] max-w-[520px]"
        style={{ fontSize: 58, color: 'var(--cream)' }}
      >
        Your next offer<br />
        starts{' '}
        <span style={{ color: 'var(--coral)', fontStyle: 'normal' }}>here.</span>
      </h2>

      <div className="reveal flex flex-col gap-3 flex-shrink-0 z-10">
        <Link
          href="/auth"
          className="font-sans font-bold text-[14px] text-white px-9 py-4 rounded-[5px] text-center transition-colors whitespace-nowrap"
          style={{ background: 'var(--coral)' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'var(--coral-hover)')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'var(--coral)')}
        >
          Start practicing free →
        </Link>
        <div className="font-sans text-[12px] text-center pl-0.5" style={{ color: '#3a3530' }}>
          No credit card · Takes 2 minutes
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create SiteFooter.tsx**

```tsx
export default function SiteFooter() {
  return (
    <footer
      className="flex items-center justify-between px-13 py-6"
      style={{ background: 'var(--charcoal)', borderTop: '1px solid var(--border-dark)' }}
    >
      <div
        className="font-sans font-bold text-[12px] tracking-[0.06em] uppercase"
        style={{ color: '#3a3530' }}
      >
        Prep<span style={{ color: 'var(--coral)' }}>.</span>AI
      </div>

      <div className="flex gap-6">
        {['Privacy', 'Terms', 'Contact'].map(label => (
          <a
            key={label}
            href="#"
            className="font-sans text-[12px] transition-colors"
            style={{ color: '#3a3530' }}
            onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--stone)')}
            onMouseLeave={e => ((e.target as HTMLElement).style.color = '#3a3530')}
          >
            {label}
          </a>
        ))}
      </div>

      <div className="font-sans text-[12px]" style={{ color: '#2e2a27' }}>
        © 2026 Prep.AI
      </div>
    </footer>
  )
}
```

- [ ] **Step 4: Rewrite app/page.tsx**

```tsx
import Script from 'next/script'
import Nav from '@/components/landing/Nav'
import Hero from '@/components/landing/Hero'
import Ticker from '@/components/landing/Ticker'
import HowItWorks from '@/components/landing/HowItWorks'
import Manifesto from '@/components/landing/Manifesto'
import Testimonial from '@/components/landing/Testimonial'
import FooterCTA from '@/components/landing/FooterCTA'
import SiteFooter from '@/components/landing/SiteFooter'

export default function LandingPage() {
  return (
    <>
      <Nav />
      <Hero />
      <Ticker />
      <HowItWorks />
      <Manifesto />
      <Testimonial />
      <FooterCTA />
      <SiteFooter />
      <Script id="scroll-reveal" strategy="afterInteractive">{`
        const obs = new IntersectionObserver(entries => {
          entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
          });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
      `}</Script>
    </>
  )
}
```

- [ ] **Step 5: Verify build and run dev server to check landing page visually**

```bash
npm run build
npm run dev
```

Open http://localhost:3000. Verify: dark nav, hero with document card, ticker, three editorial process rows, manifesto feature list, testimonial, footer CTA. Scroll down to confirm reveal animations fire.

- [ ] **Step 6: Commit**

```bash
git add components/landing/Testimonial.tsx components/landing/FooterCTA.tsx components/landing/SiteFooter.tsx app/page.tsx
git commit -m "feat: complete landing page assembly"
```

---

### Task 6: Auth Page Redesign

**Files:**
- Modify: `app/auth/page.tsx`

- [ ] **Step 1: Replace app/auth/page.tsx**

All existing auth logic (Supabase signIn/signUp, router.push) is preserved — only the layout changes.

```tsx
'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function AuthForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClient()
  const [tab, setTab] = useState<'login' | 'signup'>(
    searchParams.get('tab') === 'login' ? 'login' : 'signup'
  )
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (tab === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
      {/* Left — brand panel */}
      <div
        className="grid-bg relative flex flex-col justify-between p-14 overflow-hidden"
        style={{ background: 'var(--charcoal)' }}
      >
        {/* Glow */}
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: 500,
            height: 500,
            background: 'radial-gradient(circle, rgba(201,100,66,0.1) 0%, transparent 60%)',
            bottom: -150,
            right: -100,
          }}
        />
        {/* Logo */}
        <div
          className="font-sans font-bold text-[13px] tracking-[0.07em] uppercase relative z-10"
          style={{ color: 'var(--cream)' }}
        >
          Prep<span style={{ color: 'var(--coral)' }}>.</span>AI
        </div>
        {/* Headline */}
        <div className="relative z-10">
          <h1
            className="font-serif italic font-black leading-[0.97] tracking-[-0.03em] text-cream mb-6"
            style={{ fontSize: 'clamp(42px, 4vw, 58px)' }}
          >
            Your next offer<br />
            starts{' '}
            <span style={{ color: 'var(--coral)', fontStyle: 'normal' }}>here.</span>
          </h1>
          <div className="flex flex-col gap-2">
            {[
              'Tailored questions from your actual resume',
              'Scored answers with specific feedback',
              'Session history to track improvement',
            ].map(item => (
              <div
                key={item}
                className="flex items-baseline gap-3 font-sans text-[13px] font-light"
                style={{ color: 'var(--stone)' }}
              >
                <span style={{ color: 'var(--coral)', fontSize: 11 }}>—</span>
                {item}
              </div>
            ))}
          </div>
        </div>
        {/* Bottom note */}
        <p className="font-mono text-[11px] tracking-[0.06em] relative z-10" style={{ color: '#4a4540' }}>
          No credit card required
        </p>
      </div>

      {/* Right — form */}
      <div
        className="flex items-center justify-center p-14"
        style={{ background: 'var(--cream)' }}
      >
        <div className="w-full max-w-[380px]">
          {/* Tab switcher */}
          <div
            className="flex mb-10 border-b"
            style={{ borderColor: 'var(--border-light)' }}
          >
            {(['signup', 'login'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="font-sans font-semibold text-[13px] pb-3 mr-6 border-b-2 transition-colors"
                style={{
                  color: tab === t ? 'var(--charcoal)' : 'var(--warm-mid)',
                  borderBottomColor: tab === t ? 'var(--coral)' : 'transparent',
                }}
              >
                {t === 'signup' ? 'Create account' : 'Sign in'}
              </button>
            ))}
          </div>

          <h2
            className="font-serif italic font-bold mb-8 tracking-[-0.01em]"
            style={{ fontSize: 28, color: 'var(--charcoal)' }}
          >
            {tab === 'login' ? 'Welcome back.' : 'Start practicing.'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="font-sans text-[13px] font-medium" style={{ color: 'var(--warm-mid)' }}>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="font-sans text-[14px] h-11 rounded-[5px]"
                style={{ borderColor: 'var(--border-light)', background: 'white' }}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="font-sans text-[13px] font-medium" style={{ color: 'var(--warm-mid)' }}>
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                className="font-sans text-[14px] h-11 rounded-[5px]"
                style={{ borderColor: 'var(--border-light)', background: 'white' }}
              />
            </div>
            {error && (
              <p className="font-sans text-[13px]" style={{ color: '#c0392b' }}>{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full font-sans font-bold text-[14px] text-white py-3 rounded-[5px] transition-colors disabled:opacity-60 mt-2"
              style={{ background: 'var(--coral)' }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = 'var(--coral-hover)' }}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--coral)'}
            >
              {loading ? 'Loading…' : tab === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <p className="font-sans text-[13px] text-center mt-6" style={{ color: 'var(--warm-mid)' }}>
            {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setTab(tab === 'login' ? 'signup' : 'login')}
              className="font-semibold transition-colors"
              style={{ color: 'var(--coral)' }}
            >
              {tab === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  )
}
```

- [ ] **Step 2: Verify build and check /auth visually**

```bash
npm run build && npm run dev
```

Open http://localhost:3000/auth. Verify: dark left panel with headline + descriptors, cream right panel with tab switcher + form. Test toggle between Sign in / Create account tabs. Test form submission (should still redirect to /dashboard on success).

- [ ] **Step 3: Commit**

```bash
git add app/auth/page.tsx
git commit -m "feat: auth page split-screen redesign"
```

---

### Task 7: Dashboard Redesign

**Files:**
- Modify: `app/dashboard/page.tsx`
- Modify: `components/dashboard/SessionCard.tsx`

- [ ] **Step 1: Rewrite components/dashboard/SessionCard.tsx**

```tsx
import Link from 'next/link'
import type { Session } from '@/types'

function ScorePill({ score }: { score: number | null }) {
  if (score === null) {
    return (
      <span
        className="font-mono text-[10px] font-medium px-2.5 py-1 rounded-[3px]"
        style={{
          background: 'rgba(255,255,255,0.06)',
          color: 'var(--stone)',
          border: '1px solid var(--border-dark)',
        }}
      >
        In progress
      </span>
    )
  }
  const isHigh = score >= 7
  const isMid = score >= 5
  const styles = isHigh
    ? { color: '#7ec8a0', bg: 'rgba(126,200,160,0.1)', border: 'rgba(126,200,160,0.2)' }
    : isMid
    ? { color: '#f5c842', bg: 'rgba(245,200,66,0.1)', border: 'rgba(245,200,66,0.2)' }
    : { color: '#e07070', bg: 'rgba(224,112,112,0.1)', border: 'rgba(224,112,112,0.2)' }

  return (
    <span
      className="font-mono text-[11px] font-bold px-2.5 py-1 rounded-[3px]"
      style={{
        color: styles.color,
        background: styles.bg,
        border: `1px solid ${styles.border}`,
      }}
    >
      {score.toFixed(1)} / 10
    </span>
  )
}

export default function SessionCard({ session }: { session: Session }) {
  const href =
    session.status === 'completed'
      ? `/interview/${session.id}/results`
      : `/interview/${session.id}`

  const snippet = session.job_description.slice(0, 100)
  const date = new Date(session.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  return (
    <Link href={href} className="block group">
      <div
        className="flex items-center justify-between gap-6 py-5 px-0 transition-colors duration-150"
        style={{ borderBottom: '1px solid var(--border-dark)' }}
        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)')}
        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
      >
        <div className="flex-1 min-w-0">
          <p
            className="font-sans text-[14px] font-medium truncate mb-1 transition-colors"
            style={{ color: 'var(--cream)' }}
          >
            {snippet}…
          </p>
          <p className="font-mono text-[11px]" style={{ color: '#4a4540' }}>
            {date}
          </p>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <ScorePill score={session.overall_score} />
          <span
            className="font-sans text-[12px] transition-all duration-150 group-hover:translate-x-0.5"
            style={{ color: '#4a4540' }}
          >
            →
          </span>
        </div>
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Rewrite app/dashboard/page.tsx**

```tsx
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import SessionCard from '@/components/dashboard/SessionCard'
import type { Session } from '@/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const { data: sessions } = await supabase
    .from('sessions')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen" style={{ background: 'var(--charcoal)' }}>
      {/* Top nav */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-13 h-16 border-b"
        style={{
          background: 'rgba(28,25,23,0.92)',
          backdropFilter: 'blur(14px)',
          borderColor: 'var(--border-dark)',
        }}
      >
        <div
          className="font-sans font-bold text-[13px] tracking-[0.07em] uppercase"
          style={{ color: 'var(--cream)' }}
        >
          Prep<span style={{ color: 'var(--coral)' }}>.</span>AI
        </div>
        <div className="flex items-center gap-6">
          <span className="font-mono text-[11px]" style={{ color: '#4a4540' }}>
            {user.email}
          </span>
          <Link
            href="/interview/new"
            className="font-sans font-bold text-[13px] text-white px-4 py-2 rounded-[5px] transition-colors"
            style={{ background: 'var(--coral)' }}
            onMouseEnter={undefined}
          >
            New interview
          </Link>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-[760px] mx-auto px-8 py-16">
        <div className="mb-12">
          <h1
            className="font-serif italic font-bold leading-[1.05] tracking-[-0.02em] mb-2"
            style={{ fontSize: 40, color: 'var(--cream)' }}
          >
            Your sessions.
          </h1>
          <p className="font-sans text-[13px]" style={{ color: 'var(--warm-mid)' }}>
            {sessions && sessions.length > 0
              ? `${sessions.length} session${sessions.length === 1 ? '' : 's'} completed`
              : 'No sessions yet'}
          </p>
        </div>

        {sessions && sessions.length > 0 ? (
          <div style={{ borderTop: '1px solid var(--border-dark)' }}>
            {sessions.map(session => (
              <SessionCard key={session.id} session={session as Session} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p
              className="font-serif italic font-bold mb-3 tracking-[-0.01em]"
              style={{ fontSize: 24, color: 'var(--stone)' }}
            >
              Nothing here yet.
            </p>
            <p className="font-sans text-[13px] mb-8" style={{ color: 'var(--warm-mid)' }}>
              Start a practice session to see your results here.
            </p>
            <Link
              href="/interview/new"
              className="font-sans font-bold text-[14px] text-white px-8 py-3 rounded-[5px] inline-block"
              style={{ background: 'var(--coral)' }}
            >
              Start your first interview →
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
```

- [ ] **Step 3: Verify build and check /dashboard visually (requires auth)**

```bash
npm run build && npm run dev
```

Open http://localhost:3000/dashboard (sign in first). Verify: dark charcoal bg, sticky header with logo + email + button, Playfair italic "Your sessions." heading, session rows with score pills, empty state if no sessions.

- [ ] **Step 4: Commit**

```bash
git add app/dashboard/page.tsx components/dashboard/SessionCard.tsx
git commit -m "feat: dashboard redesign with editorial session rows"
```

---

### Task 8: Interview Setup Form Redesign

**Files:**
- Modify: `app/interview/new/page.tsx`
- Modify: `components/interview/InterviewSetupForm.tsx`

- [ ] **Step 1: Read app/interview/new/page.tsx to see the current wrapper**

```bash
cat app/interview/new/page.tsx
```

- [ ] **Step 2: Rewrite app/interview/new/page.tsx**

```tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import InterviewSetupForm from '@/components/interview/InterviewSetupForm'

export default async function NewInterviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  return (
    <div className="min-h-screen" style={{ background: 'var(--charcoal)' }}>
      {/* Header */}
      <header
        className="flex items-center justify-between px-13 h-16 border-b"
        style={{
          background: 'rgba(28,25,23,0.92)',
          borderColor: 'var(--border-dark)',
        }}
      >
        <div className="font-sans font-bold text-[13px] tracking-[0.07em] uppercase" style={{ color: 'var(--cream)' }}>
          Prep<span style={{ color: 'var(--coral)' }}>.</span>AI
        </div>
        <a href="/dashboard" className="font-sans text-[13px] transition-colors" style={{ color: 'var(--stone)' }}>
          ← Dashboard
        </a>
      </header>

      <main className="max-w-[680px] mx-auto px-8 py-16">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-6" style={{ background: 'var(--coral)' }} />
            <span className="font-mono text-[11px] tracking-[0.1em] uppercase" style={{ color: '#5a5450' }}>
              New session
            </span>
          </div>
          <h1
            className="font-serif italic font-bold leading-[1.0] tracking-[-0.025em] text-cream mb-3"
            style={{ fontSize: 44 }}
          >
            Set up your interview.
          </h1>
          <p className="font-sans text-[14px] leading-[1.7]" style={{ color: 'var(--stone)' }}>
            Paste the job description and your resume below. The AI will generate five tailored questions for the role.
          </p>
        </div>
        <InterviewSetupForm />
      </main>
    </div>
  )
}
```

- [ ] **Step 3: Rewrite components/interview/InterviewSetupForm.tsx**

All form logic (fetch, router.push) is preserved — only the visual layer changes.

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function InterviewSetupForm() {
  const router = useRouter()
  const [jobDescription, setJobDescription] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/interview/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobDescription, resumeText }),
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? 'Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    router.push(`/interview/${data.sessionId}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <div className="space-y-2">
        <Label
          htmlFor="jobDescription"
          className="font-mono text-[10px] font-medium tracking-[0.1em] uppercase block"
          style={{ color: 'var(--stone)' }}
        >
          Job Description
        </Label>
        <Textarea
          id="jobDescription"
          value={jobDescription}
          onChange={e => setJobDescription(e.target.value)}
          placeholder="Paste the full job description here…"
          className="h-44 resize-none font-sans text-[14px] rounded-[5px]"
          style={{
            background: '#211e1a',
            border: '1px solid var(--border-dark)',
            color: 'var(--cream)',
          }}
          required
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="resumeText"
          className="font-mono text-[10px] font-medium tracking-[0.1em] uppercase block"
          style={{ color: 'var(--stone)' }}
        >
          Your Resume / Skills
        </Label>
        <Textarea
          id="resumeText"
          value={resumeText}
          onChange={e => setResumeText(e.target.value)}
          placeholder="Paste your resume or describe your key skills and experience…"
          className="h-44 resize-none font-sans text-[14px] rounded-[5px]"
          style={{
            background: '#211e1a',
            border: '1px solid var(--border-dark)',
            color: 'var(--cream)',
          }}
          required
        />
      </div>

      {error && (
        <p className="font-sans text-[13px]" style={{ color: '#e07070' }}>{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full font-sans font-bold text-[14px] text-white py-4 rounded-[5px] transition-colors disabled:opacity-50"
        style={{ background: 'var(--coral)' }}
        onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = 'var(--coral-hover)' }}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--coral)'}
      >
        {loading ? 'Generating questions…' : 'Start interview →'}
      </button>
    </form>
  )
}
```

- [ ] **Step 4: Verify build and check /interview/new visually**

```bash
npm run build && npm run dev
```

Open http://localhost:3000/interview/new (sign in first). Verify: dark charcoal bg, Playfair italic header, DM Mono field labels, dark textarea inputs, coral submit button.

- [ ] **Step 5: Commit**

```bash
git add app/interview/new/page.tsx components/interview/InterviewSetupForm.tsx
git commit -m "feat: interview setup form redesign"
```

---

### Task 9: Interview Live Page Redesign

**Files:**
- Modify: `components/interview/InterviewClient.tsx`

- [ ] **Step 1: Replace InterviewClient.tsx**

All state logic (`handleSubmitAnswer`, `handleNext`, API calls, routing) is preserved — only the visual layer changes. The `Progress` and `Card` shadcn imports are removed; replaced with custom markup.

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Textarea } from '@/components/ui/textarea'
import type { Session, Question } from '@/types'

interface AnswerResult {
  score: number
  feedback: string
}

export default function InterviewClient({ session }: { session: Session }) {
  const router = useRouter()
  const questions: Question[] = (session.questions ?? []).sort(
    (a, b) => a.order_index - b.order_index
  )
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answerText, setAnswerText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [lastResult, setLastResult] = useState<AnswerResult | null>(null)
  const [completing, setCompleting] = useState(false)
  const [error, setError] = useState('')

  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1
  const progressPct = (currentIndex / questions.length) * 100

  async function handleSubmitAnswer() {
    setSubmitting(true)
    setError('')
    const res = await fetch(`/api/interview/${session.id}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId: currentQuestion.id, answerText }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error ?? 'Failed to submit. Please try again.'); setSubmitting(false); return }
    setLastResult({ score: data.score, feedback: data.feedback })
    setSubmitting(false)
  }

  async function handleNext() {
    if (isLastQuestion) {
      setCompleting(true)
      const res = await fetch(`/api/interview/${session.id}/complete`, { method: 'POST' })
      if (res.ok) { router.push(`/interview/${session.id}/results`) }
      else { setError('Failed to complete interview. Please try again.'); setCompleting(false) }
      return
    }
    setCurrentIndex(i => i + 1)
    setAnswerText('')
    setLastResult(null)
    setError('')
  }

  const scoreColor =
    lastResult && lastResult.score >= 7
      ? '#7ec8a0'
      : lastResult && lastResult.score >= 5
      ? '#f5c842'
      : '#e07070'

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--charcoal)' }}>
      {/* Top bar */}
      <header
        className="flex items-center justify-between px-10 h-16 flex-shrink-0 border-b"
        style={{ borderColor: 'var(--border-dark)' }}
      >
        <div className="font-sans font-bold text-[13px] tracking-[0.07em] uppercase" style={{ color: 'var(--cream)' }}>
          Prep<span style={{ color: 'var(--coral)' }}>.</span>AI
        </div>

        {/* Progress */}
        <div className="flex items-center gap-4">
          <span className="font-mono text-[11px]" style={{ color: 'var(--stone)' }}>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <div className="w-32 h-[2px] rounded-full" style={{ background: 'var(--border-dark)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%`, background: 'var(--coral)' }}
            />
          </div>
        </div>

        <a href="/dashboard" className="font-sans text-[12px] transition-colors" style={{ color: '#4a4540' }}>
          Exit
        </a>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        <div className="w-full max-w-[640px]">
          {/* Question number */}
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-5" style={{ background: 'var(--coral)' }} />
            <span className="font-mono text-[10px] font-medium tracking-[0.1em] uppercase" style={{ color: 'var(--stone)' }}>
              Question {currentIndex + 1}
            </span>
          </div>

          {/* Question text */}
          <h2
            className="font-serif italic font-bold leading-[1.35] tracking-[-0.015em] text-cream mb-8"
            style={{ fontSize: 24 }}
          >
            {currentQuestion.question_text}
          </h2>

          {/* Answer phase */}
          {!lastResult && (
            <div className="space-y-4">
              <Textarea
                value={answerText}
                onChange={e => setAnswerText(e.target.value)}
                placeholder="Type your answer here…"
                className="h-40 resize-none font-sans text-[14px] leading-[1.7] rounded-[5px]"
                style={{
                  background: '#211e1a',
                  border: '1px solid var(--border-dark)',
                  color: 'var(--cream)',
                }}
                disabled={submitting}
              />
              {error && <p className="font-sans text-[13px]" style={{ color: '#e07070' }}>{error}</p>}
              <button
                onClick={handleSubmitAnswer}
                disabled={submitting || !answerText.trim()}
                className="w-full font-sans font-bold text-[14px] text-white py-4 rounded-[5px] transition-colors disabled:opacity-40"
                style={{ background: 'var(--coral)' }}
                onMouseEnter={e => { if (!submitting && answerText.trim()) (e.currentTarget as HTMLElement).style.background = 'var(--coral-hover)' }}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--coral)'}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span
                      className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      style={{ animation: 'spin 0.7s linear infinite' }}
                    />
                    Scoring your answer…
                  </span>
                ) : (
                  'Submit answer'
                )}
              </button>
            </div>
          )}

          {/* Result phase */}
          {lastResult && (
            <div
              className="rounded-[8px] p-6 space-y-5"
              style={{ background: '#211e1a', border: '1px solid var(--border-dark)' }}
            >
              {/* Score row */}
              <div className="flex items-center gap-5">
                <div
                  className="font-serif italic font-black leading-none tracking-[-0.03em]"
                  style={{ fontSize: 52, color: scoreColor }}
                >
                  {lastResult.score}
                </div>
                <div className="flex-1">
                  <div className="font-mono text-[10px] tracking-[0.08em] uppercase mb-2" style={{ color: '#4a4540' }}>
                    Score / 10
                  </div>
                  <div className="h-[3px] rounded-sm overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <div
                      className="h-full rounded-sm"
                      style={{ width: `${lastResult.score * 10}%`, background: scoreColor, transition: 'width 0.6s ease' }}
                    />
                  </div>
                </div>
              </div>

              {/* Feedback */}
              <p className="font-sans text-[14px] leading-[1.7]" style={{ color: 'var(--stone)' }}>
                {lastResult.feedback}
              </p>

              {error && <p className="font-sans text-[13px]" style={{ color: '#e07070' }}>{error}</p>}

              <button
                onClick={handleNext}
                disabled={completing}
                className="w-full font-sans font-bold text-[14px] text-white py-4 rounded-[5px] transition-colors disabled:opacity-50"
                style={{ background: 'var(--coral)' }}
                onMouseEnter={e => { if (!completing) (e.currentTarget as HTMLElement).style.background = 'var(--coral-hover)' }}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--coral)'}
              >
                {completing ? 'Finishing…' : isLastQuestion ? 'See results →' : 'Next question →'}
              </button>
            </div>
          )}
        </div>
      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: no TypeScript errors.

- [ ] **Step 3: Run dev server and test a full interview flow**

```bash
npm run dev
```

Start a new interview at http://localhost:3000/interview/new. Submit answers for all questions. Verify: dark focus-mode layout, progress bar updates, score result card with colored number and feedback, final redirect to results page.

- [ ] **Step 4: Commit**

```bash
git add components/interview/InterviewClient.tsx
git commit -m "feat: interview live page focus-mode redesign"
```

---

### Task 10: Results Page Redesign

**Files:**
- Modify: `components/results/ResultsSummary.tsx`
- Modify: `app/interview/[id]/results/page.tsx`

- [ ] **Step 1: Rewrite components/results/ResultsSummary.tsx**

```tsx
import type { Session, Question } from '@/types'

function scoreAccentColor(score: number) {
  return score >= 7 ? '#7ec8a0' : score >= 5 ? '#f5c842' : '#e07070'
}

export default function ResultsSummary({ session }: { session: Session }) {
  const questions: Question[] = (session.questions ?? []).sort(
    (a, b) => a.order_index - b.order_index
  )
  const tips: string[] = session.tips ?? []
  const overall = session.overall_score ?? 0

  return (
    <div>
      {/* Per-question breakdown */}
      <div className="space-y-0" style={{ borderTop: '1px solid var(--border-dark)' }}>
        {questions.map((q, i) => {
          const answer = q.answers?.[0]
          const score = answer?.score ?? 0
          const accent = scoreAccentColor(score)
          return (
            <div
              key={q.id}
              className="py-8"
              style={{ borderBottom: '1px solid var(--border-dark)' }}
            >
              {/* Question */}
              <div className="flex items-baseline gap-4 mb-4">
                <span
                  className="font-mono text-[10px] font-medium tracking-[0.1em] uppercase flex-shrink-0"
                  style={{ color: 'var(--stone)' }}
                >
                  Q{i + 1}
                </span>
                <p
                  className="font-serif italic font-bold leading-[1.35] text-cream"
                  style={{ fontSize: 18 }}
                >
                  {q.question_text}
                </p>
              </div>

              {answer ? (
                <div className="pl-9 space-y-4">
                  {/* Score row */}
                  <div className="flex items-center gap-4">
                    <div
                      className="font-serif italic font-black leading-none tracking-[-0.02em]"
                      style={{ fontSize: 36, color: accent }}
                    >
                      {score}
                    </div>
                    <div className="flex-1 max-w-[200px]">
                      <div
                        className="h-[3px] rounded-sm overflow-hidden"
                        style={{ background: 'rgba(255,255,255,0.07)' }}
                      >
                        <div
                          className="h-full rounded-sm"
                          style={{ width: `${score * 10}%`, background: accent }}
                        />
                      </div>
                    </div>
                    <span className="font-mono text-[10px]" style={{ color: '#4a4540' }}>
                      / 10
                    </span>
                  </div>

                  {/* Feedback */}
                  <p className="font-sans text-[14px] leading-[1.7]" style={{ color: 'var(--stone)' }}>
                    {answer.feedback}
                  </p>
                </div>
              ) : (
                <p className="pl-9 font-sans text-[13px]" style={{ color: '#4a4540' }}>
                  No answer recorded.
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Improvement tips */}
      {tips.length > 0 && (
        <div className="mt-12 pt-8" style={{ borderTop: '1px solid var(--border-dark)' }}>
          <h2
            className="font-serif italic font-bold mb-6 tracking-[-0.01em]"
            style={{ fontSize: 24, color: 'var(--cream)' }}
          >
            Top improvement tips.
          </h2>
          <ol className="space-y-5">
            {tips.map((tip, i) => (
              <li key={i} className="flex gap-4">
                <span
                  className="font-mono text-[11px] font-bold w-6 h-6 rounded-[3px] flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    color: 'var(--coral)',
                    background: 'rgba(201,100,66,0.12)',
                    border: '1px solid rgba(201,100,66,0.2)',
                  }}
                >
                  {i + 1}
                </span>
                <p className="font-sans text-[14px] leading-[1.7]" style={{ color: 'var(--stone)' }}>
                  {tip}
                </p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Rewrite app/interview/[id]/results/page.tsx**

```tsx
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ResultsSummary from '@/components/results/ResultsSummary'
import type { Session } from '@/types'

function overallScoreColor(score: number) {
  return score >= 7 ? '#7ec8a0' : score >= 5 ? '#f5c842' : '#e07070'
}

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const { data: session } = await supabase
    .from('sessions')
    .select('*, questions(*, answers(*))')
    .eq('id', id)
    .eq('user_id', user.id)
    .order('order_index', { referencedTable: 'questions', ascending: true })
    .single()

  if (!session) redirect('/dashboard')

  const overall = session.overall_score ?? 0
  const accent = overallScoreColor(overall)

  return (
    <div className="min-h-screen" style={{ background: 'var(--charcoal)' }}>
      {/* Header with overall score */}
      <header
        className="border-b px-8 py-12"
        style={{ borderColor: 'var(--border-dark)' }}
      >
        <div className="max-w-[680px] mx-auto">
          {/* Nav row */}
          <div className="flex items-center justify-between mb-10">
            <div className="font-sans font-bold text-[13px] tracking-[0.07em] uppercase" style={{ color: 'var(--cream)' }}>
              Prep<span style={{ color: 'var(--coral)' }}>.</span>AI
            </div>
            <Link
              href="/dashboard"
              className="font-sans text-[13px] transition-colors"
              style={{ color: 'var(--stone)' }}
            >
              ← Dashboard
            </Link>
          </div>

          {/* Score display */}
          <div className="flex items-end gap-6">
            <div
              className="font-serif italic font-black leading-none tracking-[-0.04em]"
              style={{ fontSize: 96, color: accent, lineHeight: 0.9 }}
            >
              {overall.toFixed(1)}
            </div>
            <div className="mb-2">
              <div className="font-mono text-[10px] font-medium tracking-[0.1em] uppercase mb-1" style={{ color: '#4a4540' }}>
                Overall score / 10
              </div>
              <div
                className="font-serif italic font-bold leading-[1.05] tracking-[-0.02em]"
                style={{ fontSize: 28, color: 'var(--cream)' }}
              >
                Interview results.
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-[680px] mx-auto px-8 py-12">
        <ResultsSummary session={session as Session} />

        {/* Actions */}
        <div className="flex gap-4 mt-12 pt-8" style={{ borderTop: '1px solid var(--border-dark)' }}>
          <Link
            href="/interview/new"
            className="font-sans font-bold text-[14px] text-white px-8 py-3.5 rounded-[5px] transition-colors"
            style={{ background: 'var(--coral)' }}
          >
            Practice again →
          </Link>
          <Link
            href="/dashboard"
            className="font-sans font-semibold text-[14px] px-8 py-3.5 rounded-[5px] transition-colors"
            style={{
              color: 'var(--stone)',
              border: '1px solid var(--border-dark)',
            }}
          >
            Back to dashboard
          </Link>
        </div>
      </main>
    </div>
  )
}
```

- [ ] **Step 3: Verify build and run all existing tests**

```bash
npm run build
npm run test:run
```

Expected: build succeeds; all vitest tests for `evaluateAnswer`, `generateQuestions`, `generateTips` continue to pass (they test AI functions, not UI).

- [ ] **Step 4: Run dev server and do a full end-to-end walkthrough**

```bash
npm run dev
```

Test the complete flow:
1. http://localhost:3000 — landing page, scroll all sections, check animations
2. http://localhost:3000/auth — split-screen, tab toggle, form
3. Sign up / sign in → redirects to dashboard
4. http://localhost:3000/dashboard — dark layout, sessions list or empty state
5. Start new interview → setup form → generates questions
6. Answer all questions → check score result cards
7. View results → large score number, per-question breakdown, tips, action buttons

- [ ] **Step 5: Commit**

```bash
git add components/results/ResultsSummary.tsx app/interview/[id]/results/page.tsx
git commit -m "feat: results page redesign with large score header and editorial breakdown"
```

---

## Self-Review

**Spec coverage check:**
- Design tokens (colors, fonts, grain, grid-bg, keyframes): Task 1 ✓
- Landing page — all 8 sections (Nav, Hero, Ticker, HowItWorks, Manifesto, Testimonial, FooterCTA, SiteFooter): Tasks 2–5 ✓
- Hero: asymmetric layout, tilted document card, graph-paper grid, coral glow, load animations: Task 3 ✓
- Auth split-screen: Task 6 ✓
- Dashboard dark layout + editorial session rows: Task 7 ✓
- Interview setup form dark styling: Task 8 ✓
- Interview live focus-mode: Task 9 ✓
- Results large score header + per-question breakdown: Task 10 ✓

**Placeholder scan:** No TBDs, no "implement later", no "similar to Task N" shortcuts. All code blocks are complete.

**Type consistency:**
- `Session`, `Question`, `Answer` from `@/types` — used consistently across all components
- `AnswerResult` interface defined locally in InterviewClient (same shape as before)
- All async params use `Promise<{ id: string }>` pattern (Next.js 15 convention)
- `session.questions ?? []` null-coalescing used consistently in InterviewClient and ResultsSummary
