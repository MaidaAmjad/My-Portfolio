'use client'

import React, { useState, useEffect } from 'react'
import { ensureActiveQuote } from '@/services/quotes'

interface Quote {
  id: string
  content: string
  author: string
  tags: string[]
  created_at: string
  expires_at: string
  is_active: boolean
}

const QuoteSection = () => {
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadQuote = async () => {
      try {
        const activeQuote = await ensureActiveQuote()
        setQuote(activeQuote)
      } catch (error) {
        console.error('Error loading quote:', error)
      } finally {
        setLoading(false)
      }
    }
    loadQuote()
  }, [])

  const quoteText = quote?.content ?? 'The only way to do great work is to love what you do.'
  const quoteAuthor = quote?.author ?? 'Steve Jobs'

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-700 rounded w-3/4 mx-auto"></div>
            <div className="h-6 bg-slate-700 rounded w-1/2 mx-auto"></div>
          </div>
        ) : (
          <>
            <p className="italic text-lg md:text-xl leading-relaxed" style={{color: '#5048e5', textShadow: '0 0 18px #5048e5, 0 0 40px #5048e588'}}>
              &ldquo;{quoteText}&rdquo;
            </p>
            <p className="mt-6 text-base md:text-lg" style={{color: '#7c75eb', textShadow: '0 0 10px #5048e5aa'}}>
              — {quoteAuthor}
            </p>
          </>
        )}


      </div>
    </section>
  )
}

export default QuoteSection
