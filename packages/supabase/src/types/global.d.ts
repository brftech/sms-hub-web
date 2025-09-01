declare global {
  interface Window {
    import?: {
      meta?: {
        env?: {
          VITE_SUPABASE_URL?: string
          VITE_SUPABASE_ANON_KEY?: string
        }
      }
    }
  }
}

export {}