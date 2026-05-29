import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { evaluateAnswer } from '@/lib/claude/evaluateAnswer'

export async function POST(
  request: NextRequest,
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

  const { questionId, answerText } = (await request.json()) as {
    questionId: string
    answerText: string
  }

  if (!answerText?.trim()) {
    return NextResponse.json({ error: 'Answer text is required' }, { status: 400 })
  }

  const { data: question } = await supabase
    .from('questions')
    .select('*, sessions!inner(job_description, user_id)')
    .eq('id', questionId)
    .eq('session_id', id)
    .single()

  if (!question || question.sessions.user_id !== user.id) {
    return NextResponse.json({ error: 'Question not found' }, { status: 404 })
  }

  let evaluation
  try {
    evaluation = await evaluateAnswer(
      question.sessions.job_description,
      question.question_text,
      answerText
    )
  } catch {
    return NextResponse.json({ error: 'Failed to evaluate answer' }, { status: 500 })
  }

  const { data: answer, error } = await supabase
    .from('answers')
    .insert({
      question_id: questionId,
      answer_text: answerText,
      score: evaluation.score,
      feedback: evaluation.feedback,
    })
    .select()
    .single()

  if (error || !answer) {
    return NextResponse.json({ error: 'Failed to save answer' }, { status: 500 })
  }

  return NextResponse.json({ score: answer.score, feedback: answer.feedback })
}
