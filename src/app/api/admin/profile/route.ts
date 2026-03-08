import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin-auth'
import { createServerSupabase } from '@/lib/supabase-server'

export async function PATCH(request: NextRequest) {
  try {
    const ok = await isAdmin()
    if (!ok) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, name, title, bio, focus_area, location, profile_image_url } = body

    if (!id || typeof name !== 'string' || typeof title !== 'string') {
      return NextResponse.json(
        { error: 'id, name, and title are required' },
        { status: 400 }
      )
    }

    const supabase = createServerSupabase()

    const { data, error } = await supabase
      .from('profiles')
      .update({
        name: name ?? '',
        title: title ?? '',
        bio: bio ?? null,
        focus_area: focus_area ?? null,
        location: location ?? null,
        profile_image_url: profile_image_url ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Admin profile update error:', error)
      return NextResponse.json(
        { error: error.message || 'Update failed' },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Profile not found or update had no effect' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, profile: data })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    if (message.includes('SUPABASE_SERVICE_ROLE_KEY')) {
      return NextResponse.json(
        { error: 'Server misconfiguration: add SUPABASE_SERVICE_ROLE_KEY to .env.local' },
        { status: 503 }
      )
    }
    console.error('Admin profile API error:', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
