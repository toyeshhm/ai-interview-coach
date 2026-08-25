'use client'

import Link from 'next/link'

const NAV = [
  {
    heading: 'Product',
    links: [
      { label: 'How it Works', href: '/#how-it-works' },
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Pricing', href: '/#pricing', soon: true },
      { label: 'Changelog', href: '#', soon: true },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/#features' },
      { label: 'Blog', href: '#', soon: true },
      { label: 'Careers', href: '#', soon: true },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/privacy#cookies' },
    ],
  },
]


export default function SiteFooter() {
  return (
    <footer style={{ background: 'var(--charcoal)', borderTop: '1px solid var(--border-dark)' }}>
      <div className="max-w-6xl mx-auto px-8 py-16">

        {/* Main grid */}
        <div className="flex flex-col gap-12 md:flex-row md:gap-0">

          {/* Brand column */}
          <div className="md:w-[38%] md:pr-16 flex-shrink-0">
            <Link
              href="/"
              className="inline-block font-sans font-bold text-[14px] tracking-[0.08em] uppercase mb-4"
              style={{ color: 'var(--cream)' }}
            >
              Prep<span style={{ color: 'var(--coral)' }}>.</span>AI
            </Link>
            <p
              className="font-sans text-[13px] leading-[1.75] max-w-[280px]"
              style={{ color: 'var(--warm-mid)' }}
            >
              AI-powered mock interviews that give you real feedback — so you walk into every room ready.
            </p>

          </div>

          {/* Link columns */}
          <div className="flex flex-1 gap-8 md:gap-12">
            {NAV.map(({ heading, links }) => (
              <div key={heading} className="flex-1">
                <p
                  className="font-sans font-semibold text-[11px] tracking-[0.1em] uppercase mb-4"
                  style={{ color: 'var(--stone)' }}
                >
                  {heading}
                </p>
                <ul className="space-y-3">
                  {links.map(({ label, href, soon }) => (
                    <li key={label} className="flex items-center gap-2">
                      <Link
                        href={href}
                        className="font-sans text-[13px] transition-colors"
                        style={{ color: 'var(--warm-mid)' }}
                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--cream)')}
                        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--warm-mid)')}
                      >
                        {label}
                      </Link>
                      {soon && (
                        <span
                          className="font-mono text-[9px] tracking-[0.08em] uppercase px-1.5 py-0.5 rounded-sm"
                          style={{
                            color: 'var(--coral)',
                            background: 'rgba(201,100,66,0.12)',
                            border: '1px solid rgba(201,100,66,0.2)',
                          }}
                        >
                          Soon
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom bar */}
        <div
          className="mt-14 pt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderTop: '1px solid var(--border-dark)' }}
        >
          <p className="font-sans text-[12px]" style={{ color: '#4a4540' }}>
            © 2026 Prep.AI — All rights reserved.
          </p>
          <p className="font-sans text-[12px]" style={{ color: '#4a4540' }}>
            Made for job seekers everywhere.
          </p>
        </div>

      </div>
    </footer>
  )
}
