// Re-export from shared package with environment adapter
import { useDevAuth as useDevAuthBase, activateDevAuth as activateDevAuthBase, clearDevAuth } from '@sms-hub/dev-auth'
import { userEnvironment } from '../config/userEnvironment'

export const useDevAuth = () => useDevAuthBase(userEnvironment)
export const activateDevAuth = (userId?: string) => activateDevAuthBase(userEnvironment, userId)
export { clearDevAuth }