'use client'

import React, { useEffect, useState } from 'react'
import { getProfile } from '@/services/portfolio'
import type { Profile } from '@/types/database'

const HeroSection = () => {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async () => {
    try {
      const data = await getProfile()
      setProfile(data)
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  // Refetch when user returns to this tab (e.g. after updating in admin)
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') fetchProfile()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [])

  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-12 md:py-24">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
          <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
        </div>
      </section>
    )
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-12 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1 flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold w-fit">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Available for new opportunities
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight text-slate-900 dark:text-white">
            {profile?.title || 'Senior AI'} <br/><span className="text-primary">Engineer</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
            {profile?.bio || 'Building the future of intelligent applications. Specialized in LLMs, computer vision, and scalable cloud architectures.'}
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <a href="#projects" className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:translate-y-[-2px] transition-all shadow-xl shadow-primary/30">
              View Projects
            </a>
            <a href="#contact" className="bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-300 dark:hover:bg-white/20 transition-all">
              Contact Me
            </a>
          </div>
        </div>
        <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary to-purple-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden border-4 border-white dark:border-white/10 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
              <img 
                className="w-full h-full object-cover" 
                alt="Profile"
                src={profile?.profile_image_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuDb8ILWppBCEFSdWLI19-f7RepccaB6jb_vheLf2SjBjI8PvMGpIhT4p55A49VjUidFOTKeRxbqUNhUp8Wb771HIoqZKSCmQGCskc-ksZbM3KhtUh2N5TebfgtkJhBfQLJk_qzAIoDzN8HH4fBaNnAv3MzGYFWmQVCq5ZbfREiyN2d7tFsfHwn10EEoXitYbRuzCD4k3kczv8rJcesPF2Ag3ZZ-w2r9JYMZDQP6GAftSP6bf97ELxzgrUQfP_N9yESDgNrdC2jmOQ"}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
