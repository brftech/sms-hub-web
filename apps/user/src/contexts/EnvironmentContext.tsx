import React, { createContext, useContext } from 'react'
import { userEnvironment } from '../config/userEnvironment'
import { EnvironmentAdapter } from '@sms-hub/ui'

const EnvironmentContext = createContext<EnvironmentAdapter>(userEnvironment)

export const EnvironmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <EnvironmentContext.Provider value={userEnvironment}>
      {children}
    </EnvironmentContext.Provider>
  )
}

export const useEnvironment = () => {
  const context = useContext(EnvironmentContext)
  if (!context) {
    throw new Error('useEnvironment must be used within EnvironmentProvider')
  }
  return context
}