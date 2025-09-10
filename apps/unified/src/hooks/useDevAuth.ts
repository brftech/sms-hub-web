// useDevAuth hook for Unified App
import { useDevAuth as useDevAuthBase } from '@sms-hub/dev-auth'
import { unifiedEnvironment } from '../config/unifiedEnvironment'

export const useDevAuth = () => {
  return useDevAuthBase(unifiedEnvironment)
}

export const activateDevAuth = () => {
  // Implementation for activating dev auth
  console.log('Dev auth activated')
}
