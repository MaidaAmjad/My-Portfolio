'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

const DEFAULT_EMAIL = 'maidaamjad32@gmail.com'

const ADMIN_SETTINGS_SQL = `create table if not exists admin_settings (
  key text primary key,
  value text
);`

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState(DEFAULT_EMAIL)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [configured, setConfigured] = useState<boolean | null>(null)
  const [showSetupHint, setShowSetupHint] = useState(false)

  useEffect(() => {
    fetch('/api/admin/forgot-password')
      .then((r) => r.json())
      .then((data) => setConfigured(data.configured === true))
      .catch(() => setConfigured(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (configured === false) return
    setMessage('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setSent(true)
        setMessage(data.message || 'If that email is registered for admin access, you will receive a reset link shortly. Check your inbox.')
      } else {
        const err = data.error || 'Request failed. Try again or check ADMIN_EMAIL and RESEND_API_KEY in .env.local.'
        setMessage(err)
        setShowSetupHint(typeof err === 'string' && err.includes('admin_settings'))
      }
    } catch {
      setMessage('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Forgot password</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">Enter your admin email to receive a reset link</p>
          </div>

          {configured === false && (
            <div className="mb-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
              <p className="font-medium mb-1">Email reset not configured</p>
              <p className="text-sm mb-2">
                To send reset links, add <code className="bg-amber-100 dark:bg-amber-900/40 px-1 rounded">RESEND_API_KEY</code> to <code className="bg-amber-100 dark:bg-amber-900/40 px-1 rounded">.env.local</code> (get a key at{' '}
                <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">resend.com</a>). Optionally set <code className="bg-amber-100 dark:bg-amber-900/40 px-1 rounded">ADMIN_EMAIL</code> (default: maidaamjad32@gmail.com). Restart the dev server after changing env.
              </p>
            </div>
          )}

          {message && (
            <div
              className={`mb-4 p-4 rounded-lg ${
                sent ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
              }`}
            >
              {message}
            </div>
          )}

          {showSetupHint && (
            <div className="mb-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
              <p className="font-medium mb-2">Create the table in Supabase</p>
              <p className="text-sm mb-2">In Supabase Dashboard → SQL Editor, run:</p>
              <pre className="text-xs bg-white dark:bg-slate-800 p-3 rounded overflow-x-auto select-all">{ADMIN_SETTINGS_SQL}</pre>
              <button
                type="button"
                onClick={() => setShowSetupHint(false)}
                className="mt-2 text-sm text-amber-600 dark:text-amber-400 hover:underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-700 dark:text-white"
                  placeholder="maidaamjad32@gmail.com"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading || configured === false}
                className="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending…' : configured === false ? 'Configure RESEND first' : 'Send reset link'}
              </button>
            </form>
          ) : (
            <p className="text-slate-600 dark:text-slate-400 text-center">
              Check your inbox at <strong>{email}</strong>. The link expires in 1 hour.
            </p>
          )}

          <div className="mt-6 text-center space-y-2">
            <Link href="/admin/login" className="block text-primary hover:text-primary/80 text-sm font-medium">
              ← Back to login
            </Link>
            <Link href="/" className="block text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-sm">
              Back to portfolio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
