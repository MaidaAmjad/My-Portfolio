import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin-auth'
import { createServerSupabase } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await request.json()
    const { name, icon, proficiency_level, category, display_order } = body
    if (!name || proficiency_level === undefined) return NextResponse.json({ error: 'name and proficiency_level required' }, { status: 400 })

    const supabase = createServerSupabase()
    const { data, error } = await supabase.from('skills').insert({
      name,
      icon: icon || null,
      proficiency_level: Number(proficiency_level) ?? 0,
      category: category || null,
      display_order: Number(display_order) ?? 0,
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
    const { id, name, icon, proficiency_level, category, display_order } = body
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const supabase = createServerSupabase()
    const { data, error } = await supabase.from('skills').update({
      ...(name !== undefined && { name }),
      ...(icon !== undefined && { icon: icon || null }),
      ...(proficiency_level !== undefined && { proficiency_level: Number(proficiency_level) ?? 0 }),
      ...(category !== undefined && { category: category || null }),
      ...(display_order !== undefined && { display_order: Number(display_order) ?? 0 }),
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
    const { error } = await supabase.from('skills').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
