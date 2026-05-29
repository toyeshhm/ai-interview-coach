import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { buttonVariants } from '@/components/ui/button'
import ResultsSummary from '@/components/results/ResultsSummary'
import type { Session } from '@/types'

export default async function ResultsPage({
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

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Interview Results</h1>
          <Link href="/dashboard" className={buttonVariants({ variant: 'outline' })}>
            ← Dashboard
          </Link>
        </div>
        <ResultsSummary session={session as Session} />
      </div>
    </div>
  )
}
