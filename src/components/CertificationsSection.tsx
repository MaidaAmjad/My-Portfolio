'use client'

import React, { useEffect, useState } from 'react'
import { getCertifications } from '@/services/portfolio'
import type { Certification } from '@/types/database'

const CertificationsSection = () => {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const data = await getCertifications()
        setCertifications(data)
      } catch (error) {
        console.error('Failed to fetch certifications:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCertifications()
  }, [])

  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-20" id="certifications">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mx-auto mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-200 dark:bg-slate-700 rounded-2xl h-32"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-20" id="certifications">
      <h2 className="text-3xl font-bold mb-12 text-center text-slate-900 dark:text-white">Certifications</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((cert) => (
          <div key={cert.id} className="glass dark:glass p-6 rounded-2xl border border-primary/10 hover:border-primary/30 transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{cert.name}</h3>
                <p className="text-sm text-primary font-semibold mb-2">{cert.issuer}</p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{cert.date}</span>
                  {cert.credential_id && (
                    <span className="font-mono bg-slate-100 dark:bg-white/10 px-2 py-1 rounded">{cert.credential_id}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default CertificationsSection
