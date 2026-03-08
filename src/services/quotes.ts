import { supabase } from '@/lib/supabase'

interface QuoteResponse {
  _id: string
  content: string
  author: string
  authorSlug: string
  length: number
  tags: string[]
}

interface Quote {
  id: string
  content: string
  author: string
  tags: string[]
  created_at: string
  expires_at: string
  is_active: boolean
}

export async function fetchQuoteFromAPI(): Promise<QuoteResponse | null> {
  try {
    const response = await fetch('https://api.quotable.io/random')
    
    if (!response.ok) {
      console.error('Failed to fetch quote from API:', response.status)
      return null
    }

    const quote: QuoteResponse = await response.json()
    return quote
  } catch (error) {
    console.error('Error fetching quote from API:', error)
    return null
  }
}

export async function saveQuoteToDatabase(quoteData: QuoteResponse): Promise<boolean> {
  try {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days from now

    const { error } = await supabase
      .from('quotes')
      .insert({
        content: quoteData.content,
        author: quoteData.author,
        tags: quoteData.tags,
        expires_at: expiresAt.toISOString(),
        is_active: true
      })

    if (error) {
      console.error('Error saving quote to database:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error saving quote to database:', error)
    return false
  }
}

export async function getActiveQuote(): Promise<Quote | null> {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error fetching active quote:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error fetching active quote:', error)
    return null
  }
}

export async function fetchAndSaveNewQuote(): Promise<boolean> {
  try {
    // First, deactivate all existing quotes
    await supabase
      .from('quotes')
      .update({ is_active: false })
      .eq('is_active', true)

    // Fetch new quote from API
    const quoteData = await fetchQuoteFromAPI()
    
    if (!quoteData) {
      console.error('Failed to fetch quote from API')
      return false
    }

    // Save to database
    const saved = await saveQuoteToDatabase(quoteData)
    
    if (saved) {
      console.log('New quote saved successfully:', quoteData.content.substring(0, 50) + '...')
    }

    return saved
  } catch (error) {
    console.error('Error in fetchAndSaveNewQuote:', error)
    return false
  }
}

export async function cleanupExpiredQuotes(): Promise<void> {
  try {
    const { error } = await supabase
      .from('quotes')
      .delete()
      .lt('expires_at', new Date().toISOString())

    if (error) {
      console.error('Error cleaning up expired quotes:', error)
    } else {
      console.log('Expired quotes cleaned up successfully')
    }
  } catch (error) {
    console.error('Error cleaning up expired quotes:', error)
  }
}

export async function ensureActiveQuote(): Promise<Quote | null> {
  try {
    // First, try to get an active quote
    let quote = await getActiveQuote()

    // If no active quote exists, fetch a new one
    if (!quote) {
      console.log('No active quote found, fetching new one...')
      const success = await fetchAndSaveNewQuote()
      
      if (success) {
        // Try to get the newly saved quote
        quote = await getActiveQuote()
      }
    }

    return quote
  } catch (error) {
    console.error('Error ensuring active quote:', error)
    return null
  }
}
