import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { setAdminCookie } from '@/lib/admin-auth'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, newPassword } = body

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'Reset token is required' },
        { status: 400 }
      )
    }

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const supabase = createServerSupabase()
    const { data, error: fetchError } = await supabase.from('admin_settings').select('value').eq('key', 'password_reset').maybeSingle()
    const row = data as { value: string } | null

    if (fetchError || !row?.value) {
      return NextResponse.json(
        { error: 'Invalid or expired reset link. Request a new one from the login page.' },
        { status: 400 }
      )
    }

    let payload: { tokenHash: string; expiresAt: number; email: string }
    try {
      payload = JSON.parse(row.value)
    } catch {
      return NextResponse.json(
        { error: 'Invalid reset data. Request a new link.' },
        { status: 400 }
      )
    }

    if (Date.now() > payload.expiresAt) {
      await supabase.from('admin_settings').delete().eq('key', 'password_reset')
      return NextResponse.json(
        { error: 'This reset link has expired. Request a new one from the login page.' },
        { status: 400 }
      )
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
    if (tokenHash !== payload.tokenHash) {
      return NextResponse.json(
        { error: 'Invalid or expired reset link. Request a new one from the login page.' },
        { status: 400 }
      )
    }

    // @ts-expect-error - admin_settings table exists at runtime
    const { error: updateError } = await supabase.from('admin_settings').upsert({ key: 'admin_password', value: newPassword }, { onConflict: 'key' })

    if (updateError) {
      console.error('Reset password: failed to update', updateError)
      return NextResponse.json(
        { error: 'Failed to save new password. Ensure table admin_settings exists.' },
        { status: 500 }
      )
    }

    await supabase.from('admin_settings').delete().eq('key', 'password_reset')
    await setAdminCookie(newPassword)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Reset password error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Request failed' },
      { status: 500 }
    )
  }
}
