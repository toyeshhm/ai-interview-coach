import type { Session, Question } from '@/types'

function scoreAccentColor(score: number) {
  return score >= 7 ? '#7ec8a0' : score >= 5 ? '#f5c842' : '#e07070'
}

export default function ResultsSummary({ session }: { session: Session }) {
  const questions: Question[] = (session.questions ?? []).sort(
    (a, b) => a.order_index - b.order_index
  )
  const tips: string[] = session.tips ?? []

  return (
    <div>
      <div className="space-y-0" style={{ borderTop: '1px solid var(--border-dark)' }}>
        {questions.map((q, i) => {
          const answer = q.answers?.[0]
          const score = answer?.score ?? 0
          const accent = scoreAccentColor(score)
          return (
            <div key={q.id} className="py-8" style={{ borderBottom: '1px solid var(--border-dark)' }}>
              <div className="flex items-baseline gap-4 mb-4">
                <span className="font-mono text-[10px] font-medium tracking-[0.1em] uppercase flex-shrink-0" style={{ color: 'var(--stone)' }}>
                  Q{i + 1}
                </span>
                <p className="font-serif italic font-bold leading-[1.35] text-cream" style={{ fontSize: 18 }}>
                  {q.question_text}
                </p>
              </div>
              {answer ? (
                <div className="pl-9 space-y-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="font-serif italic font-black leading-none tracking-[-0.02em]"
                      style={{ fontSize: 36, color: accent }}
                    >
                      {score}
                    </div>
                    <div className="flex-1 max-w-[200px]">
                      <div className="h-[3px] rounded-sm overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                        <div className="h-full rounded-sm" style={{ width: `${score * 10}%`, background: accent }} />
                      </div>
                    </div>
                    <span className="font-mono text-[10px]" style={{ color: '#4a4540' }}>/ 10</span>
                  </div>
                  <p className="font-sans text-[14px] leading-[1.7]" style={{ color: 'var(--stone)' }}>
                    {answer.feedback}
                  </p>
                </div>
              ) : (
                <p className="pl-9 font-sans text-[13px]" style={{ color: '#4a4540' }}>No answer recorded.</p>
              )}
            </div>
          )
        })}
      </div>

      {tips.length > 0 && (
        <div className="mt-12 pt-8" style={{ borderTop: '1px solid var(--border-dark)' }}>
          <h2 className="font-serif italic font-bold mb-6 tracking-[-0.01em]" style={{ fontSize: 24, color: 'var(--cream)' }}>
            Top improvement tips.
          </h2>
          <ol className="space-y-5">
            {tips.map((tip, i) => (
              <li key={i} className="flex gap-4">
                <span
                  className="font-mono text-[11px] font-bold w-6 h-6 rounded-[3px] flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ color: 'var(--coral)', background: 'rgba(201,100,66,0.12)', border: '1px solid rgba(201,100,66,0.2)' }}
                >
                  {i + 1}
                </span>
                <p className="font-sans text-[14px] leading-[1.7]" style={{ color: 'var(--stone)' }}>{tip}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
