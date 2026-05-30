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

const SOCIALS = [
  {
    label: 'Twitter / X',
    href: 'https://twitter.com',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.262 5.636 5.902-5.636Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
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
              className="font-sans text-[13px] leading-[1.75] mb-8 max-w-[280px]"
              style={{ color: 'var(--warm-mid)' }}
            >
              AI-powered mock interviews that give you real feedback — so you walk into every room ready.
            </p>

            {/* Social icons */}
            <div className="flex gap-3">
              {SOCIALS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center w-8 h-8 rounded-lg transition-all"
                  style={{ color: 'var(--warm-mid)', border: '1px solid var(--border-dark)' }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.color = 'var(--cream)'
                    el.style.borderColor = 'rgba(255,255,255,0.15)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.color = 'var(--warm-mid)'
                    el.style.borderColor = 'var(--border-dark)'
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
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
