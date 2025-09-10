// Re-export from shared UI package
import { DevAdminBanner as DevAdminBannerBase } from '@sms-hub/ui'
import { adminEnvironment } from '../config/adminEnvironment'

export function DevAdminBanner() {
  // Admin app doesn't have onboarding, so we'll navigate to users page
  return <DevAdminBannerBase environment={adminEnvironment} onboardingPath="/users" />
}