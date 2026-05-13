import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createServerSupabase } from '@/lib/supabase-server'

/** Inbox for portfolio contact notifications (override with CONTACT_TO_EMAIL). */
const DEFAULT_NOTIFY_EMAIL = 'maidaamjad32@gmail.com'

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    if (!email || typeof email !== 'string' || !email.trim()) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const nameTrim = name.trim()
    const emailTrim = email.trim()
    const messageTrim = message.trim()

    const apiKey = process.env.RESEND_API_KEY?.trim()
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            'Contact email is not configured. Add RESEND_API_KEY in Vercel → Settings → Environment Variables (get a free key at https://resend.com ).',
        },
        { status: 503 }
      )
    }

    const supabase = createServerSupabase()

    const to = process.env.CONTACT_TO_EMAIL?.trim() || DEFAULT_NOTIFY_EMAIL
    const from =
      process.env.CONTACT_FROM_EMAIL?.trim() || 'Portfolio <onboarding@resend.dev>'

    const resend = new Resend(apiKey)
    const { error: sendErr } = await resend.emails.send({
      from,
      to: [to],
      replyTo: emailTrim,
      subject: `Portfolio message from ${nameTrim}`,
      html: `
          <p><strong>Name:</strong> ${escapeHtml(nameTrim)}</p>
          <p><strong>Email:</strong> ${escapeHtml(emailTrim)}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space:pre-wrap">${escapeHtml(messageTrim)}</p>
        `,
    })

    if (sendErr) {
      console.error('Resend error:', sendErr)
      const msg =
        typeof sendErr === 'object' && sendErr !== null && 'message' in sendErr
          ? String((sendErr as { message?: string }).message)
          : 'Failed to send email'
      return NextResponse.json({ error: msg }, { status: 502 })
    }

    // @ts-expect-error - insert payload matches messages.Insert
    const { error: dbError } = await supabase.from('messages').insert({
      name: nameTrim,
      email: emailTrim,
      message: messageTrim,
      status: 'unread',
    })

    if (dbError) {
      console.error('Contact form insert error (email was sent):', dbError)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    if (message.includes('SUPABASE_SERVICE_ROLE_KEY')) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 503 })
    }
    console.error('Contact API error:', err)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
