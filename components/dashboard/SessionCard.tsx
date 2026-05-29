import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import type { Session } from '@/types'

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) {
    return (
      <span className="px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-600">
        In Progress
      </span>
    )
  }
  const color =
    score >= 7
      ? 'bg-green-100 text-green-700'
      : score >= 5
      ? 'bg-yellow-100 text-yellow-700'
      : 'bg-red-100 text-red-700'
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>
      {score.toFixed(1)} / 10
    </span>
  )
}

export default function SessionCard({ session }: { session: Session }) {
  const href =
    session.status === 'completed'
      ? `/interview/${session.id}/results`
      : `/interview/${session.id}`

  const snippet = session.job_description.slice(0, 90)

  return (
    <Link href={href}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-5 flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-900 truncate">{snippet}…</p>
            <p className="text-sm text-slate-500 mt-1">
              {new Date(session.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
          <ScoreBadge score={session.overall_score} />
        </CardContent>
      </Card>
    </Link>
  )
}
