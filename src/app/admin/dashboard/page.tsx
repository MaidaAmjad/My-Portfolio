'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Profile, Skill, Experience, Certification } from '@/types/database'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    profiles: 0,
    projects: 0,
    skills: 0,
    experience: 0,
    certifications: 0,
    messages: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          { count: profilesCount },
          { count: projectsCount },
          { count: skillsCount },
          { count: experienceCount },
          { count: certificationsCount },
          { count: messagesCount }
        ] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('projects').select('*', { count: 'exact', head: true }),
          supabase.from('skills').select('*', { count: 'exact', head: true }),
          supabase.from('experience').select('*', { count: 'exact', head: true }),
          supabase.from('certifications').select('*', { count: 'exact', head: true }),
          supabase.from('messages').select('*', { count: 'exact', head: true })
        ])

        setStats({
          profiles: profilesCount || 0,
          projects: projectsCount || 0,
          skills: skillsCount || 0,
          experience: experienceCount || 0,
          certifications: certificationsCount || 0,
          messages: messagesCount || 0
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const StatIcon = ({ type, className }: { type: string; className?: string }) => {
    const c = className ?? 'w-6 h-6 text-white'
    switch (type) {
      case 'person':
        return (
          <svg className={c} fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
        )
      case 'work':
        return (
          <svg className={c} fill="currentColor" viewBox="0 0 24 24"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" /></svg>
        )
      case 'psychology':
        return (
          <svg className={c} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v2h1.5V7zm0 3H11v5h1.5V10z" /></svg>
        )
      case 'history':
        return (
          <svg className={c} fill="currentColor" viewBox="0 0 24 24"><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" /></svg>
        )
      case 'certifications':
        return (
          <svg className={c} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7-6-4.6h7.6L12 2z" /></svg>
        )
      case 'email':
        return (
          <svg className={c} fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
        )
      default:
        return null
    }
  }

  const statCards = [
    { title: 'Profile', count: stats.profiles, iconType: 'person', color: 'bg-blue-500', href: '/admin/profile' },
    { title: 'Projects', count: stats.projects, iconType: 'work', color: 'bg-green-500', href: '/admin/projects' },
    { title: 'Skills', count: stats.skills, iconType: 'psychology', color: 'bg-purple-500', href: '/admin/skills' },
    { title: 'Experience', count: stats.experience, iconType: 'history', color: 'bg-orange-500', href: '/admin/experience' },
    { title: 'Certifications', count: stats.certifications, iconType: 'certifications', color: 'bg-pink-500', href: '/admin/certifications' },
    { title: 'Messages', count: stats.messages, iconType: 'email', color: 'bg-red-500', href: '/admin/messages' }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 animate-pulse">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Dashboard Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat) => (
            <a
              key={stat.title}
              href={stat.href}
              className="group block bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-all hover:scale-[1.02] border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.count}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <StatIcon type={stat.iconType} />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/admin/profile"
            className="flex items-center p-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>
            Update Profile
          </a>
          <a
            href="/admin/projects/new"
            className="flex items-center p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
            Add Project
          </a>
        </div>
      </div>
    </div>
  )
}
