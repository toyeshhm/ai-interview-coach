import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { buttonVariants } from '@/components/ui/button'
import SessionCard from '@/components/dashboard/SessionCard'
import type { Session } from '@/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const { data: sessions } = await supabase
    .from('sessions')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Interviews</h1>
            <p className="text-slate-500 mt-1">{user.email}</p>
          </div>
          <Link href="/interview/new" className={buttonVariants()}>
            Start New Interview
          </Link>
        </div>
        {sessions && sessions.length > 0 ? (
          <div className="grid gap-3">
            {sessions.map(session => (
              <SessionCard key={session.id} session={session as Session} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400">
            <p className="text-lg font-medium">No interviews yet</p>
            <p className="mt-2 text-sm">Start your first mock interview to get AI-powered feedback.</p>
          </div>
        )}
      </div>
    </div>
  )
}
