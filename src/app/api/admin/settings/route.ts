import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin-auth'
import { createServerSupabase } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { key, value } = await request.json()
    if (!key) return NextResponse.json({ error: 'key required' }, { status: 400 })

    const supabase = createServerSupabase()
    const { error } = await supabase
      .from('admin_settings')
      .upsert({ key, value }, { onConflict: 'key' })

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
