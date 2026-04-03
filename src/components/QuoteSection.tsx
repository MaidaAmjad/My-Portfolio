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

  const resumeButton = (
    <div className="mt-10">
      <a
        href="/api/resume"
        download
        className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white transition-all duration-300"
        style={{
          background: 'linear-gradient(135deg, #5048e5, #7c75eb)',
          boxShadow: '0 0 18px #5048e5, 0 0 40px #5048e588',
        }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 28px #5048e5, 0 0 60px #5048e5bb')}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 18px #5048e5, 0 0 40px #5048e588')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 16l-5-5 1.41-1.41L11 13.17V4h2v9.17l2.59-2.58L17 11l-5 5zm-7 4v-2h14v2H5z"/>
        </svg>
        Download Resume
      </a>
    </div>
  )

  if (!quote) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="italic" style={{color: '#5048e5', textShadow: '0 0 18px #5048e5, 0 0 40px #5048e588'}}>
            "The only way to do great work is to love what you do."
          </p>
          <p className="mt-4" style={{color: '#7c75eb', textShadow: '0 0 10px #5048e5aa'}}>- Steve Jobs</p>
          {resumeButton}
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <p className="italic text-lg md:text-xl leading-relaxed" style={{color: '#5048e5', textShadow: '0 0 18px #5048e5, 0 0 40px #5048e588'}}>
          "{quote.content}"
        </p>
        <p className="mt-6 text-base md:text-lg" style={{color: '#7c75eb', textShadow: '0 0 10px #5048e5aa'}}>
          — {quote.author}
        </p>

        {quote.tags && quote.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {quote.tags.map((tag, index) => (
              <span key={index} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
        {resumeButton}
      </div>
    </section>
  )
}

export default QuoteSection
