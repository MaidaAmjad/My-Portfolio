import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin-auth'
import { createServerSupabase } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await request.json()
    const { title, description, image_url, project_url, github_url, featured, display_order, tags } = body
    if (!title || !description) return NextResponse.json({ error: 'title and description required' }, { status: 400 })

    const supabase = createServerSupabase()
    // @ts-expect-error - insert payload matches projects.Insert
    const { data, error } = await supabase.from('projects').insert({
      title,
      description,
      image_url: image_url || null,
      project_url: project_url || null,
      github_url: github_url || null,
      featured: !!featured,
      display_order: Number(display_order) ?? 0,
    }).select().single()

    if (error) throw error

    if (tags && Array.isArray(tags) && tags.length > 0) {
      await supabase.from('project_tags').insert(
        tags.map((tag: string) => ({ project_id: data.id, tag }))
      )
    }

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
    const { id, title, description, image_url, project_url, github_url, featured, display_order, tags } = body
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const supabase = createServerSupabase()
    // @ts-expect-error - update payload matches projects.Update
    const { data, error } = await supabase.from('projects').update({
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(image_url !== undefined && { image_url: image_url || null }),
      ...(project_url !== undefined && { project_url: project_url || null }),
      ...(github_url !== undefined && { github_url: github_url || null }),
      ...(featured !== undefined && { featured: !!featured }),
      ...(display_order !== undefined && { display_order: Number(display_order) ?? 0 }),
      updated_at: new Date().toISOString(),
    }).eq('id', id).select().single()

    if (error) throw error

    if (tags !== undefined && Array.isArray(tags)) {
      await supabase.from('project_tags').delete().eq('project_id', id)
      if (tags.length > 0) {
        await supabase.from('project_tags').insert(
          tags.map((tag: string) => ({ project_id: id, tag }))
        )
      }
    }

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
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
