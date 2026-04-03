'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Skill } from '@/types/database'
import DataTable, { type Column } from '../components/DataTable'
import FormField from '../components/FormField'

export default function SkillsManagement() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) throw error
      setSkills(data || [])
    } catch (error) {
      console.error('Error fetching skills:', error)
      setMessage('Failed to load skills')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const skillData = {
      name: formData.get('name') as string,
      icon: (formData.get('icon') as string) || '',
      proficiency_level: parseInt(formData.get('proficiency_level') as string) || 0,
      category: (formData.get('category') as string) || '',
      display_order: parseInt(formData.get('display_order') as string) || 0
    }

    try {
      const url = '/api/admin/skills'
      if (editingSkill) {
        const res = await fetch(url, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingSkill.id, ...skillData })
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error || 'Update failed')
        setMessage('Skill updated successfully!')
      } else {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(skillData)
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error || 'Create failed')
        setMessage('Skill created successfully!')
      }
      setShowForm(false)
      setEditingSkill(null)
      fetchSkills()
    } catch (error) {
      console.error('Error saving skill:', error)
      setMessage(error instanceof Error ? error.message : 'Failed to save skill')
    }
  }

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill)
    setShowForm(true)
  }

  const handleDelete = async (skill: Skill) => {
    if (!confirm('Are you sure you want to delete this skill?')) return

    try {
      const res = await fetch(`/api/admin/skills?id=${encodeURIComponent(skill.id)}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Delete failed')
      setMessage('Skill deleted successfully!')
      fetchSkills()
    } catch (error) {
      console.error('Error deleting skill:', error)
      setMessage(error instanceof Error ? error.message : 'Failed to delete skill')
    }
  }

  const columns: Column<Skill>[] = [
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { 
      key: 'proficiency_level', 
      label: 'Proficiency',
      render: (value: number) => (
        <div className="flex items-center">
          <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-2 mr-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${value}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium">{value}%</span>
        </div>
      )
    }
  ]

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {editingSkill ? 'Edit Skill' : 'Add New Skill'}
            </h2>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setEditingSkill(null)
              }}
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
                label="Name"
                name="name"
                value={editingSkill?.name || ''}
                onChange={(e) => editingSkill && setEditingSkill({ ...editingSkill, name: e.target.value })}
                required
              />

              <FormField
                label="Category"
                name="category"
                value={editingSkill?.category || ''}
                onChange={(e) => editingSkill && setEditingSkill({ ...editingSkill, category: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Icon"
                name="icon"
                value={editingSkill?.icon || ''}
                onChange={(e) => editingSkill && setEditingSkill({ ...editingSkill, icon: e.target.value })}
                placeholder="🐍"
              />

              <FormField
                label="Proficiency Level"
                name="proficiency_level"
                type="number"
                value={editingSkill?.proficiency_level || 0}
                onChange={(e) => editingSkill && setEditingSkill({ ...editingSkill, proficiency_level: parseInt(e.target.value) })}
                min="0"
                max="100"
                required
              />
            </div>

            <FormField
              label="Display Order"
              name="display_order"
              type="number"
              value={editingSkill?.display_order || 0}
              onChange={(e) => editingSkill && setEditingSkill({ ...editingSkill, display_order: parseInt(e.target.value) })}
              placeholder="0"
            />

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingSkill(null)
                }}
                className="px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                {editingSkill ? 'Update Skill' : 'Create Skill'}
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
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Skills Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center"
        >
          <span className="material-symbols-outlined mr-2">add</span>
          Add Skill
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

      <DataTable
        data={skills}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={loading}
      />
    </div>
  )
}
