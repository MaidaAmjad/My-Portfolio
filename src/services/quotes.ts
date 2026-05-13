export interface QuoteResponse {
  content: string
  author: string
  source?: string
}

async function tryQuotable(): Promise<QuoteResponse | null> {
  try {
    const res = await fetch(
      'https://api.quotable.io/random?tags=technology,success,inspirational',
      { cache: 'no-store' }
    )
    if (!res.ok) return null
    const data = (await res.json()) as { content?: string; author?: string }
    if (!data.content || !data.author) return null
    return { content: data.content, author: data.author, source: 'quotable' }
  } catch {
    return null
  }
}

async function tryZenQuotes(): Promise<QuoteResponse | null> {
  try {
    const res = await fetch('https://zenquotes.io/api/random', { cache: 'no-store' })
    if (!res.ok) return null
    const data = (await res.json()) as { q?: string; a?: string }[]
    const row = Array.isArray(data) ? data[0] : null
    if (!row?.q) return null
    const author = String(row.a || 'Unknown')
      .replace(/[()]/g, '')
      .trim() || 'Unknown'
    return { content: row.q.trim(), author, source: 'zenquotes' }
  } catch {
    return null
  }
}

/** Fetches a random quote from a public API (no Supabase). Safe to import on the client. */
export async function fetchRandomQuote(): Promise<QuoteResponse> {
  const fromApi = (await tryQuotable()) ?? (await tryZenQuotes())
  if (fromApi) return fromApi

  const fallbacks: QuoteResponse[] = [
    { content: 'The only way to do great work is to love what you do.', author: 'Steve Jobs', source: 'fallback' },
    { content: 'In the middle of every difficulty lies opportunity.', author: 'Albert Einstein', source: 'fallback' },
    { content: 'First, solve the problem. Then, write the code.', author: 'John Johnson', source: 'fallback' },
    {
      content:
        'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
      author: 'Martin Fowler',
      source: 'fallback',
    },
    {
      content: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
      author: 'Winston Churchill',
      source: 'fallback',
    },
  ]
  return fallbacks[Math.floor(Math.random() * fallbacks.length)]
}
