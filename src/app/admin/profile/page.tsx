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
    </div>
  )
}
