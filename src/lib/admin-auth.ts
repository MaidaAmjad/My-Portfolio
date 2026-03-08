import { cookies } from 'next/headers'

const FALLBACK_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

/** Get effective admin password: from DB (admin_settings) or env. */
export async function getEffectiveAdminPassword(): Promise<string> {
  try {
    const { createServerSupabase } = await import('@/lib/supabase-server')
    const supabase = createServerSupabase()
    const { data } = await supabase.from('admin_settings').select('value').eq('key', 'admin_password').maybeSingle()
    const row = data as { value: string } | null
    if (row?.value) return row.value
  } catch {
    // Table missing or env missing; use env fallback
  }
  return FALLBACK_PASSWORD
}

export async function verifyAdminAuth(_request: Request): Promise<boolean> {
  const cookieStore = await cookies()
  const authToken = cookieStore.get('admin-auth')
  if (!authToken?.value) return false
  const effective = await getEffectiveAdminPassword()
  return authToken.value === effective
}

/** Use in API routes / server code to check if current request is admin. */
export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies()
  const authToken = cookieStore.get('admin-auth')
  if (!authToken?.value) return false
  const effective = await getEffectiveAdminPassword()
  return authToken.value === effective
}

export async function setAdminAuth(password: string): Promise<boolean> {
  const effective = await getEffectiveAdminPassword()
  if (password !== effective) return false
  await setAdminCookie(password)
  return true
}

/** Set the admin auth cookie (e.g. after changing password). */
export async function setAdminCookie(value: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set('admin-auth', value, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 3600, // 1 hour
  })
}

export async function clearAdminAuth(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set('admin-auth', '', {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 0,
  })
}
