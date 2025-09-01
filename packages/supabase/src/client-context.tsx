import { createContext, useContext, ReactNode } from 'react'
import type { SupabaseClient } from './client'

const SupabaseClientContext = createContext<SupabaseClient | null>(null)

export const SupabaseClientProvider = ({ 
  children, 
  client 
}: { 
  children: ReactNode
  client: SupabaseClient 
}) => {
  return (
    <SupabaseClientContext.Provider value={client}>
      {children}
    </SupabaseClientContext.Provider>
  )
}

export const useSupabaseClient = () => {
  const client = useContext(SupabaseClientContext)
  if (!client) {
    throw new Error('useSupabaseClient must be used within a SupabaseClientProvider')
  }
  return client
}