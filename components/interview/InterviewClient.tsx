'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Textarea } from '@/components/ui/textarea'
import type { Session, Question } from '@/types'

interface AnswerResult {
  score: number
  feedback: string
}

export default function InterviewClient({ session }: { session: Session }) {
  const router = useRouter()
  const questions: Question[] = (session.questions ?? []).sort(
    (a, b) => a.order_index - b.order_index
  )
  const firstUnanswered = questions.findIndex(q => !q.answers || q.answers.length === 0)
  // -1 means all answered: resume at last question so user can proceed to results
  const initialIndex = firstUnanswered === -1 ? Math.max(0, questions.length - 1) : firstUnanswered
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [answerText, setAnswerText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [lastResult, setLastResult] = useState<AnswerResult | null>(null)
  const [completing, setCompleting] = useState(false)
  const [error, setError] = useState('')

  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1
  const progressPct = ((currentIndex + 1) / questions.length) * 100

  async function handleSubmitAnswer() {
    setSubmitting(true)
    setError('')
    const res = await fetch(`/api/interview/${session.id}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId: currentQuestion.id, answerText }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error ?? 'Failed to submit. Please try again.'); setSubmitting(false); return }
    setLastResult({ score: data.score, feedback: data.feedback })
    setSubmitting(false)
  }

  async function handleNext() {
    if (isLastQuestion) {
      setCompleting(true)
      const res = await fetch(`/api/interview/${session.id}/complete`, { method: 'POST' })
      if (res.ok) { router.push(`/interview/${session.id}/results`) }
      else { setError('Failed to complete interview. Please try again.'); setCompleting(false) }
      return
    }
    setCurrentIndex(i => i + 1)
    setAnswerText('')
    setLastResult(null)
    setError('')
  }

  const scoreColor = !lastResult
    ? '#7ec8a0'
    : lastResult.score >= 7
    ? '#7ec8a0'
    : lastResult.score >= 5
    ? '#f5c842'
    : '#e07070'

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--charcoal)' }}>
      {/* Top bar */}
      <header
        className="flex items-center justify-between px-10 h-16 flex-shrink-0 border-b"
        style={{ borderColor: 'var(--border-dark)' }}
      >
        <div className="font-sans font-bold text-[13px] tracking-[0.07em] uppercase" style={{ color: 'var(--cream)' }}>
          Prep<span style={{ color: 'var(--coral)' }}>.</span>AI
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[11px]" style={{ color: 'var(--stone)' }}>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <div className="w-32 h-[2px] rounded-full" style={{ background: 'var(--border-dark)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%`, background: 'var(--coral)' }}
            />
          </div>
        </div>
        <Link href="/dashboard" className="font-sans text-[12px]" style={{ color: '#4a4540' }}>
          Exit
        </Link>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        <div className="w-full max-w-[640px]">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-5" style={{ background: 'var(--coral)' }} />
            <span className="font-mono text-[10px] font-medium tracking-[0.1em] uppercase" style={{ color: 'var(--stone)' }}>
              Question {currentIndex + 1}
            </span>
          </div>

          <h2
            className="font-serif italic font-bold leading-[1.35] tracking-[-0.015em] text-cream mb-8"
            style={{ fontSize: 24 }}
          >
            {currentQuestion.question_text}
          </h2>

          {!lastResult && (
            <div className="space-y-4">
              <Textarea
                value={answerText}
                onChange={e => setAnswerText(e.target.value)}
                placeholder="Type your answer here…"
                className="h-40 resize-none font-sans text-[14px] leading-[1.7] rounded-[5px]"
                style={{ background: '#211e1a', border: '1px solid var(--border-dark)', color: 'var(--cream)' }}
                disabled={submitting}
              />
              {error && <p className="font-sans text-[13px]" style={{ color: '#e07070' }}>{error}</p>}
              <button
                onClick={handleSubmitAnswer}
                disabled={submitting || !answerText.trim()}
                className="w-full font-sans font-bold text-[14px] text-white py-4 rounded-[5px] transition-colors disabled:opacity-40"
                style={{ background: 'var(--coral)' }}
                onMouseEnter={e => { if (!submitting && answerText.trim()) (e.currentTarget as HTMLElement).style.background = 'var(--coral-hover)' }}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--coral)'}
              >
                {submitting ? 'Scoring your answer…' : 'Submit answer'}
              </button>
            </div>
          )}

          {lastResult && (
            <div
              className="rounded-[8px] p-6 space-y-5"
              style={{ background: '#211e1a', border: '1px solid var(--border-dark)' }}
            >
              <div className="flex items-center gap-5">
                <div
                  className="font-serif italic font-black leading-none tracking-[-0.03em]"
                  style={{ fontSize: 52, color: scoreColor }}
                >
                  {lastResult.score}
                </div>
                <div className="flex-1">
                  <div className="font-mono text-[10px] tracking-[0.08em] uppercase mb-2" style={{ color: '#4a4540' }}>
                    Score / 10
                  </div>
                  <div className="h-[3px] rounded-sm overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <div
                      className="h-full rounded-sm transition-all duration-700"
                      style={{ width: `${lastResult.score * 10}%`, background: scoreColor }}
                    />
                  </div>
                </div>
              </div>
              <p className="font-sans text-[14px] leading-[1.7]" style={{ color: 'var(--stone)' }}>
                {lastResult.feedback}
              </p>
              {error && <p className="font-sans text-[13px]" style={{ color: '#e07070' }}>{error}</p>}
              <button
                onClick={handleNext}
                disabled={completing}
                className="w-full font-sans font-bold text-[14px] text-white py-4 rounded-[5px] transition-colors disabled:opacity-50"
                style={{ background: 'var(--coral)' }}
                onMouseEnter={e => { if (!completing) (e.currentTarget as HTMLElement).style.background = 'var(--coral-hover)' }}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--coral)'}
              >
                {completing ? 'Finishing…' : isLastQuestion ? 'See results →' : 'Next question →'}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
