'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { ProjectWithTags } from '@/types/database'
import DataTable from '../components/DataTable'
import FormField from '../components/FormField'

export default function ProjectsManagement() {
  const [projects, setProjects] = useState<ProjectWithTags[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProject, setEditingProject] = useState<ProjectWithTags | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_tags (
            tag
          )
        `)
        .order('display_order', { ascending: true })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
      setMessage('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const projectData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      image_url: (formData.get('image_url') as string) || '',
      project_url: (formData.get('project_url') as string) || '',
      github_url: (formData.get('github_url') as string) || '',
      featured: formData.get('featured') === 'on',
      display_order: parseInt(formData.get('display_order') as string) || 0
    }

    try {
      const url = '/api/admin/projects'
      if (editingProject) {
        const res = await fetch(url, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingProject.id, ...projectData })
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error || 'Update failed')
        setMessage('Project updated successfully!')
      } else {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData)
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error || 'Create failed')
        setMessage('Project created successfully!')
      }
      setShowForm(false)
      setEditingProject(null)
      fetchProjects()
    } catch (error) {
      console.error('Error saving project:', error)
      setMessage(error instanceof Error ? error.message : 'Failed to save project')
    }
  }

  const handleEdit = (project: ProjectWithTags) => {
    setEditingProject(project)
    setShowForm(true)
  }

  const handleDelete = async (project: ProjectWithTags) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const res = await fetch(`/api/admin/projects?id=${encodeURIComponent(project.id)}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Delete failed')
      setMessage('Project deleted successfully!')
      fetchProjects()
    } catch (error) {
      console.error('Error deleting project:', error)
      setMessage(error instanceof Error ? error.message : 'Failed to delete project')
    }
  }

  const columns = [
    {
      key: 'title',
      label: 'Title'
    },
    {
      key: 'description',
      label: 'Description',
      render: (value: string) => (
        <span className="text-sm text-slate-900 dark:text-white line-clamp-2">
          {value}
        </span>
      )
    },
    {
      key: 'featured',
      label: 'Featured',
      render: (value: boolean) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
            : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-400'
        }`}>
          {value ? 'Featured' : 'Regular'}
        </span>
      )
    }
  ]

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </h2>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setEditingProject(null)
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
            <FormField
              label="Title"
              name="title"
              value={editingProject?.title || ''}
              onChange={(e) => setEditingProject({...editingProject, title: e.target.value})}
              required
            />

            <FormField
              label="Description"
              name="description"
              type="textarea"
              rows={4}
              value={editingProject?.description || ''}
              onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Image URL"
                name="image_url"
                type="url"
                value={editingProject?.image_url || ''}
                onChange={(e) => setEditingProject({...editingProject, image_url: e.target.value})}
              />

              <FormField
                label="Project URL"
                name="project_url"
                type="url"
                value={editingProject?.project_url || ''}
                onChange={(e) => setEditingProject({...editingProject, project_url: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="GitHub URL"
                name="github_url"
                type="url"
                value={editingProject?.github_url || ''}
                onChange={(e) => setEditingProject({...editingProject, github_url: e.target.value})}
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Featured Project
                </label>
                <select
                  name="featured"
                  value={editingProject?.featured ? 'on' : 'off'}
                  onChange={(e) => setEditingProject({...editingProject, featured: e.target.value === 'on'})}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-700 dark:text-white"
                >
                  <option value="on">Yes</option>
                  <option value="off">No</option>
                </select>
              </div>
            </div>

            <FormField
              label="Display Order"
              name="display_order"
              type="number"
              value={editingProject?.display_order || 0}
              onChange={(e) => setEditingProject({...editingProject, display_order: parseInt(e.target.value)})}
              placeholder="0"
            />

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingProject(null)
                }}
                className="px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                {editingProject ? 'Update Project' : 'Create Project'}
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
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Projects Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center"
        >
          <span className="material-symbols-outlined mr-2">add</span>
          Add Project
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
        data={projects}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={loading}
      />
    </div>
  )
}
