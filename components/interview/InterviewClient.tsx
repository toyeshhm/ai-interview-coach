'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
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
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answerText, setAnswerText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [lastResult, setLastResult] = useState<AnswerResult | null>(null)
  const [completing, setCompleting] = useState(false)
  const [error, setError] = useState('')

  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1
  const progress = (currentIndex / questions.length) * 100

  async function handleSubmitAnswer() {
    setSubmitting(true)
    setError('')

    const res = await fetch(`/api/interview/${session.id}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionId: currentQuestion.id,
        answerText,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? 'Failed to submit. Please try again.')
      setSubmitting(false)
      return
    }

    setLastResult({ score: data.score, feedback: data.feedback })
    setSubmitting(false)
  }

  async function handleNext() {
    if (isLastQuestion) {
      setCompleting(true)
      const res = await fetch(`/api/interview/${session.id}/complete`, {
        method: 'POST',
      })
      if (res.ok) {
        router.push(`/interview/${session.id}/results`)
      } else {
        setError('Failed to complete interview. Please try again.')
        setCompleting(false)
      }
      return
    }
    setCurrentIndex(i => i + 1)
    setAnswerText('')
    setLastResult(null)
    setError('')
  }

  const scoreColor =
    lastResult && lastResult.score >= 7
      ? 'text-green-600'
      : lastResult && lastResult.score >= 5
      ? 'text-yellow-600'
      : 'text-red-600'

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-6">
          <div className="flex justify-between text-sm text-slate-500 mb-2">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-800 leading-relaxed">
              {currentQuestion.question_text}
            </CardTitle>
          </CardHeader>
          {!lastResult && (
            <CardContent className="space-y-4">
              <Textarea
                value={answerText}
                onChange={e => setAnswerText(e.target.value)}
                placeholder="Type your answer here..."
                className="h-36 resize-none"
                disabled={submitting}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button
                onClick={handleSubmitAnswer}
                disabled={submitting || !answerText.trim()}
                className="w-full"
              >
                {submitting ? 'Evaluating...' : 'Submit Answer'}
              </Button>
            </CardContent>
          )}
        </Card>

        {lastResult && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center gap-3">
                <span className={`text-3xl font-bold ${scoreColor}`}>
                  {lastResult.score}/10
                </span>
                <div className="flex-1 bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${lastResult.score * 10}%` }}
                  />
                </div>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">{lastResult.feedback}</p>
              <Button
                onClick={handleNext}
                className="w-full"
                disabled={completing}
              >
                {completing
                  ? 'Finishing...'
                  : isLastQuestion
                  ? 'See Results →'
                  : 'Next Question →'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
