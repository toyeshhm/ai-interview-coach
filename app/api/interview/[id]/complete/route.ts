import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateTips } from '@/lib/claude/generateTips'
import type { QAPair } from '@/types'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: session } = await supabase
    .from('sessions')
    .select('*, questions(*, answers(*))')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  const allAnswers = (session.questions as any[]).flatMap((q: any) => q.answers)

  if (allAnswers.length === 0) {
    return NextResponse.json({ error: 'No answers recorded' }, { status: 400 })
  }

  const overallScore =
    allAnswers.reduce((sum: number, a: any) => sum + a.score, 0) / allAnswers.length

  const qaPairs: QAPair[] = (session.questions as any[]).map((q: any) => ({
    question: q.question_text,
    answer: q.answers[0]?.answer_text ?? '',
    score: q.answers[0]?.score ?? 0,
  }))

  let tips: string[]
  try {
    tips = await generateTips(session.job_description, qaPairs)
  } catch {
    tips = []
  }

  await supabase
    .from('sessions')
    .update({ status: 'completed', overall_score: overallScore, tips })
    .eq('id', id)

  return NextResponse.json({ overallScore, tips })
}
