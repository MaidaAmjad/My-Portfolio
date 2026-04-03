'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Experience } from '@/types/database'
import DataTable from '../components/DataTable'
import FormField from '../components/FormField'

export default function ExperienceManagement() {
  const [experience, setExperience] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchExperience()
  }, [])

  const fetchExperience = async () => {
    try {
      const { data, error } = await supabase
        .from('experience')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) throw error
      setExperience(data || [])
    } catch (error) {
      console.error('Error fetching experience:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const payload = {
      title: formData.get('title') as string,
      company: formData.get('company') as string,
      period: formData.get('period') as string,
      description: (formData.get('description') as string) || '',
      icon: (formData.get('icon') as string) || 'work',
      display_order: parseInt(formData.get('display_order') as string) || 0,
    }

    try {
      const url = '/api/admin/experience'
      if (editingExperience) {
        const res = await fetch(url, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingExperience.id, ...payload }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error || 'Update failed')
        setMessage('Experience updated successfully!')
      } else {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error || 'Create failed')
        setMessage('Experience created successfully!')
      }
      setShowForm(false)
      setEditingExperience(null)
      fetchExperience()
    } catch (error) {
      console.error('Error saving experience:', error)
      setMessage(error instanceof Error ? error.message : 'Failed to save experience')
    }
  }

  const handleEdit = (exp: Experience) => {
    setEditingExperience(exp)
    setShowForm(true)
  }

  const handleDelete = async (exp: Experience) => {
    if (!confirm('Are you sure you want to delete this experience?')) return

    try {
      const res = await fetch(`/api/admin/experience?id=${encodeURIComponent(exp.id)}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Delete failed')
      setMessage('Experience deleted successfully!')
      setExperience(experience.filter(e => e.id !== exp.id))
    } catch (error) {
      console.error('Error deleting experience:', error)
      setMessage('Failed to delete experience')
    }
  }

  const columns = [
    { key: 'title' as const, label: 'Title' },
    { key: 'company' as const, label: 'Company' },
    { key: 'period' as const, label: 'Period' },
    {
      key: 'description' as const,
      label: 'Description',
      render: (value: string | null) => (
        <span className="text-sm text-slate-900 dark:text-white line-clamp-2">{value || '—'}</span>
      )
    }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="border-b border-slate-200 dark:border-slate-700 pb-4">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {editingExperience ? 'Edit Experience' : 'Add New Experience'}
            </h2>
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditingExperience(null) }}
              className="text-slate-500 hover:text-slate-700 transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
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
                label="Title"
                name="title"
                value={editingExperience?.title ?? ''}
                onChange={(e) => editingExperience && setEditingExperience({ ...editingExperience, title: e.target.value })}
                required
              />
              <FormField
                label="Company"
                name="company"
                value={editingExperience?.company ?? ''}
                onChange={(e) => editingExperience && setEditingExperience({ ...editingExperience, company: e.target.value })}
                required
              />
            </div>

            <FormField
              label="Period"
              name="period"
              value={editingExperience?.period ?? ''}
              onChange={(e) => editingExperience && setEditingExperience({ ...editingExperience, period: e.target.value })}
              placeholder="e.g. 2020 – Present"
              required
            />

            <FormField
              label="Description"
              name="description"
              type="textarea"
              rows={4}
              value={editingExperience?.description ?? ''}
              onChange={(e) => editingExperience && setEditingExperience({ ...editingExperience, description: e.target.value })}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Icon (Material icon name)"
                name="icon"
                value={editingExperience?.icon ?? 'work'}
                onChange={(e) => editingExperience && setEditingExperience({ ...editingExperience, icon: e.target.value })}
                placeholder="work"
              />
              <FormField
                label="Display Order"
                name="display_order"
                type="number"
                value={String(editingExperience?.display_order ?? 0)}
                onChange={(e) => editingExperience && setEditingExperience({ ...editingExperience, display_order: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingExperience(null) }}
                className="px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                {editingExperience ? 'Update Experience' : 'Create Experience'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Experience Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center"
        >
          <span className="material-symbols-outlined mr-2">add</span>
          Add Experience
        </button>
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

      {experience.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 text-center">
          <div className="text-slate-500 dark:text-slate-400">
            <span className="material-symbols-outlined text-4xl mb-4">history</span>
            <p className="text-lg font-medium">No experience entries yet</p>
            <p className="text-sm mt-2">Add your first entry using the button above.</p>
          </div>
        </div>
      ) : (
        <DataTable
          data={experience}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={loading}
        />
      )}
    </div>
  )
}
