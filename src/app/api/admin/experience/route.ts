import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin-auth'
import { createServerSupabase } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await request.json()
    const { title, company, period, description, icon, display_order } = body
    if (!title || !company || !period) return NextResponse.json({ error: 'title, company, and period required' }, { status: 400 })

    const supabase = createServerSupabase()
    const { data, error } = await supabase.from('experience').insert({
      title,
      company,
      period,
      description: description || null,
      icon: icon || 'work',
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
    const { id, title, company, period, description, icon, display_order } = body
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const supabase = createServerSupabase()
    const { data, error } = await supabase.from('experience').update({
      ...(title !== undefined && { title }),
      ...(company !== undefined && { company }),
      ...(period !== undefined && { period }),
      ...(description !== undefined && { description: description || null }),
      ...(icon !== undefined && { icon: icon || 'work' }),
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
    const { error } = await supabase.from('experience').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
