'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { getProfile } from '@/services/portfolio'
import type { Profile } from '@/types/database'

const Navbar = () => {
  const [profile, setProfile] = useState<Profile | null>(null)
  const pathname = usePathname()

  const loadProfile = () => getProfile().then(setProfile)

  useEffect(() => {
    loadProfile()
  }, [])

  // Refetch when landing on portfolio so admin changes show after "View Portfolio"
  useEffect(() => {
    if (pathname === '/') loadProfile()
  }, [pathname])

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') loadProfile()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [])

  return (
    <header className="fixed top-0 z-50 w-full px-6 py-4">
      <nav className="mx-auto max-w-5xl glass dark:glass flex items-center justify-between rounded-full px-6 py-3 shadow-lg">
        <div className="flex items-center gap-2 text-primary">
          <span className="text-slate-900 dark:text-white text-lg font-bold tracking-tight">
            {profile?.name || 'Portfolio'}
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a className="text-sm font-medium hover:text-primary transition-colors" href="#about">About</a>
          <a className="text-sm font-medium hover:text-primary transition-colors" href="#skills">Skills</a>
          <a className="text-sm font-medium hover:text-primary transition-colors" href="#projects">Projects</a>
          <a className="text-sm font-medium hover:text-primary transition-colors" href="#experience">Experience</a>
        </div>
        <a href="#contact" className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-full text-sm font-bold transition-all shadow-md shadow-primary/20">
          Hire Me
        </a>
      </nav>
    </header>
  )
}

export default Navbar
