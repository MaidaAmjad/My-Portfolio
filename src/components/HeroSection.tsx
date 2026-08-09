'use client'

import React, { useEffect, useState } from 'react'
import { getProfile, getProjects, getExperience, getCertifications } from '@/services/portfolio'
import type { Profile } from '@/types/database'

const ROLES = ['AI/ML Engineering', 'LLM Development', 'Computer Vision', 'RAG Systems']

const HeroSection = () => {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [stats, setStats] = useState({ projects: 0, roles: 0, certifications: 0 })
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [typing, setTyping] = useState(true)

  const fetchProfile = async () => {
    try {
      const [p, projects, experience, certifications] = await Promise.all([
        getProfile(),
        getProjects(),
        getExperience(),
        getCertifications(),
      ])
      setProfile(p)
      setStats({
        projects: projects.length,
        roles: experience.length,
        certifications: certifications.length,
      })
    } catch (error) {
      console.error('Failed to fetch hero data:', error)
    }
  }

  useEffect(() => {
    fetchProfile()
    const onVisible = () => { if (document.visibilityState === 'visible') fetchProfile() }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [])

  // Typewriter effect
  useEffect(() => {
    const current = ROLES[roleIndex]
    let timeout: ReturnType<typeof setTimeout>

    if (typing) {
      if (displayed.length < current.length) {
        timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 60)
      } else {
        timeout = setTimeout(() => setTyping(false), 1800)
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30)
      } else {
        setRoleIndex((i) => (i + 1) % ROLES.length)
        setTyping(true)
      }
    }
    return () => clearTimeout(timeout)
  }, [displayed, typing, roleIndex])

  return (
    <section className="max-w-6xl mx-auto px-6 py-12 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* Left: Text */}
        <div className="flex flex-col gap-6">

          {/* Available badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold w-fit">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Available for AI/ML roles
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
            Building the future with<br />
            <span className="text-primary">
              {displayed}
              <span className="animate-pulse">|</span>
            </span>
          </h1>

          {/* Bio */}
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
            {profile?.bio
              ? profile.bio.split('.')[0] + '.'
              : "I'm Maida Amjad, an aspiring AI & Machine Learning engineer turning complex ML concepts into practical, user-focused applications."}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            <a href="#projects" className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:translate-y-[-2px] transition-all shadow-xl shadow-primary/30">
              View Projects
            </a>
            <a href="#contact" className="bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-300 dark:hover:bg-white/20 transition-all">
              Contact Me
            </a>
          </div>

          {/* Stats */}
          <div className="flex gap-8 pt-4">
            <div className="text-center">
              <p className="text-3xl font-black text-primary">{String(stats.projects).padStart(2, '0')}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Shipped projects</p>
            </div>
            <div className="w-px bg-slate-200 dark:bg-white/10"></div>
            <div className="text-center">
              <p className="text-3xl font-black text-primary">{String(stats.roles).padStart(2, '0')}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Active roles</p>
            </div>
            <div className="w-px bg-slate-200 dark:bg-white/10"></div>
            <div className="text-center">
              <p className="text-3xl font-black text-primary">{String(stats.certifications).padStart(2, '0')}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Certifications</p>
            </div>
          </div>
        </div>

        {/* Right: Terminal card + profile image */}
        <div className="flex flex-col items-center gap-6">

          {/* Profile image */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary to-purple-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative w-48 h-48 md:w-60 md:h-60 rounded-3xl overflow-hidden border-4 border-white dark:border-white/10 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
              <img
                className="w-full h-full object-cover"
                alt={profile?.name || 'Profile'}
                src={profile?.profile_image_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDb8ILWppBCEFSdWLI19-f7RepccaB6jb_vheLf2SjBjI8PvMGpIhT4p55A49VjUidFOTKeRxbqUNhUp8Wb771HIoqZKSCmQGCskc-ksZbM3KhtUh2N5TebfgtkJhBfQLJk_qzAIoDzN8HH4fBaNnAv3MzGYFWmQVCq5ZbfREiyN2d7tFsfHwn10EEoXitYbRuzCD4k3kczv8rJcesPF2Ag3ZZ-w2r9JYMZDQP6GAftSP6bf97ELxzgrUQfP_N9yESDgNrdC2jmOQ'}
              />
            </div>
          </div>

          {/* Terminal card */}
          <div className="w-full max-w-sm glass dark:glass rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/80 border-b border-white/10">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span className="ml-2 text-xs text-slate-400 font-mono">model_training.py</span>
            </div>
            <div className="p-4 font-mono text-xs space-y-1">
              <p><span className="text-green-400">$</span> <span className="text-slate-300">python train.py --model gpt</span></p>
              <p className="text-slate-500">{'>'} Loading dataset...</p>
              <p className="text-slate-500">{'>'} Epoch 1/10 ━━━━━━ 100%</p>
              <p className="text-yellow-400">{'>'} Training model<span className="animate-pulse">...</span></p>
              <p className="text-slate-500 flex items-center gap-2">
                {'>'} AQI: <span className="text-primary font-bold">90</span>
                <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              </p>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="flex flex-col items-center gap-1 text-slate-500 text-xs mt-2">
            <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            Scroll
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
