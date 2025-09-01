import { createContext, useContext, ReactNode } from 'react'
import type { SupabaseClient } from './client'

const SupabaseContext = createContext<SupabaseClient | null>(null)

export const SupabaseQueryProvider = ({ 
  children, 
  client 
}: { 
  children: ReactNode
  client: SupabaseClient 
}) => {
  return (
    <SupabaseContext.Provider value={client}>
      {children}
    </SupabaseContext.Provider>
  )
}

export const useSupabaseClient = () => {
  const client = useContext(SupabaseContext)
  if (!client) {
    throw new Error('useSupabaseClient must be used within a SupabaseQueryProvider')
  }
  return client
}