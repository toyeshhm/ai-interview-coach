'use client'

import Link from 'next/link'

export default function Hero() {
  return (
    <section
      className="relative flex overflow-hidden grid-bg"
      style={{
        backgroundColor: 'var(--charcoal)',
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
            <Link
              href="/auth"
              className="font-sans font-bold text-[14px] text-white px-8 py-4 rounded-[5px] transition-colors"
              style={{ background: 'var(--coral)' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'var(--coral-hover)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'var(--coral)')}
            >
              Start practicing free
            </Link>
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
                  &ldquo;Walk me through how you&apos;d debug a cascading failure across a distributed payment system under active production load.&rdquo;
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
