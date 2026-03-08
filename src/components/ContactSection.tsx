'use client'

import React, { useState, useEffect } from 'react'
import { getProfile } from '@/services/portfolio'
import type { Profile } from '@/types/database'

const ContactSection = () => {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      })

      if (res.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', message: '' })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  useEffect(() => {
    getProfile().then(setProfile)
  }, [])

  return (
    <footer id="contact" className="bg-transparent py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">Let's Connect</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 max-w-md">
              I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
            </p>
            <div className="flex items-center gap-6">
              <a
                className="w-12 h-12 rounded-full glass dark:glass flex items-center justify-center hover:bg-primary hover:text-white transition-all text-slate-700 dark:text-slate-300 hover:scale-110"
                href="mailto:maidaamjad32@gmail.com"
                aria-label="Email"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </a>
              <a
                className="w-12 h-12 rounded-full glass dark:glass flex items-center justify-center hover:bg-primary hover:text-white transition-all text-slate-700 dark:text-slate-300 hover:scale-110"
                href="https://www.linkedin.com/in/maida-amjad7541"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                className="w-12 h-12 rounded-full glass dark:glass flex items-center justify-center hover:bg-primary hover:text-white transition-all text-slate-700 dark:text-slate-300 hover:scale-110"
                href="https://github.com/MaidaAmjad"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          <div className="glass dark:glass p-8 rounded-3xl shadow-2xl">
            {submitStatus === 'success' && (
              <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-xl">
                <p className="text-green-800 dark:text-green-200 font-medium">Message sent successfully! I'll get back to you soon.</p>
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-xl">
                <p className="text-red-800 dark:text-red-200 font-medium">Failed to send message. Please try again.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Name</label>
                  <input 
                    className="bg-white/5 border-2 border-[rgba(0,212,255,0.4)] rounded-xl p-3 focus:border-[#00d4ff] focus:ring-2 focus:ring-[rgba(0,212,255,0.3)] focus:ring-offset-0 focus:ring-offset-transparent outline-none transition-all shadow-[0_0_12px_rgba(0,212,255,0.15)] focus:shadow-[0_0_20px_rgba(0,212,255,0.25)]" 
                    placeholder="John Doe" 
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email</label>
                  <input 
                    className="bg-white/5 border-2 border-[rgba(0,212,255,0.4)] rounded-xl p-3 focus:border-[#00d4ff] focus:ring-2 focus:ring-[rgba(0,212,255,0.3)] focus:ring-offset-0 focus:ring-offset-transparent outline-none transition-all shadow-[0_0_12px_rgba(0,212,255,0.15)] focus:shadow-[0_0_20px_rgba(0,212,255,0.25)]" 
                    placeholder="john@example.com" 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Message</label>
                <textarea 
                  className="bg-white/5 border-2 border-[rgba(0,212,255,0.4)] rounded-xl p-3 focus:border-[#00d4ff] focus:ring-2 focus:ring-[rgba(0,212,255,0.3)] focus:ring-offset-0 focus:ring-offset-transparent outline-none transition-all shadow-[0_0_12px_rgba(0,212,255,0.15)] focus:shadow-[0_0_20px_rgba(0,212,255,0.25)]" 
                  placeholder="How can I help you?" 
                  rows={4}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                ></textarea>
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
        <div className="mt-20 pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} {profile?.name || 'Portfolio'}. All rights reserved.</p>
          <div className="flex gap-8">
            <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default ContactSection
