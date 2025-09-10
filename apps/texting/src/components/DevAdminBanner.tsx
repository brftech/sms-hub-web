// Re-export from shared UI package
import { DevAdminBanner as DevAdminBannerBase } from '@sms-hub/ui'
import { userEnvironment } from '../config/userEnvironment'

export function DevAdminBanner() {
  return <DevAdminBannerBase environment={userEnvironment} />
}