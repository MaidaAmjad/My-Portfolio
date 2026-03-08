import { NextRequest, NextResponse } from 'next/server'
import { isAdmin, setAdminCookie, getEffectiveAdminPassword } from '@/lib/admin-auth'
import { createServerSupabase } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      )
    }

    const effective = await getEffectiveAdminPassword()
    if (currentPassword !== effective) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const supabase = createServerSupabase()
    const { error } = await supabase
      .from('admin_settings')
      .upsert({ key: 'admin_password', value: newPassword }, { onConflict: 'key' })

    if (error) {
      console.error('Change password DB error:', error)
      return NextResponse.json(
        { error: 'Failed to save password. Ensure table admin_settings exists (key text primary key, value text).' },
        { status: 500 }
      )
    }

    await setAdminCookie(newPassword)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Change password error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to change password' },
      { status: 500 }
    )
  }
}
