'use client'

import React, { useState, useMemo, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function PasswordInput({
  id,
  value,
  onChange,
  required,
}: {
  id: string
  value: string
  onChange: (v: string) => void
  required?: boolean
}) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 pr-11 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-700 dark:text-white"
        required={required}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 p-1"
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        )}
      </button>
    </div>
  )
}

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const tokenFromUrl = useMemo(() => searchParams.get('token') || '', [searchParams])
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    if (newPassword !== confirmPassword) {
      setMessage('New password and confirmation do not match.')
      return
    }
    if (newPassword.length < 6) {
      setMessage('New password must be at least 6 characters.')
      return
    }
    if (!tokenFromUrl) {
      setMessage('Missing reset token. Use the link from your email or request a new one.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenFromUrl, newPassword }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setMessage('Password updated. Redirecting to dashboard…')
        window.location.href = '/admin/dashboard'
      } else {
        setMessage(data.error || 'Failed to reset password')
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
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Set new password</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              {tokenFromUrl ? 'Choose a new password below.' : 'Open the reset link from your email to set a new password.'}
            </p>
          </div>

          {message && (
            <div
              className={`mb-4 p-4 rounded-lg ${
                message.includes('Redirecting') || message.includes('updated')
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
              }`}
            >
              {message}
            </div>
          )}

          {tokenFromUrl ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="new" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  New password
                </label>
                <PasswordInput id="new" value={newPassword} onChange={setNewPassword} required />
                <p className="text-xs text-slate-500 mt-1">At least 6 characters</p>
              </div>
              <div>
                <label htmlFor="confirm" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Confirm new password
                </label>
                <PasswordInput id="confirm" value={confirmPassword} onChange={setConfirmPassword} required />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating…' : 'Set new password'}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <Link
                href="/admin/forgot-password"
                className="text-primary hover:text-primary/80 font-medium"
              >
                Request a new reset link
              </Link>
            </div>
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="text-slate-400">Loading…</div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
