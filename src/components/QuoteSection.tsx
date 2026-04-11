'use client'

import React, { useState, useEffect } from 'react'
import { ensureActiveQuote } from '@/services/quotes'

const QuoteSection = () => {
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')

  useEffect(() => {
    ensureActiveQuote().then((q) => {
      if (q) {
        setContent(q.content)
        setAuthor(q.author)
      } else {
        setContent('The only way to do great work is to love what you do.')
        setAuthor('Steve Jobs')
      }
    })
  }, [])

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {content ? (
          <>
            <p className="italic text-lg md:text-xl leading-relaxed" style={{color: '#5048e5', textShadow: '0 0 18px #5048e5, 0 0 40px #5048e588'}}>
              &ldquo;{content}&rdquo;
            </p>
            <p className="mt-6 text-base md:text-lg" style={{color: '#7c75eb', textShadow: '0 0 10px #5048e5aa'}}>
              — {author}
            </p>
          </>
        ) : (
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-700 rounded w-3/4 mx-auto"></div>
            <div className="h-6 bg-slate-700 rounded w-1/2 mx-auto"></div>
          </div>
        )}

        <div className="mt-10">
          <a
            href={process.env.NEXT_PUBLIC_RESUME_URL || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white transition-all duration-300"
            style={{background: 'linear-gradient(135deg, #5048e5, #7c75eb)', boxShadow: '0 0 18px #5048e5, 0 0 40px #5048e588'}}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 30px #5048e5, 0 0 60px #5048e5bb')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 18px #5048e5, 0 0 40px #5048e588')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 16l-5-5 1.41-1.41L11 13.17V4h2v9.17l2.59-2.58L17 11l-5 5zm-7 4v-2h14v2H5z"/>
            </svg>
            Download Resume
          </a>
        </div>
      </div>
    </section>
  )
}

export default QuoteSection
