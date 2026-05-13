import Link from 'next/link'
import Navbar from '@/components/Navbar'
import ProjectCard from '@/components/ProjectCard'
import { getProjects } from '@/services/portfolio'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'All Projects',
  description: 'Full project portfolio.',
}

export default async function AllProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="neon-boundary relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Link
                href="/#projects"
                className="text-sm font-medium text-slate-500 hover:text-primary dark:text-slate-400 mb-2 inline-block"
              >
                ← Back to home
              </Link>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">All projects</h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Everything in the portfolio, including non-featured work.
              </p>
            </div>
          </div>

          {projects.length === 0 ? (
            <p className="text-slate-600 dark:text-slate-400">No projects yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
