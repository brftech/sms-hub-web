// Re-export from shared UI package
import { DevAuthToggle as DevAuthToggleBase } from '@sms-hub/ui'
import { adminEnvironment } from '../config/adminEnvironment'

interface DevAuthToggleProps {
  onActivate: () => void
}

export function DevAuthToggle({ onActivate }: DevAuthToggleProps) {
  return <DevAuthToggleBase environment={adminEnvironment} onActivate={onActivate} />
}