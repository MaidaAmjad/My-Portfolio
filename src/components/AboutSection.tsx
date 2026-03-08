'use client'

import React, { useEffect, useState } from 'react'
import { getProfile } from '@/services/portfolio'
import type { Profile } from '@/types/database'

const AboutSection = () => {
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
      <section className="max-w-6xl mx-auto px-6 py-20" id="about">
        <div className="glass dark:glass rounded-3xl p-8 md:p-12">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-6"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-20" id="about">
      <div className="glass dark:glass rounded-3xl p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-slate-900 dark:text-white">
              <span className="material-symbols-outlined text-primary">person</span>
              About {profile?.name || 'Me'}
            </h2>
            <div className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg mb-6 whitespace-pre-line">
              {profile?.bio || 'I am Alex Rivera, a Senior AI Engineer with over 8 years of experience bridgeing the gap between complex machine learning models and intuitive user interfaces. My journey began at the intersection of mathematics and design, leading me to create systems that don\'t just work—they feel magical.'}
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
              Based in {profile?.location || 'San Francisco, CA (Remote)'}, I collaborate with global teams to deploy production-ready AI solutions that prioritize privacy, efficiency, and human-centric design.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
              <h4 className="font-bold text-primary text-sm uppercase tracking-widest mb-2">Focus Area</h4>
              <p className="text-slate-900 dark:text-white font-medium">{profile?.focus_area || 'Large Language Models & RAG Systems'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
              <h4 className="font-bold text-primary text-sm uppercase tracking-widest mb-2">Location</h4>
              <p className="text-slate-900 dark:text-white font-medium">{profile?.location || 'San Francisco, CA (Remote)'}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
