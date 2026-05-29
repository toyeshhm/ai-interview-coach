import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import InterviewSetupForm from '@/components/interview/InterviewSetupForm'

export default async function NewInterviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--charcoal)' }}>
      <header
        className="flex items-center justify-between px-13 h-16 border-b"
        style={{ background: 'rgba(28,25,23,0.92)', borderColor: 'var(--border-dark)' }}
      >
        <div className="font-sans font-bold text-[13px] tracking-[0.07em] uppercase" style={{ color: 'var(--cream)' }}>
          Prep<span style={{ color: 'var(--coral)' }}>.</span>AI
        </div>
        <Link href="/dashboard" className="font-sans text-[13px]" style={{ color: 'var(--stone)' }}>
          ← Dashboard
        </Link>
      </header>

      <main className="max-w-[680px] mx-auto px-8 py-16">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-6" style={{ background: 'var(--coral)' }} />
            <span className="font-mono text-[11px] tracking-[0.1em] uppercase" style={{ color: '#5a5450' }}>
              New session
            </span>
          </div>
          <h1 className="font-serif italic font-bold leading-[1.0] tracking-[-0.025em] text-cream mb-3" style={{ fontSize: 44 }}>
            Set up your interview.
          </h1>
          <p className="font-sans text-[14px] leading-[1.7]" style={{ color: 'var(--stone)' }}>
            Paste the job description and your resume below. The AI will generate tailored questions for the role.
          </p>
        </div>
        <InterviewSetupForm />
      </main>
    </div>
  )
}
