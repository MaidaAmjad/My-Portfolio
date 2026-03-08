import { supabase } from '@/lib/supabase'
import type { Profile, Skill, ProjectWithTags, Experience, Certification, Quote } from '@/types/database'

export async function getProfile(): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('id', { ascending: true })
      .limit(1)
      .maybeSingle()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching profile:', error)
    return null
  }
}

export async function getSkills(): Promise<Skill[]> {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching skills:', error)
    return []
  }
}

export async function getProjects(): Promise<ProjectWithTags[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_tags (
          tag
        )
      `)
      .order('display_order', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}

export async function getExperience(): Promise<Experience[]> {
  try {
    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching experience:', error)
    return []
  }
}

export async function getCertifications(): Promise<Certification[]> {
  try {
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching certifications:', error)
    return []
  }
}

export async function getRandomQuote(): Promise<Quote | null> {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('is_active', true)
      .or('expires_at.is.null,expires_at.gt.now()')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      throw error
    }
    
    return data
  } catch (error) {
    console.error('Error fetching quote:', error)
    return null
  }
}

export async function submitMessage(name: string, email: string, message: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('messages')
      .insert({
        name,
        email,
        message,
        status: 'unread'
      })

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error submitting message:', error)
    return false
  }
}
