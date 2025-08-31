export type HubType = 'percytech' | 'gnymble' | 'percymd' | 'percytext'

export interface HubConfig {
  id: HubType
  hubNumber: number
  name: string
  displayName: string
  tagline: string
  description: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  logo: string
  iconLogo: string
  favicon: string
  theme: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
    card: string
    border: string
    muted: string
  }
  content: {
    heroTitle: string
    heroSubtitle: string
    features: string[]
    ctaText: string
  }
  deploymentUrls: {
    production: string
    staging: string
    development: string
  }
  features: string[]
  settings: {
    tcr_enabled: boolean
    bandwidth_enabled: boolean
    regulated_industry?: boolean
    healthcare_focused?: boolean
    texting_focused?: boolean
  }
}

export const HUB_CONFIGS: Record<HubType, HubConfig> = {
  percytech: {
    id: 'percytech',
    hubNumber: 0,
    name: 'PercyTech',
    displayName: 'PercyTech Platform',
    tagline: 'Enterprise Technology Solutions',
    description: 'Umbrella administrative hub for multi-tenant SMS platform management.',
    primaryColor: '#1F2937',
    secondaryColor: '#6B7280',
    accentColor: '#3B82F6',
    logo: '/percytech-text-logo.svg',
    iconLogo: '/percytech-icon-logo.svg',
    favicon: '/percytech-favicon.ico',
    theme: {
      primary: '31 41 55',
      secondary: '107 114 128',
      accent: '59 130 246',
      background: '0 0% 100%',
      foreground: '0 0% 3.9%',
      card: '0 0% 100%',
      border: '0 0% 89.8%',
      muted: '0 0% 96.1%'
    },
    content: {
      heroTitle: 'PercyTech Platform',
      heroSubtitle: 'Administrative hub for SMS platform management',
      features: [
        'Super admin controls',
        'Analytics dashboard',
        'Support texting',
        'Hub management',
        'User administration'
      ],
      ctaText: 'Access Admin Portal'
    },
    deploymentUrls: {
      production: 'https://percytech.com',
      staging: 'https://staging.percytech.com',
      development: 'http://localhost:3000'
    },
    features: ['super_admin', 'analytics', 'support_texting'],
    settings: {
      tcr_enabled: true,
      bandwidth_enabled: true
    }
  },
  gnymble: {
    id: 'gnymble',
    hubNumber: 1,
    name: 'Gnymble',
    displayName: 'Gnymble SMS Platform',
    tagline: 'Compliant SMS Marketing for Premium Retailers',
    description: 'Professional SMS platform for highly-regulated industries including cigar, speakeasies, and luxury retail.',
    primaryColor: '#059669',
    secondaryColor: '#10B981',
    accentColor: '#34D399',
    logo: '/gnymble-text-logo.svg',
    iconLogo: '/gnymble-icon-logo.svg',
    favicon: '/gnymble-favicon.ico',
    theme: {
      primary: '5 150 105',
      secondary: '16 185 129',
      accent: '52 211 153',
      background: '0 0% 100%',
      foreground: '0 0% 3.9%',
      card: '0 0% 100%',
      border: '0 0% 89.8%',
      muted: '0 0% 96.1%'
    },
    content: {
      heroTitle: 'Gnymble',
      heroSubtitle: 'Compliant texting for premium retailers',
      features: [
        'SMS compliance',
        'Regulated industry focus',
        'Premium retail support',
        'TCR integration',
        'Customer engagement'
      ],
      ctaText: 'Start Compliant Texting'
    },
    deploymentUrls: {
      production: 'https://gnymble.com',
      staging: 'https://staging.gnymble.com',
      development: 'http://localhost:3001'
    },
    features: ['texting', 'tcr', 'bandwidth', 'onboarding'],
    settings: {
      tcr_enabled: true,
      bandwidth_enabled: true,
      regulated_industry: true
    }
  },
  percymd: {
    id: 'percymd',
    hubNumber: 2,
    name: 'PercyMD',
    displayName: 'PercyMD Healthcare Platform',
    tagline: 'HIPAA-Compliant Healthcare Communication',
    description: 'Secure SMS platform designed specifically for healthcare providers and medical practices.',
    primaryColor: '#DC2626',
    secondaryColor: '#EF4444',
    accentColor: '#F87171',
    logo: '/percymd-text-logo.svg',
    iconLogo: '/percymd-icon-logo.svg',
    favicon: '/percymd-favicon.ico',
    theme: {
      primary: '220 38 38',
      secondary: '239 68 68',
      accent: '248 113 113',
      background: '0 0% 100%',
      foreground: '0 0% 3.9%',
      card: '0 0% 100%',
      border: '0 0% 89.8%',
      muted: '0 0% 96.1%'
    },
    content: {
      heroTitle: 'PercyMD',
      heroSubtitle: 'HIPAA-compliant healthcare communication',
      features: [
        'HIPAA compliance',
        'Healthcare providers',
        'Patient communication',
        'Medical practice support',
        'Secure messaging'
      ],
      ctaText: 'Enable Healthcare Texting'
    },
    deploymentUrls: {
      production: 'https://percymd.com',
      staging: 'https://staging.percymd.com',
      development: 'http://localhost:3002'
    },
    features: ['texting', 'tcr', 'bandwidth', 'onboarding'],
    settings: {
      tcr_enabled: true,
      bandwidth_enabled: true,
      healthcare_focused: true
    }
  },
  percytext: {
    id: 'percytext',
    hubNumber: 3,
    name: 'PercyText',
    displayName: 'PercyText Messaging Platform',
    tagline: 'Advanced SMS Solutions',
    description: 'Comprehensive SMS platform focused on advanced texting capabilities and integrations.',
    primaryColor: '#7C3AED',
    secondaryColor: '#8B5CF6',
    accentColor: '#A78BFA',
    logo: '/percytext-text-logo.svg',
    iconLogo: '/percytext-icon-logo.svg',
    favicon: '/percytext-favicon.ico',
    theme: {
      primary: '124 58 237',
      secondary: '139 92 246',
      accent: '167 139 250',
      background: '0 0% 100%',
      foreground: '0 0% 3.9%',
      card: '0 0% 100%',
      border: '0 0% 89.8%',
      muted: '0 0% 96.1%'
    },
    content: {
      heroTitle: 'PercyText',
      heroSubtitle: 'Advanced SMS solutions for modern businesses',
      features: [
        'Advanced texting',
        'SMS automation',
        'Integration focus',
        'Developer tools',
        'API access'
      ],
      ctaText: 'Power Up Your Texting'
    },
    deploymentUrls: {
      production: 'https://percytext.com',
      staging: 'https://staging.percytext.com',
      development: 'http://localhost:3003'
    },
    features: ['texting', 'tcr', 'bandwidth', 'onboarding'],
    settings: {
      tcr_enabled: true,
      bandwidth_enabled: true,
      texting_focused: true
    }
  }
}

export const getHubConfig = (hubType: HubType): HubConfig => {
  return HUB_CONFIGS[hubType]
}

export const getHubByNumber = (hubNumber: number): HubConfig | null => {
  const hub = Object.values(HUB_CONFIGS).find(config => config.hubNumber === hubNumber)
  return hub || null
}

export const getHubByDomain = (domain: string): HubConfig | null => {
  const hub = Object.values(HUB_CONFIGS).find(config => 
    config.deploymentUrls.production.includes(domain) ||
    config.deploymentUrls.staging.includes(domain) ||
    config.deploymentUrls.development.includes(domain)
  )
  return hub || null
}