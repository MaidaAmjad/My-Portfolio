'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { getFeaturedProjectsPreview } from '@/services/portfolio'
import type { ProjectWithTags } from '@/types/database'
import ProjectCard from '@/components/ProjectCard'

const FEATURED_HOME_LIMIT = 3

const ProjectsSection = () => {
  const [projects, setProjects] = useState<ProjectWithTags[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getFeaturedProjectsPreview(FEATURED_HOME_LIMIT)
        setProjects(data)
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()

    const onVisible = () => {
      if (document.visibilityState === 'visible') fetchProjects()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
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
        <Link
          href="/projects"
          className="text-primary font-bold flex items-center gap-2 group"
        >
          View All
          <svg className="w-5 h-5 inline-block group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-white/5 px-6 py-10 text-center">
            <p className="text-slate-600 dark:text-slate-400">
              No featured projects right now. Open <span className="font-semibold text-slate-800 dark:text-slate-200">View All</span> for the full list.
            </p>
          </div>
        ) : (
          projects.map((project) => <ProjectCard key={project.id} project={project} />)
        )}
      </div>
    </section>
  )
}

export default ProjectsSection
