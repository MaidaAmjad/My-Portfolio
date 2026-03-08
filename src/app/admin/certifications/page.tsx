'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Certification } from '@/types/database'
import DataTable from '../components/DataTable'

export default function CertificationsManagement() {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)

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
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (cert: Certification) => {
    if (!confirm('Are you sure you want to delete this certification?')) return

    try {
      const res = await fetch(`/api/admin/certifications?id=${encodeURIComponent(cert.id)}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Delete failed')
      setCertifications(certifications.filter(c => c.id !== cert.id))
    } catch (error) {
      console.error('Error deleting certification:', error)
    }
  }

  const columns = [
    { key: 'name' as const, label: 'Name' },
    { key: 'issuer' as const, label: 'Issuer' },
    { key: 'date' as const, label: 'Date' },
    { key: 'credential_id' as const, label: 'Credential ID' }
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Certifications Management</h2>
      </div>

      {certifications.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 text-center">
          <div className="text-slate-500 dark:text-slate-400">
            <span className="material-symbols-outlined text-4xl mb-4">workspace_premium</span>
            <p className="text-lg font-medium">No certifications yet</p>
            <p className="text-sm mt-2">Certifications will appear here.</p>
          </div>
        </div>
      ) : (
        <DataTable
          data={certifications}
          columns={columns}
          onDelete={handleDelete}
          isLoading={loading}
        />
      )}
    </div>
  )
}
