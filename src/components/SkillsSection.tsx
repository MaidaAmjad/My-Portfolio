'use client'

import React, { useEffect, useState } from 'react'
import { getSkills } from '@/services/portfolio'
import type { Skill } from '@/types/database'

const SkillsSection = () => {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await getSkills()
        setSkills(data)
      } catch (error) {
        console.error('Failed to fetch skills:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSkills()
  }, [])

  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-20" id="skills">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mx-auto mb-12"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-slate-200 dark:bg-slate-700 rounded-2xl h-40"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-20" id="skills">
      <h2 className="text-3xl font-bold mb-12 text-center text-slate-900 dark:text-white">Technical Arsenal</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {skills.map((skill, index) => (
          <div key={skill.id} className="glass dark:glass p-6 rounded-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl">{skill.icon || '💻'}</span>
              <span className="text-xs font-bold text-slate-400 uppercase">{skill.proficiency_level}%</span>
            </div>
            <h3 className="font-bold text-lg">{skill.name}</h3>
            <div className="h-1.5 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${skill.proficiency_level}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default SkillsSection
