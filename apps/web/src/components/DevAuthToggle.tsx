// Re-export from shared UI package
import { DevAuthToggle as DevAuthToggleBase } from '@sms-hub/ui'
import { webEnvironment } from '../config/webEnvironment'

interface DevAuthToggleProps {
  onActivate: () => void
}

export function DevAuthToggle({ onActivate }: DevAuthToggleProps) {
  return <DevAuthToggleBase environment={webEnvironment} onActivate={onActivate} />
}
