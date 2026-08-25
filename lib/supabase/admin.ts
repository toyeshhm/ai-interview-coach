import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Constructed lazily for the same reason as lib/stripe.ts: createClient throws
// on undefined url/key, and Next evaluates route modules at build time to
// collect page data — so building without the service-role key set would fail.
let client: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceRoleKey) {
      throw new Error(
        'NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set'
      )
    }
    client = createClient(url, serviceRoleKey)
  }
  return client
}
