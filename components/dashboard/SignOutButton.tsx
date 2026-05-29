'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignOutButton() {
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleSignOut}
      className="font-mono text-[11px] transition-colors"
      style={{ color: '#4a4540' }}
      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--stone)')}
      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#4a4540')}
    >
      Sign out
    </button>
  )
}
