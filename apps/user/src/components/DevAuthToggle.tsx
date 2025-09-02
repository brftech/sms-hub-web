// Re-export from shared UI package
import { DevAuthToggle as DevAuthToggleBase } from '@sms-hub/ui'
import { userEnvironment } from '../config/userEnvironment'

interface DevAuthToggleProps {
  onActivate: () => void
}

export function DevAuthToggle({ onActivate }: DevAuthToggleProps) {
  return <DevAuthToggleBase environment={userEnvironment} onActivate={onActivate} />
}