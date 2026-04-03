import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = createServerSupabase()
    const { data } = await supabase
      .from('admin_settings')
      .select('value')
      .eq('key', 'resume_url')
      .single()

    const resumeUrl = data?.value

    if (!resumeUrl) {
      return NextResponse.json({ error: 'Resume not available' }, { status: 404 })
    }

    // Redirect to the actual file URL (Google Drive, Dropbox, direct link, etc.)
    return NextResponse.redirect(resumeUrl)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch resume' }, { status: 500 })
  }
}
