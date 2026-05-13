import React from 'react'
import type { ProjectWithTags } from '@/types/database'

export default function ProjectCard({ project }: { project: ProjectWithTags }) {
  return (
    <div className="group glass dark:glass rounded-3xl overflow-hidden flex flex-col h-full border border-slate-200 dark:border-white/5 shadow-xl transition-all hover:translate-y-[-8px]">
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
            <span
              key={tagIndex}
              className="text-[10px] font-bold px-2 py-1 bg-slate-100 dark:bg-white/10 rounded uppercase tracking-wider"
            >
              {tagData.tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
