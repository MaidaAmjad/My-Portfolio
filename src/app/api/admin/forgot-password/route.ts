import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { Resend } from 'resend'
import crypto from 'crypto'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'maidaamjad32@gmail.com'
const RESEND_API_KEY = process.env.RESEND_API_KEY

/** Client can call this to know if reset email is configured (no secrets exposed). */
export async function GET() {
  const configured = Boolean(RESEND_API_KEY)
  return Response.json({ configured })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()
    if (normalizedEmail !== ADMIN_EMAIL.toLowerCase()) {
      // Don't reveal whether the email exists; same message either way
      return NextResponse.json({
        success: true,
        message: 'If that email is registered for admin access, you will receive a reset link shortly.',
      })
    }

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set; cannot send reset email.')
      return NextResponse.json(
        {
          error: 'Email reset is not set up yet. Add RESEND_API_KEY to .env.local (get a key at resend.com), then restart the dev server.',
        },
        { status: 503 }
      )
    }

    const supabase = createServerSupabase()
    const { data: existing } = await supabase.from('admin_settings').select('value').eq('key', 'password_reset').maybeSingle()

    const token = crypto.randomBytes(32).toString('hex')
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
    const expiresAt = Date.now() + 60 * 60 * 1000 // 1 hour

    // @ts-expect-error - admin_settings table exists at runtime
    const { error: upsertError } = await supabase.from('admin_settings').upsert(
      { key: 'password_reset', value: JSON.stringify({ tokenHash, expiresAt, email: normalizedEmail }) },
      { onConflict: 'key' }
    )

    if (upsertError) {
      console.error('Forgot password: failed to store token', upsertError)
      return NextResponse.json(
        { error: 'Failed to create reset link. Ensure table admin_settings exists (key text primary key, value text).' },
        { status: 500 }
      )
    }

    let baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (request.headers.get('x-forwarded-host')
        ? `https://${request.headers.get('x-forwarded-host')}`
        : request.nextUrl.origin)
    // Use http for localhost so reset links work in local dev (no SSL)
    const host = baseUrl.replace(/^https?:\/\//, '').split('/')[0]
    if (host.startsWith('localhost') || host.startsWith('127.0.0.1')) {
      baseUrl = `http://${host}`
    }
    const resetUrl = `${baseUrl}/admin/reset-password?token=${encodeURIComponent(token)}`

    const resend = new Resend(RESEND_API_KEY)
    const { error: sendError } = await resend.emails.send({
      from: 'Portfolio Admin <onboarding@resend.dev>',
      to: normalizedEmail,
      subject: 'Reset your admin password',
      html: `
        <p>You requested a password reset for the portfolio admin dashboard.</p>
        <p><a href="${resetUrl}">Reset password</a></p>
        <p>This link expires in 1 hour. If you didn't request this, ignore this email.</p>
      `,
    })

    if (sendError) {
      console.error('Resend error:', sendError)
      return NextResponse.json(
        { error: 'Failed to send reset email. Check RESEND_API_KEY and sender domain.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'If that email is registered for admin access, you will receive a reset link shortly.',
    })
  } catch (err) {
    console.error('Forgot password error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Request failed' },
      { status: 500 }
    )
  }
}
