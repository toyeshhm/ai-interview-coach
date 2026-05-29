'use client'

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
        {['How it works', 'Features'].map(label => (
          <li key={label}>
            <a
              href={`#${label.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-[13px] font-medium transition-colors"
              style={{ color: 'var(--warm-mid)' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--stone)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--warm-mid)')}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2">
        <Link
          href="/auth?tab=login"
          className="text-[13px] font-medium px-4 py-2 rounded transition-colors"
          style={{ color: 'var(--stone)' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--cream)')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--stone)')}
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
