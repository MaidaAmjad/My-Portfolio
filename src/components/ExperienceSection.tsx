'use client'

import React, { useEffect, useState } from 'react'
import { getExperience } from '@/services/portfolio'
import type { Experience } from '@/types/database'

const ExperienceSection = () => {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const data = await getExperience()
        setExperiences(data)
      } catch (error) {
        console.error('Failed to fetch experience:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchExperience()
  }, [])

  if (loading) {
    return (
      <section className="max-w-4xl mx-auto px-6 py-20" id="experience">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mx-auto mb-12"></div>
          <div className="space-y-8">
            {[1, 2].map((i) => (
              <div key={i} className="bg-slate-200 dark:bg-slate-700 rounded-2xl h-32"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="max-w-4xl mx-auto px-6 py-20" id="experience">
      <h2 className="text-3xl font-bold mb-12 text-center text-slate-900 dark:text-white">Experience</h2>
      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-primary before:to-transparent">
        {experiences.map((exp) => (
          <div key={exp.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-white/10 bg-primary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
              <span className="material-symbols-outlined text-sm">{exp.icon}</span>
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass dark:glass p-6 rounded-2xl shadow-xl">
              <div className="flex items-center justify-between space-x-2 mb-1">
                <div className="font-bold text-slate-900 dark:text-white">{exp.title}</div>
                <time className="text-xs font-bold text-primary uppercase">{exp.period}</time>
              </div>
              <div className="text-sm font-semibold text-primary mb-2">{exp.company}</div>
              <div className="text-slate-600 dark:text-slate-400 text-sm">{exp.description}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ExperienceSection
