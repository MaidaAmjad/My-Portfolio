'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types/database'
import FormField from '../components/FormField'

export default function ProfileManagement() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [resumeUrl, setResumeUrl] = useState('')
  const [resumeSaving, setResumeSaving] = useState(false)
  const [resumeMessage, setResumeMessage] = useState('')

  useEffect(() => {
    fetchProfile()
    fetchResumeUrl()
  }, [])

  const fetchResumeUrl = async () => {
    const { data } = await supabase
      .from('admin_settings')
      .select('value')
      .eq('key', 'resume_url')
      .maybeSingle()
    if (data?.value) setResumeUrl(data.value)
  }

  const handleResumeSave = async () => {
    setResumeSaving(true)
    setResumeMessage('')
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'resume_url', value: resumeUrl }),
      })
      if (!res.ok) throw new Error('Failed to save')
      setResumeMessage('Resume URL saved!')
    } catch {
      setResumeMessage('Failed to save resume URL')
    } finally {
      setResumeSaving(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('id', { ascending: true })
        .limit(1)
        .maybeSingle()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
      setMessage('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setSaving(true)
    setMessage('')

    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: profile.id,
          name: profile.name,
          title: profile.title,
          bio: profile.bio,
          focus_area: profile.focus_area,
          location: profile.location,
          profile_image_url: profile.profile_image_url,
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        if (res.status === 503) {
          setMessage('Server setup required: add SUPABASE_SERVICE_ROLE_KEY to .env.local (Supabase Dashboard → Settings → API).')
          return
        }
        throw new Error(data.error || 'Update failed')
      }
      setMessage('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage(error instanceof Error ? error.message : 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: keyof Profile, value: string) => {
    if (profile) {
      setProfile({ ...profile, [field]: value })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
            <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Profile Management</h2>
        </div>

        {message && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.includes('success') 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Name"
              name="name"
              value={profile?.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
            
            <FormField
              label="Title"
              name="title"
              value={profile?.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </div>

          <FormField
            label="Bio"
            name="bio"
            type="textarea"
            rows={6}
            value={profile?.bio || ''}
            onChange={(e) => handleChange('bio', e.target.value)}
            placeholder="Tell us about yourself..."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Focus Area"
              name="focus_area"
              value={profile?.focus_area || ''}
              onChange={(e) => handleChange('focus_area', e.target.value)}
              placeholder="e.g., Large Language Models & RAG Systems"
            />
            
            <FormField
              label="Location"
              name="location"
              value={profile?.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="e.g., San Francisco, CA (Remote)"
            />
          </div>

          <FormField
            label="Profile Image URL"
            name="profile_image_url"
            type="url"
            value={profile?.profile_image_url || ''}
            onChange={(e) => handleChange('profile_image_url', e.target.value)}
            placeholder="https://example.com/image.jpg"
          />

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => fetchProfile()}
              className="px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Resume Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Resume</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Paste a direct download link to your resume (Google Drive, Dropbox, etc.). The "Download Resume" button on the portfolio will use this URL.
        </p>

        {resumeMessage && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            resumeMessage.includes('saved')
              ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
          }`}>
            {resumeMessage}
          </div>
        )}

        <div className="flex gap-3">
          <input
            type="url"
            value={resumeUrl}
            onChange={(e) => setResumeUrl(e.target.value)}
            placeholder="https://drive.google.com/uc?export=download&id=..."
            className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-700 dark:text-white text-sm"
          />
          <button
            onClick={handleResumeSave}
            disabled={resumeSaving}
            className="px-5 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 text-sm font-medium whitespace-nowrap"
          >
            {resumeSaving ? 'Saving...' : 'Save URL'}
          </button>
        </div>
      </div>
    </div>
  )
}
