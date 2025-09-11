import { createSupabaseClient } from '@sms-hub/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

export const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseInstance) {
    const url = import.meta.env.VITE_SUPABASE_URL
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!url || !key) {
      throw new Error('Supabase URL and anon key are required')
    }
    
    supabaseInstance = createSupabaseClient(url, key)
  }
  
  return supabaseInstance
}