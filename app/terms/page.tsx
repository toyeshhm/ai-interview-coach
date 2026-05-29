import Link from 'next/link'

export const metadata = { title: 'Terms of Service — Prep.AI' }

export default function TermsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--charcoal)' }}>
      <header className="flex items-center justify-between px-13 h-16 border-b" style={{ borderColor: 'var(--border-dark)' }}>
        <Link href="/" className="font-sans font-bold text-[13px] tracking-[0.07em] uppercase" style={{ color: 'var(--cream)' }}>
          Prep<span style={{ color: 'var(--coral)' }}>.</span>AI
        </Link>
        <Link href="/" className="font-sans text-[13px]" style={{ color: 'var(--stone)' }}>← Back</Link>
      </header>
      <main className="max-w-[680px] mx-auto px-8 py-16">
        <h1 className="font-serif italic font-bold mb-2 tracking-[-0.02em]" style={{ fontSize: 40, color: 'var(--cream)' }}>
          Terms of Service
        </h1>
        <p className="font-mono text-[11px] mb-12" style={{ color: '#4a4540' }}>Last updated: May 2026</p>
        <div className="space-y-8 font-sans text-[14px] leading-[1.8]" style={{ color: 'var(--stone)' }}>
          <section>
            <h2 className="font-sans font-bold text-[16px] mb-3" style={{ color: 'var(--cream)' }}>Use of the service</h2>
            <p>Prep.AI is an AI-powered interview coaching tool. By creating an account, you agree to use the service for lawful purposes only. You are responsible for any content you submit, including resume text and job descriptions.</p>
          </section>
          <section>
            <h2 className="font-sans font-bold text-[16px] mb-3" style={{ color: 'var(--cream)' }}>No guarantees</h2>
            <p>Prep.AI provides AI-generated feedback and scores for practice purposes. We make no guarantee that using Prep.AI will result in job offers or improved interview performance. The AI feedback is educational and should not be taken as professional career advice.</p>
          </section>
          <section>
            <h2 className="font-sans font-bold text-[16px] mb-3" style={{ color: 'var(--cream)' }}>Accounts</h2>
            <p>You are responsible for keeping your account credentials secure. We reserve the right to terminate accounts that violate these terms.</p>
          </section>
          <section>
            <h2 className="font-sans font-bold text-[16px] mb-3" style={{ color: 'var(--cream)' }}>Limitation of liability</h2>
            <p>Prep.AI is provided "as is" without warranty of any kind. We are not liable for any damages arising from use of the service.</p>
          </section>
          <section>
            <h2 className="font-sans font-bold text-[16px] mb-3" style={{ color: 'var(--cream)' }}>Contact</h2>
            <p>Questions about these terms? Email us at <a href="mailto:toyeshhm@gmail.com" style={{ color: 'var(--coral)' }}>toyeshhm@gmail.com</a>.</p>
          </section>
        </div>
      </main>
    </div>
  )
}
