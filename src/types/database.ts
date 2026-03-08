export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          title: string
          bio: string | null
          focus_area: string | null
          location: string | null
          profile_image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          title: string
          bio?: string | null
          focus_area?: string | null
          location?: string | null
          profile_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          title?: string
          bio?: string | null
          focus_area?: string | null
          location?: string | null
          profile_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      skills: {
        Row: {
          id: string
          name: string
          icon: string | null
          proficiency_level: number
          category: string | null
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          icon?: string | null
          proficiency_level: number
          category?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          icon?: string | null
          proficiency_level?: number
          category?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          title: string
          description: string
          image_url: string | null
          project_url: string | null
          github_url: string | null
          featured: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          image_url?: string | null
          project_url?: string | null
          github_url?: string | null
          featured?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          image_url?: string | null
          project_url?: string | null
          github_url?: string | null
          featured?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      project_tags: {
        Row: {
          id: string
          project_id: string
          tag: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          tag: string
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          tag?: string
          created_at?: string
        }
      }
      experience: {
        Row: {
          id: string
          title: string
          company: string
          period: string
          description: string | null
          icon: string
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          company: string
          period: string
          description?: string | null
          icon?: string
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          company?: string
          period?: string
          description?: string | null
          icon?: string
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      certifications: {
        Row: {
          id: string
          name: string
          issuer: string
          date: string
          credential_id: string | null
          certification_url: string | null
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          issuer: string
          date: string
          credential_id?: string | null
          certification_url?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          issuer?: string
          date?: string
          credential_id?: string | null
          certification_url?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      quotes: {
        Row: {
          id: string
          content: string
          author: string
          source: string | null
          is_active: boolean
          created_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          content: string
          author: string
          source?: string | null
          is_active?: boolean
          created_at?: string
          expires_at?: string | null
        }
        Update: {
          id?: string
          content?: string
          author?: string
          source?: string | null
          is_active?: boolean
          created_at?: string
          expires_at?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          name: string
          email: string
          message: string
          status: 'unread' | 'read' | 'replied'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          message: string
          status?: 'unread' | 'read' | 'replied'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          message?: string
          status?: 'unread' | 'read' | 'replied'
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Extended types with joins for easier use
export type ProjectWithTags = Database['public']['Tables']['projects']['Row'] & {
  project_tags: Database['public']['Tables']['project_tags']['Row'][]
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Skill = Database['public']['Tables']['skills']['Row']
export type Experience = Database['public']['Tables']['experience']['Row']
export type Certification = Database['public']['Tables']['certifications']['Row']
export type Quote = Database['public']['Tables']['quotes']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
