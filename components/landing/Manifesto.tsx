'use client'

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

      <ul style={{ borderTop: '1px solid var(--border-dark)' }}>
        {FEATURES.map(f => (
          <li
            key={f.title}
            className="reveal relative cursor-default"
            style={{
              display: 'grid',
              gridTemplateColumns: '220px 1fr 28px',
              gap: '0 48px',
              padding: '36px 0',
              borderBottom: '1px solid var(--border-dark)',
              alignItems: 'center',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              const bg = el.querySelector('[data-row-bg]') as HTMLElement | null
              if (bg) bg.style.opacity = '1'
              const arrow = el.querySelector('[data-arrow]') as HTMLElement | null
              if (arrow) { arrow.style.color = 'var(--coral)'; arrow.style.transform = 'translateX(5px)' }
              const title = el.querySelector('[data-title]') as HTMLElement | null
              if (title) title.style.color = 'white'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              const bg = el.querySelector('[data-row-bg]') as HTMLElement | null
              if (bg) bg.style.opacity = '0'
              const arrow = el.querySelector('[data-arrow]') as HTMLElement | null
              if (arrow) { arrow.style.color = 'rgba(255,255,255,0.08)'; arrow.style.transform = 'none' }
              const title = el.querySelector('[data-title]') as HTMLElement | null
              if (title) title.style.color = 'var(--cream)'
            }}
          >
            <div
              data-row-bg
              className="absolute pointer-events-none transition-opacity duration-200"
              style={{
                inset: 0,
                left: '-52px',
                right: '-52px',
                background: 'rgba(201,100,66,0.04)',
                opacity: 0,
              }}
            />
            <div
              data-title
              className="font-serif italic font-bold leading-[1.2] relative z-10 transition-colors duration-200"
              style={{ fontSize: 24, color: 'var(--cream)' }}
            >
              {f.title.split('\n').map((line, i) => (
                <span key={i}>{line}{i === 0 && <br />}</span>
              ))}
            </div>
            <p
              className="font-sans text-[13px] leading-[1.8] max-w-[480px] relative z-10"
              style={{ color: 'var(--stone)' }}
            >
              {f.desc}
            </p>
            <div
              data-arrow
              className="text-[18px] relative z-10 flex-shrink-0 transition-all duration-200"
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
