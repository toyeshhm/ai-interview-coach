'use client'

import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer
      className="flex items-center justify-between px-13 py-6"
      style={{ background: 'var(--charcoal)', borderTop: '1px solid var(--border-dark)' }}
    >
      <div
        className="font-sans font-bold text-[12px] tracking-[0.06em] uppercase"
        style={{ color: 'var(--stone)' }}
      >
        Prep<span style={{ color: 'var(--coral)' }}>.</span>AI
      </div>

      <div className="flex gap-6">
        {[
          { label: 'Privacy', href: '/privacy' },
          { label: 'Terms', href: '/terms' },
          { label: 'Contact', href: '/contact' },
        ].map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className="font-sans text-[12px] transition-colors"
            style={{ color: 'var(--stone)' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--cream)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--stone)')}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="font-sans text-[12px]" style={{ color: 'var(--warm-mid)' }}>
        © 2026 Prep.AI
      </div>
    </footer>
  )
}
