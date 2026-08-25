import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, email, subject, message } = body as {
    name: string
    email: string
    subject: string
    message: string
  }

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
  }

  const supabase = await createClient()

  // Rate limit: max 3 submissions per email per hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { count: recentCount } = await supabase
    .from('contact_messages')
    .select('*', { count: 'exact', head: true })
    .eq('email', email.trim())
    .gte('created_at', oneHourAgo)

  if ((recentCount ?? 0) >= 3) {
    return NextResponse.json(
      { error: 'Too many messages. Please try again later.' },
      { status: 429 }
    )
  }

  const { error } = await supabase
    .from('contact_messages')
    .insert({ name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim() })

  if (error) {
    console.error('[contact] insert failed:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
