// Re-export from shared package with environment adapter
import { useDevAuth as useDevAuthBase, activateDevAuth as activateDevAuthBase, clearDevAuth } from '@sms-hub/dev-auth'
import { adminEnvironment } from '../config/adminEnvironment'

export const useDevAuth = () => useDevAuthBase(adminEnvironment)
export const activateDevAuth = (userId?: string) => activateDevAuthBase(adminEnvironment, userId)
export { clearDevAuth }