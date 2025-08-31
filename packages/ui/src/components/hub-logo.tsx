import * as React from 'react'
import { HubType, HUB_CONFIGS } from '@sms-hub/types'
import { cn } from '@sms-hub/utils'

interface HubLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  hubType: HubType
  variant?: 'icon' | 'text' | 'full'
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeClasses = {
  sm: 'h-6 w-auto',
  md: 'h-8 w-auto',
  lg: 'h-12 w-auto',
  xl: 'h-16 w-auto'
}

export const HubLogo = React.forwardRef<HTMLDivElement, HubLogoProps>(
  ({ hubType, variant = 'text', size = 'md', className, ...props }, ref) => {
    const hubConfig = HUB_CONFIGS[hubType]
    
    const logoSrc = variant === 'icon' ? hubConfig.iconLogo : hubConfig.logo
    
    return (
      <div ref={ref} className={cn('flex items-center', className)} {...props}>
        <img
          src={logoSrc}
          alt={`${hubConfig.displayName} Logo`}
          className={cn(sizeClasses[size], 'object-contain')}
          style={{ filter: `hue-rotate(${getHueRotation(hubType)}deg)` }}
        />
        {variant === 'full' && (
          <span className="ml-2 text-lg font-semibold" style={{ color: hubConfig.primaryColor }}>
            {hubConfig.displayName}
          </span>
        )}
      </div>
    )
  }
)

HubLogo.displayName = 'HubLogo'

// Helper function to adjust logo colors based on hub
const getHueRotation = (hubType: HubType): number => {
  switch (hubType) {
    case 'gnymble': return 120 // Green tint
    case 'percymd': return 0   // Red tint (original)
    case 'percytext': return 270 // Purple tint
    case 'percytech': return 210 // Blue tint
    default: return 0
  }
}