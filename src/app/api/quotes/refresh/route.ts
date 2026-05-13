import { NextResponse } from 'next/server'
import { ensureActiveQuote } from '@/lib/quote-rotation'

export async function POST() {
  try {
    const quote = await ensureActiveQuote()
    return NextResponse.json({ success: !!quote, quote })
  } catch (error) {
    return NextResponse.json({ success: false, quote: null, message: 'Failed' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const quote = await ensureActiveQuote()
    return NextResponse.json({ success: !!quote, quote })
  } catch (error) {
    return NextResponse.json({ success: false, quote: null, message: 'Failed' }, { status: 500 })
  }
}
