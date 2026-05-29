import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ResultsSummary from '@/components/results/ResultsSummary'
import type { Session } from '@/types'

function overallScoreColor(score: number) {
  return score >= 7 ? '#7ec8a0' : score >= 5 ? '#f5c842' : '#e07070'
}

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const { data: session } = await supabase
    .from('sessions')
    .select('*, questions(*, answers(*))')
    .eq('id', id)
    .eq('user_id', user.id)
    .order('order_index', { referencedTable: 'questions', ascending: true })
    .single()

  if (!session) redirect('/dashboard')

  const overall = session.overall_score ?? 0
  const accent = overallScoreColor(overall)

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--charcoal)' }}>
      <header className="border-b px-8 py-12" style={{ borderColor: 'var(--border-dark)' }}>
        <div className="max-w-[680px] mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div className="font-sans font-bold text-[13px] tracking-[0.07em] uppercase" style={{ color: 'var(--cream)' }}>
              Prep<span style={{ color: 'var(--coral)' }}>.</span>AI
            </div>
            <Link href="/dashboard" className="font-sans text-[13px]" style={{ color: 'var(--stone)' }}>
              ← Dashboard
            </Link>
          </div>
          <div className="flex items-end gap-6">
            <div
              className="font-serif italic font-black leading-none tracking-[-0.04em]"
              style={{ fontSize: 96, color: accent, lineHeight: 0.9 }}
            >
              {overall.toFixed(1)}
            </div>
            <div className="mb-2">
              <div className="font-mono text-[10px] font-medium tracking-[0.1em] uppercase mb-1" style={{ color: '#4a4540' }}>
                Overall score / 10
              </div>
              <div className="font-serif italic font-bold leading-[1.05] tracking-[-0.02em]" style={{ fontSize: 28, color: 'var(--cream)' }}>
                Interview results.
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[680px] mx-auto px-8 py-12">
        <ResultsSummary session={session as Session} />
        <div className="flex gap-4 mt-12 pt-8" style={{ borderTop: '1px solid var(--border-dark)' }}>
          <Link
            href="/interview/new"
            className="font-sans font-bold text-[14px] text-white px-8 py-3.5 rounded-[5px] transition-colors"
            style={{ background: 'var(--coral)' }}
          >
            Practice again →
          </Link>
          <Link
            href="/dashboard"
            className="font-sans font-semibold text-[14px] px-8 py-3.5 rounded-[5px] transition-colors"
            style={{ color: 'var(--stone)', border: '1px solid var(--border-dark)' }}
          >
            Back to dashboard
          </Link>
        </div>
      </main>
    </div>
  )
}
