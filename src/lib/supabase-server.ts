import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

/**
 * Server-only Supabase client with service role. Bypasses RLS.
 * Only use in API routes or server actions — never expose to the client.
 */
export function createServerSupabase() {
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin profile updates. Add it to .env.local (get it from Supabase Dashboard → Settings → API).')
  }
  return createClient<Database>(supabaseUrl, serviceRoleKey)
}
