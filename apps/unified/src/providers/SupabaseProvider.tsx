// SupabaseProvider for Unified App
import React, { createContext, useContext } from 'react'
import { createSupabaseClient } from '@sms-hub/supabase'

const SupabaseContext = createContext<any>(null)

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const supabase = createSupabaseClient(
    'https://vgpovgpwqkjnpnrjelyg.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncG92Z3B3cWtqbnBucmplbHlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxNDQ4MDAsImV4cCI6MjA1MTcyMDgwMH0.8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8'
  )

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
