import { NextResponse } from 'next/server'
import { ensureActiveQuote } from '@/services/quotes'

export async function POST() {
  try {
    const quote = await ensureActiveQuote()
    return NextResponse.json({ success: true, quote })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const quote = await ensureActiveQuote()
    return NextResponse.json({ success: true, quote })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed' }, { status: 500 })
  }
}
