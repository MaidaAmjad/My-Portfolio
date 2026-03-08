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

  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center animate-pulse">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </section>
    )
  }

  if (!quote) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-slate-600 dark:text-slate-400 italic">
            "The only way to do great work is to love what you do."
          </p>
          <p className="text-slate-500 dark:text-slate-500 mt-4">- Steve Jobs</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-slate-600 dark:text-slate-400 italic text-lg md:text-xl leading-relaxed">
          "{quote.content}"
        </p>
        <p className="text-slate-500 dark:text-slate-500 mt-6 text-base md:text-lg">
          — {quote.author}
        </p>
        
        {quote.tags && quote.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {quote.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default QuoteSection
