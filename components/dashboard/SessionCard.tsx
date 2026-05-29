'use client'

import Link from 'next/link'
import type { Session } from '@/types'

function ScorePill({ score }: { score: number | null }) {
  if (score === null) {
    return (
      <span
        className="font-mono text-[10px] font-medium px-2.5 py-1 rounded-[3px]"
        style={{
          background: 'rgba(255,255,255,0.06)',
          color: 'var(--stone)',
          border: '1px solid var(--border-dark)',
        }}
      >
        In progress
      </span>
    )
  }
  const isHigh = score >= 7
  const isMid = score >= 5
  const styles = isHigh
    ? { color: '#7ec8a0', bg: 'rgba(126,200,160,0.1)', border: 'rgba(126,200,160,0.2)' }
    : isMid
    ? { color: '#f5c842', bg: 'rgba(245,200,66,0.1)', border: 'rgba(245,200,66,0.2)' }
    : { color: '#e07070', bg: 'rgba(224,112,112,0.1)', border: 'rgba(224,112,112,0.2)' }

  return (
    <span
      className="font-mono text-[11px] font-bold px-2.5 py-1 rounded-[3px]"
      style={{ color: styles.color, background: styles.bg, border: `1px solid ${styles.border}` }}
    >
      {score.toFixed(1)} / 10
    </span>
  )
}

export default function SessionCard({ session }: { session: Session }) {
  const href = session.status === 'completed'
    ? `/interview/${session.id}/results`
    : `/interview/${session.id}`

  const snippet = session.job_description.slice(0, 100)
  const date = new Date(session.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  return (
    <Link href={href} className="block group">
      <div
        className="flex items-center justify-between gap-6 py-5 px-0 transition-colors duration-150"
        style={{ borderBottom: '1px solid var(--border-dark)' }}
        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)')}
        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
      >
        <div className="flex-1 min-w-0">
          <p className="font-sans text-[14px] font-medium truncate mb-1" style={{ color: 'var(--cream)' }}>
            {snippet}…
          </p>
          <p className="font-mono text-[11px]" style={{ color: '#4a4540' }}>
            {date}
          </p>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <ScorePill score={session.overall_score} />
          <span className="font-sans text-[12px] transition-all duration-150 group-hover:translate-x-0.5" style={{ color: '#4a4540' }}>
            →
          </span>
        </div>
      </div>
    </Link>
  )
}
