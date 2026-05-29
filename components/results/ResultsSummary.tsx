import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Session, Question } from '@/types'

function ScoreRing({ score }: { score: number }) {
  const color = score >= 7 ? 'text-green-600' : score >= 5 ? 'text-yellow-600' : 'text-red-600'
  return (
    <div className="text-center py-6">
      <div className={`text-7xl font-bold ${color}`}>{score.toFixed(1)}</div>
      <div className="text-slate-500 text-lg mt-1">Overall Score / 10</div>
    </div>
  )
}

function questionScoreColor(score: number) {
  return score >= 7 ? 'text-green-600' : score >= 5 ? 'text-yellow-600' : 'text-red-600'
}

export default function ResultsSummary({ session }: { session: Session }) {
  const questions: Question[] = (session.questions ?? []).sort(
    (a, b) => a.order_index - b.order_index
  )
  const tips: string[] = session.tips ?? []

  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <ScoreRing score={session.overall_score ?? 0} />
        </CardContent>
      </Card>

      {tips.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top 3 Improvement Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {tips.map((tip, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="text-slate-700 text-sm leading-relaxed">{tip}</p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Question Breakdown</h2>
        {questions.map((q, i) => {
          const answer = q.answers?.[0]
          return (
            <Card key={q.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-700">
                  Q{i + 1}: {q.question_text}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {answer ? (
                  <div className="space-y-2">
                    <span className={`text-xl font-bold ${questionScoreColor(answer.score)}`}>
                      {answer.score}/10
                    </span>
                    <p className="text-slate-600 text-sm leading-relaxed">{answer.feedback}</p>
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm">No answer recorded.</p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
