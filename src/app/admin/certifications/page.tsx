'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Certification } from '@/types/database'
import DataTable from '../components/DataTable'
import FormField from '../components/FormField'

export default function CertificationsManagement() {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCert, setEditingCert] = useState<Certification | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchCertifications()
  }, [])

  const fetchCertifications = async () => {
    try {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) throw error
      setCertifications(data || [])
    } catch (error) {
      console.error('Error fetching certifications:', error)
      setMessage('Failed to load certifications')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const payload = {
      name: formData.get('name') as string,
      issuer: formData.get('issuer') as string,
      date: formData.get('date') as string,
      credential_id: (formData.get('credential_id') as string) || '',
      certification_url: (formData.get('certification_url') as string) || '',
      display_order: parseInt(formData.get('display_order') as string, 10) || 0,
    }

    try {
      const url = '/api/admin/certifications'
      if (editingCert) {
        const res = await fetch(url, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingCert.id, ...payload }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error || 'Update failed')
        setMessage('Certification updated successfully!')
      } else {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error || 'Create failed')
        setMessage('Certification created successfully!')
      }
      setShowForm(false)
      setEditingCert(null)
      fetchCertifications()
    } catch (error) {
      console.error('Error saving certification:', error)
      setMessage(error instanceof Error ? error.message : 'Failed to save certification')
    }
  }

  const handleEdit = (cert: Certification) => {
    setEditingCert(cert)
    setShowForm(true)
    setMessage('')
  }

  const handleDelete = async (cert: Certification) => {
    if (!confirm('Are you sure you want to delete this certification?')) return

    try {
      const res = await fetch(`/api/admin/certifications?id=${encodeURIComponent(cert.id)}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Delete failed')
      setMessage('Certification deleted successfully!')
      setCertifications(certifications.filter(c => c.id !== cert.id))
    } catch (error) {
      console.error('Error deleting certification:', error)
      setMessage(error instanceof Error ? error.message : 'Failed to delete certification')
    }
  }

  const columns = [
    { key: 'name' as const, label: 'Name' },
    { key: 'issuer' as const, label: 'Issuer' },
    { key: 'date' as const, label: 'Date' },
    { key: 'credential_id' as const, label: 'Credential ID' },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="border-b border-slate-200 dark:border-slate-700 pb-4">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
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
              {editingCert ? 'Edit Certification' : 'Add Certification'}
            </h2>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setEditingCert(null)
                setMessage('')
              }}
              className="text-slate-500 hover:text-slate-700 transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

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

          <form key={editingCert?.id ?? 'new'} onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Name"
                name="name"
                value={editingCert ? editingCert.name : undefined}
                onChange={editingCert ? (e) => setEditingCert({ ...editingCert, name: e.target.value }) : undefined}
                required
              />
              <FormField
                label="Issuer"
                name="issuer"
                value={editingCert ? editingCert.issuer : undefined}
                onChange={editingCert ? (e) => setEditingCert({ ...editingCert, issuer: e.target.value }) : undefined}
                required
              />
            </div>

            <FormField
              label="Date"
              name="date"
              value={editingCert ? editingCert.date : undefined}
              onChange={editingCert ? (e) => setEditingCert({ ...editingCert, date: e.target.value }) : undefined}
              placeholder="e.g. May 2024"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Credential ID"
                name="credential_id"
                value={editingCert ? (editingCert.credential_id ?? '') : undefined}
                onChange={
                  editingCert
                    ? (e) => setEditingCert({ ...editingCert, credential_id: e.target.value || null })
                    : undefined
                }
              />
              <FormField
                label="Certification URL"
                name="certification_url"
                type="url"
                value={editingCert ? (editingCert.certification_url ?? '') : undefined}
                onChange={
                  editingCert
                    ? (e) => setEditingCert({ ...editingCert, certification_url: e.target.value || null })
                    : undefined
                }
              />
            </div>

            <FormField
              label="Display order"
              name="display_order"
              type="number"
              value={editingCert ? editingCert.display_order : undefined}
              onChange={
                editingCert
                  ? (e) =>
                      setEditingCert({
                        ...editingCert,
                        display_order: parseInt(e.target.value, 10) || 0,
                      })
                  : undefined
              }
              placeholder="0"
            />

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingCert(null)
                  setMessage('')
                }}
                className="px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                {editingCert ? 'Update certification' : 'Create certification'}
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
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Certifications Management</h2>
        <button
          onClick={() => {
            setMessage('')
            setShowForm(true)
          }}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center"
        >
          <span className="material-symbols-outlined mr-2">add</span>
          Add certification
        </button>
      </div>

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

      {certifications.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 text-center">
          <div className="text-slate-500 dark:text-slate-400">
            <span className="material-symbols-outlined text-4xl mb-4">workspace_premium</span>
            <p className="text-lg font-medium">No certifications yet</p>
            <p className="text-sm mt-2">Add your first certification using the button above.</p>
          </div>
        </div>
      ) : (
        <DataTable
          data={certifications}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={loading}
        />
      )}
    </div>
  )
}
