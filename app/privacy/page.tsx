import Link from 'next/link'

export const metadata = { title: 'Privacy Policy — Prep.AI' }

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="font-mono text-[11px] mb-12" style={{ color: '#4a4540' }}>Last updated: May 2026</p>
        <div className="space-y-8 font-sans text-[14px] leading-[1.8]" style={{ color: 'var(--stone)' }}>
          <section>
            <h2 className="font-sans font-bold text-[16px] mb-3" style={{ color: 'var(--cream)' }}>What we collect</h2>
            <p>We collect your email address when you create an account, and the job descriptions and resume text you submit during interview sessions. Session data (questions, answers, scores) is stored to power your session history.</p>
          </section>
          <section>
            <h2 className="font-sans font-bold text-[16px] mb-3" style={{ color: 'var(--cream)' }}>How we use it</h2>
            <p>Your data is used solely to provide the interview coaching service. Resume and job description text is sent to the Gemini API to generate questions and evaluate answers. We do not sell or share your data with third parties for marketing purposes.</p>
          </section>
          <section>
            <h2 className="font-sans font-bold text-[16px] mb-3" style={{ color: 'var(--cream)' }}>Data storage</h2>
            <p>Your account and session data is stored in Supabase, a managed Postgres database. Authentication is handled by Supabase Auth. Data is stored in the United States.</p>
          </section>
          <section>
            <h2 className="font-sans font-bold text-[16px] mb-3" style={{ color: 'var(--cream)' }}>Your rights</h2>
            <p>You can delete your account and all associated data at any time by contacting us at <a href="mailto:toyeshhm@gmail.com" style={{ color: 'var(--coral)' }}>toyeshhm@gmail.com</a>.</p>
          </section>
          <section id="cookies">
            <h2 className="font-sans font-bold text-[16px] mb-3" style={{ color: 'var(--cream)' }}>Cookies</h2>
            <p>We use essential cookies only — a single session cookie issued by Supabase Auth to keep you signed in. We do not use tracking, advertising, or analytics cookies.</p>
          </section>
          <section>
            <h2 className="font-sans font-bold text-[16px] mb-3" style={{ color: 'var(--cream)' }}>Contact</h2>
            <p>Questions? Reach us at <a href="mailto:toyeshhm@gmail.com" style={{ color: 'var(--coral)' }}>toyeshhm@gmail.com</a>.</p>
          </section>
        </div>
      </main>
    </div>
  )
}
