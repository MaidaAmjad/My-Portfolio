'use client'

import React, { useEffect, useState } from 'react'
import { getProjects } from '@/services/portfolio'
import type { ProjectWithTags } from '@/types/database'

const ProjectsSection = () => {
  const [projects, setProjects] = useState<ProjectWithTags[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects()
        setProjects(data)
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-20" id="projects">
        <div className="animate-pulse">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
            </div>
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-200 dark:bg-slate-700 rounded-3xl h-80"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-20" id="projects">
      <div className="flex items-end justify-between mb-12">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Featured Projects</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Solving real-world problems with code.</p>
        </div>
        <button className="text-primary font-bold flex items-center gap-2 group">
          View All
          <svg className="w-5 h-5 inline-block group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div key={project.id} className="group glass dark:glass rounded-3xl overflow-hidden flex flex-col h-full border border-slate-200 dark:border-white/5 shadow-xl transition-all hover:translate-y-[-8px]">
            <div className="h-48 w-full bg-slate-100 dark:bg-white/5 relative overflow-hidden">
              <img 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                alt={project.title}
                src={project.image_url || '/placeholder-project.jpg'}
              />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.project_tags?.map((tagData, tagIndex) => (
                  <span key={tagIndex} className="text-[10px] font-bold px-2 py-1 bg-slate-100 dark:bg-white/10 rounded uppercase tracking-wider">
                    {tagData.tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ProjectsSection
