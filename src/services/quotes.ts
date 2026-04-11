import { supabase } from '@/lib/supabase'

interface QuoteResponse {
  content: string
  author: string
}

async function fetchRandomQuote(): Promise<QuoteResponse> {
  try {
    const res = await fetch('https://api.quotable.io/random?tags=technology,success,inspirational', { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      return { content: data.content, author: data.author }
    }
  } catch {
    // fall through to fallback
  }
  const fallbacks = [
    { content: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
    { content: 'In the middle of every difficulty lies opportunity.', author: 'Albert Einstein' },
    { content: 'First, solve the problem. Then, write the code.', author: 'John Johnson' },
    { content: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.', author: 'Martin Fowler' },
    { content: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill' },
  ]
  return fallbacks[Math.floor(Math.random() * fallbacks.length)]
}

export async function ensureActiveQuote() {
  try {
    const today = new Date().toISOString().split('T')[0] // "YYYY-MM-DD"

    // Check if we already have a quote created today
    const { data: existing } = await supabase
      .from('quotes')
      .select('*')
      .gte('created_at', `${today}T00:00:00.000Z`)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (existing) return existing

    // No quote for today — delete all old quotes, insert a fresh one
    await supabase.from('quotes').delete().lt('created_at', `${today}T00:00:00.000Z`)

    const newQuote = await fetchRandomQuote()

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const { data: inserted } = await supabase
      .from('quotes')
      .insert({
        content: newQuote.content,
        author: newQuote.author,
        is_active: true,
        expires_at: tomorrow.toISOString(),
      })
      .select()
      .single()

    return inserted
  } catch (error) {
    console.error('Error ensuring active quote:', error)
    return null
  }
}
