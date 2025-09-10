// SupabaseProvider for Unified App
import React, { createContext, useContext } from 'react'
import { getSupabaseClient } from '../lib/supabaseSingleton'

const SupabaseContext = createContext<any>(null)

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use the singleton client
  const supabase = getSupabaseClient()

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}
