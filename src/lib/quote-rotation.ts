import { createServerSupabase } from '@/lib/supabase-server'
import { fetchRandomQuote } from '@/services/quotes'
import type { Quote } from '@/types/database'

/** Start of today 00:00:00.000 UTC (ISO string for PostgREST). */
function utcDayStartIso(d = new Date()): string {
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${day}T00:00:00.000Z`
}

/** Next calendar day 00:00:00.000 UTC — quote expires then (removed on next refresh). */
function utcNextDayStartIso(d = new Date()): string {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1, 0, 0, 0, 0))
  return t.toISOString()
}

/**
 * Ensures exactly one quote row exists for the current UTC calendar day:
 * if none, deletes all older quotes in Supabase and inserts a new one.
 * Requires SUPABASE_SERVICE_ROLE_KEY (same as other admin APIs).
 */
export async function ensureActiveQuote(): Promise<Quote | null> {
  try {
    const supabase = createServerSupabase()
    const dayStart = utcDayStartIso()

    const { data: existing, error: selErr } = await supabase
      .from('quotes')
      .select('*')
      .gte('created_at', dayStart)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (selErr) throw selErr
    if (existing) return existing as Quote

    const { error: delErr } = await supabase.from('quotes').delete().gte('created_at', '1970-01-01T00:00:00.000Z')
    if (delErr) throw delErr

    const newQuote = await fetchRandomQuote()
    const expiresAt = utcNextDayStartIso()

    const { data: inserted, error: insErr } = await supabase
      .from('quotes')
      .insert({
        content: newQuote.content,
        author: newQuote.author,
        source: newQuote.source ?? null,
        is_active: true,
        expires_at: expiresAt,
      })
      .select()
      .single()

    if (insErr) throw insErr
    return inserted as Quote
  } catch (err) {
    console.error('ensureActiveQuote:', err)
    return null
  }
}
