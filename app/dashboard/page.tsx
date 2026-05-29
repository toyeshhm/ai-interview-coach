import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import SessionCard from '@/components/dashboard/SessionCard'
import type { Session } from '@/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const { data: sessions } = await supabase
    .from('sessions')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--charcoal)' }}>
      {/* Top nav */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-13 h-16 border-b"
        style={{
          background: 'rgba(28,25,23,0.92)',
          backdropFilter: 'blur(14px)',
          borderColor: 'var(--border-dark)',
        }}
      >
        <div className="font-sans font-bold text-[13px] tracking-[0.07em] uppercase" style={{ color: 'var(--cream)' }}>
          Prep<span style={{ color: 'var(--coral)' }}>.</span>AI
        </div>
        <div className="flex items-center gap-6">
          <span className="font-mono text-[11px]" style={{ color: '#4a4540' }}>{user.email}</span>
          <Link
            href="/interview/new"
            className="font-sans font-bold text-[13px] text-white px-4 py-2 rounded-[5px] transition-colors"
            style={{ background: 'var(--coral)' }}
          >
            New interview
          </Link>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-[760px] mx-auto px-8 py-16">
        <div className="mb-12">
          <h1
            className="font-serif italic font-bold leading-[1.05] tracking-[-0.02em] mb-2"
            style={{ fontSize: 40, color: 'var(--cream)' }}
          >
            Your sessions.
          </h1>
          <p className="font-sans text-[13px]" style={{ color: 'var(--warm-mid)' }}>
            {sessions && sessions.length > 0
              ? `${sessions.length} session${sessions.length === 1 ? '' : 's'} completed`
              : 'No sessions yet'}
          </p>
        </div>

        {sessions && sessions.length > 0 ? (
          <div style={{ borderTop: '1px solid var(--border-dark)' }}>
            {sessions.map(session => (
              <SessionCard key={session.id} session={session as Session} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="font-serif italic font-bold mb-3 tracking-[-0.01em]" style={{ fontSize: 24, color: 'var(--stone)' }}>
              Nothing here yet.
            </p>
            <p className="font-sans text-[13px] mb-8" style={{ color: 'var(--warm-mid)' }}>
              Start a practice session to see your results here.
            </p>
            <Link
              href="/interview/new"
              className="font-sans font-bold text-[14px] text-white px-8 py-3 rounded-[5px] inline-block"
              style={{ background: 'var(--coral)' }}
            >
              Start your first interview →
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
