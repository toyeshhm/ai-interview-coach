import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateQuestions } from '@/lib/claude/generateQuestions'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { jobDescription, resumeText } = body as {
    jobDescription: string
    resumeText: string
  }

  if (!jobDescription?.trim() || !resumeText?.trim()) {
    return NextResponse.json(
      { error: 'Job description and resume are required' },
      { status: 400 }
    )
  }

  // --- Session limit gate ---
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  if (profile?.plan !== 'pro') {
    const { count } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if ((count ?? 0) >= 5) {
      return NextResponse.json({ error: 'session_limit_reached' }, { status: 403 })
    }
  }
  // --- End gate ---

  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .insert({
      user_id: user.id,
      job_description: jobDescription,
      resume_text: resumeText,
    })
    .select()
    .single()

  if (sessionError || !session) {
    console.error('[create] session insert failed:', sessionError)
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
  }

  let questions
  try {
    questions = await generateQuestions(jobDescription, resumeText)
  } catch (err) {
    console.error('[create] generateQuestions failed:', err)
    await supabase.from('sessions').delete().eq('id', session.id)
    return NextResponse.json({ error: 'Failed to generate questions' }, { status: 500 })
  }

  const { error: questionsError } = await supabase
    .from('questions')
    .insert(questions.map(q => ({ session_id: session.id, ...q })))

  if (questionsError) {
    await supabase.from('sessions').delete().eq('id', session.id)
    return NextResponse.json({ error: 'Failed to save questions' }, { status: 500 })
  }

  return NextResponse.json({ sessionId: session.id })
}
