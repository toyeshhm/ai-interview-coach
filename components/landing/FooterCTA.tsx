'use client'

import Link from 'next/link'

export default function FooterCTA() {
  return (
    <section
      className="grid-bg relative py-30 px-13 flex items-center justify-between gap-12"
      style={{
        backgroundColor: 'var(--charcoal)',
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
        <div className="font-sans text-[12px] text-center" style={{ color: 'var(--stone)' }}>
          No credit card · Takes 2 minutes
        </div>
      </div>
    </section>
  )
}
