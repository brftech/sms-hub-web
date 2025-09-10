import { useDevAuth as useDevAuthBase, activateDevAuth as activateDevAuthBase, clearDevAuth } from '@sms-hub/dev-auth'
import { textingEnvironment } from '../config/textingEnvironment'

export const useDevAuth = () => useDevAuthBase(textingEnvironment)
export const activateDevAuth = (userId?: string) => activateDevAuthBase(textingEnvironment, userId)
export { clearDevAuth }
