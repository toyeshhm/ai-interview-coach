'use client'

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
        {[
          { label: 'Privacy', href: '/privacy' },
          { label: 'Terms', href: '/terms' },
          { label: 'Contact', href: 'mailto:toyeshhm@gmail.com' },
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="font-sans text-[12px] transition-colors"
            style={{ color: 'var(--warm-mid)' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--stone)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--warm-mid)')}
          >
            {label}
          </a>
        ))}
      </div>

      <div className="font-sans text-[12px]" style={{ color: '#4a4540' }}>
        © 2026 Prep.AI
      </div>
    </footer>
  )
}
