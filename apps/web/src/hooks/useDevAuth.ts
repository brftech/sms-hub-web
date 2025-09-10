// Re-export from shared package with environment adapter
import { useDevAuth as useDevAuthBase, activateDevAuth as activateDevAuthBase, clearDevAuth } from '@sms-hub/dev-auth'
import { webEnvironment } from '../config/webEnvironment'

export const useDevAuth = () => useDevAuthBase(webEnvironment)
export const activateDevAuth = (userId?: string) => activateDevAuthBase(webEnvironment, userId)
export { clearDevAuth }
