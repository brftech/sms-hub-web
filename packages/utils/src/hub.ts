import { HubType, HubConfig, HUB_CONFIGS } from '@sms-hub/types'

export const detectHubFromDomain = (hostname: string): HubType => {
  if (hostname.includes('gnymble')) return 'gnymble'
  if (hostname.includes('percymd')) return 'percymd'
  if (hostname.includes('percytext')) return 'percytext'
  return 'percytech' // Default to percytech
}

export const detectHubFromPath = (pathname: string): HubType | null => {
  if (pathname.startsWith('/gnymble')) return 'gnymble'
  if (pathname.startsWith('/percymd')) return 'percymd'
  if (pathname.startsWith('/percytext')) return 'percytext'
  if (pathname.startsWith('/percytech')) return 'percytech'
  return null
}

export const detectHubFromPort = (port: number): HubType => {
  switch (port) {
    case 3001: return 'gnymble'
    case 3002: return 'percymd'
    case 3003: return 'percytext'
    default: return 'percytech'
  }
}

export const getHubUrl = (hubType: HubType, environment: 'development' | 'staging' | 'production' = 'development'): string => {
  return HUB_CONFIGS[hubType].deploymentUrls[environment]
}

export const isValidHub = (hub: string): hub is HubType => {
  return Object.keys(HUB_CONFIGS).includes(hub)
}

export const getHubThemeCSS = (hubConfig: HubConfig): string => {
  return `
    :root {
      --hub-primary: ${hubConfig.primaryColor};
      --hub-secondary: ${hubConfig.secondaryColor};
      --hub-accent: ${hubConfig.accentColor};
      --hub-primary-rgb: ${hexToRgb(hubConfig.primaryColor)};
      --hub-secondary-rgb: ${hexToRgb(hubConfig.secondaryColor)};
      --hub-accent-rgb: ${hexToRgb(hubConfig.accentColor)};
    }
  `
}

export const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '0, 0, 0'
  
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ].join(', ')
}

export const getHubFeatures = (hubType: HubType): string[] => {
  return HUB_CONFIGS[hubType].features
}

export const hasHubFeature = (hubType: HubType, feature: string): boolean => {
  return HUB_CONFIGS[hubType].features.includes(feature)
}