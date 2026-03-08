'use client'

import React, { useState } from 'react'

const ADMIN_SETTINGS_SQL = `create table if not exists admin_settings (
  key text primary key,
  value text
);`

function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  minLength,
  autoComplete,
  required = true,
}: {
  id: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  minLength?: number
  autoComplete?: string
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
        placeholder={placeholder}
        minLength={minLength}
        autoComplete={autoComplete}
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

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSetupHint, setShowSetupHint] = useState(false)

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

    setLoading(true)
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })
      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        setMessage('Password changed successfully. You are still logged in.')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        const err = data.error || 'Failed to change password'
        setMessage(err)
        setShowSetupHint(typeof err === 'string' && err.includes('admin_settings'))
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 max-w-md">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Change Password</h2>

        {message && (
          <div
            className={`mb-4 p-4 rounded-lg ${
              message.includes('success')
                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="current" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Current password
            </label>
            <PasswordInput
              id="current"
              value={currentPassword}
              onChange={setCurrentPassword}
              autoComplete="current-password"
            />
          </div>
          <div>
            <label htmlFor="new" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              New password
            </label>
            <PasswordInput
              id="new"
              value={newPassword}
              onChange={setNewPassword}
              minLength={6}
              autoComplete="new-password"
            />
            <p className="text-xs text-slate-500 mt-1">At least 6 characters</p>
          </div>
          <div>
            <label htmlFor="confirm" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Confirm new password
            </label>
            <PasswordInput
              id="confirm"
              value={confirmPassword}
              onChange={setConfirmPassword}
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating…' : 'Change password'}
          </button>
        </form>
      </div>
    </div>
  )
}
