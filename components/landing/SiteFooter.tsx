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
