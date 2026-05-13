import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin-auth'
import { createServerSupabase } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await request.json()
    const { name, issuer, date, credential_id, certification_url, display_order } = body
    if (!name || !issuer || !date) {
      return NextResponse.json({ error: 'name, issuer, and date are required' }, { status: 400 })
    }

    const supabase = createServerSupabase()
    // @ts-expect-error - insert payload matches certifications.Insert
    const { data, error } = await supabase.from('certifications').insert({
      name,
      issuer,
      date,
      credential_id: credential_id || null,
      certification_url: certification_url || null,
      display_order: Number(display_order) || 0,
    }).select().single()

    if (error) throw error
    return NextResponse.json({ success: true, data })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await request.json()
    const { id, name, issuer, date, credential_id, certification_url, display_order } = body
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const supabase = createServerSupabase()
    // @ts-expect-error - update payload matches certifications.Update
    const { data, error } = await supabase.from('certifications').update({
      ...(name !== undefined && { name }),
      ...(issuer !== undefined && { issuer }),
      ...(date !== undefined && { date }),
      ...(credential_id !== undefined && { credential_id: credential_id || null }),
      ...(certification_url !== undefined && { certification_url: certification_url || null }),
      ...(display_order !== undefined && { display_order: Number(display_order) || 0 }),
      updated_at: new Date().toISOString(),
    }).eq('id', id).select().single()

    if (error) throw error
    return NextResponse.json({ success: true, data })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const supabase = createServerSupabase()
    const { error } = await supabase.from('certifications').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
