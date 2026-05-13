import React from 'react'
import type { ProjectWithTags } from '@/types/database'

function primaryProjectHref(project: ProjectWithTags): string | null {
  const live = project.project_url?.trim()
  if (live) return live
  const gh = project.github_url?.trim()
  if (gh) return gh
  return null
}

export default function ProjectCard({ project }: { project: ProjectWithTags }) {
  const href = primaryProjectHref(project)
  const baseClass =
    'group glass dark:glass rounded-3xl overflow-hidden flex flex-col h-full border border-slate-200 dark:border-white/5 shadow-xl transition-all hover:translate-y-[-8px] text-left no-underline text-inherit'

  const body = (
    <>
      <div className="h-48 w-full bg-slate-100 dark:bg-white/5 relative overflow-hidden">
        <img
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          alt=""
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
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950`}
        aria-label={`Open ${project.title} (live site or repository)`}
      >
        {body}
      </a>
    )
  }

  return (
    <div className={`${baseClass} cursor-default`} role="article" aria-label={project.title}>
      {body}
    </div>
  )
}
