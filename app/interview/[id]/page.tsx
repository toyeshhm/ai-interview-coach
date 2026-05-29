import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import InterviewClient from '@/components/interview/InterviewClient'
import type { Session } from '@/types'

export default async function InterviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const { data: session } = await supabase
    .from('sessions')
    .select('*, questions(*, answers(*))')
    .eq('id', id)
    .eq('user_id', user.id)
    .order('order_index', { referencedTable: 'questions', ascending: true })
    .single()

  if (!session) redirect('/dashboard')
  if (session.status === 'completed') redirect(`/interview/${id}/results`)

  return <InterviewClient session={session as Session} />
}
