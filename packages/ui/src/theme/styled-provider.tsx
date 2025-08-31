import React from 'react'
import { ThemeProvider, createGlobalStyle } from 'styled-components'
import { HubType } from '@sms-hub/types'
import { useHub } from '../providers/hub-provider'

// Hub color configurations
const hubColors = {
  percytech: {
    primary: '#1F2937',
    secondary: '#6B7280', 
    accent: '#3B82F6',
    primaryRgb: '31, 41, 55',
    secondaryRgb: '107, 114, 128',
    accentRgb: '59, 130, 246'
  },
  gnymble: {
    primary: '#059669',
    secondary: '#10B981',
    accent: '#34D399', 
    primaryRgb: '5, 150, 105',
    secondaryRgb: '16, 185, 129',
    accentRgb: '52, 211, 153'
  },
  percymd: {
    primary: '#DC2626',
    secondary: '#EF4444',
    accent: '#F87171',
    primaryRgb: '220, 38, 38', 
    secondaryRgb: '239, 68, 68',
    accentRgb: '248, 113, 113'
  },
  percytext: {
    primary: '#7C3AED',
    secondary: '#8B5CF6',
    accent: '#A78BFA',
    primaryRgb: '124, 58, 237',
    secondaryRgb: '139, 92, 246', 
    accentRgb: '167, 139, 250'
  }
}

// Base design tokens
const baseTheme = {
  colors: {
    background: 'hsl(0, 0%, 100%)',
    foreground: 'hsl(0, 0%, 3.9%)',
    card: 'hsl(0, 0%, 100%)',
    cardForeground: 'hsl(0, 0%, 3.9%)',
    popover: 'hsl(0, 0%, 100%)',
    popoverForeground: 'hsl(0, 0%, 3.9%)',
    primary: 'hsl(0, 0%, 9%)',
    primaryForeground: 'hsl(0, 0%, 98%)',
    secondary: 'hsl(0, 0%, 96.1%)',
    secondaryForeground: 'hsl(0, 0%, 9%)',
    muted: 'hsl(0, 0%, 96.1%)',
    mutedForeground: 'hsl(0, 0%, 45.1%)',
    accent: 'hsl(0, 0%, 96.1%)',
    accentForeground: 'hsl(0, 0%, 9%)',
    destructive: 'hsl(0, 84.2%, 60.2%)',
    destructiveForeground: 'hsl(0, 0%, 98%)',
    border: 'hsl(0, 0%, 89.8%)',
    input: 'hsl(0, 0%, 89.8%)',
    ring: 'hsl(0, 0%, 3.9%)',
  },
  radius: '0.5rem',
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem', 
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  }
}

// Global styles that work with Tailwind
const GlobalStyle = createGlobalStyle<{ hub: HubType }>`
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 3.9%;
    --radius: 0.5rem;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    
    /* Hub colors */
    --hub-primary: ${props => hubColors[props.hub].primary};
    --hub-secondary: ${props => hubColors[props.hub].secondary};
    --hub-accent: ${props => hubColors[props.hub].accent};
    --hub-primary-rgb: ${props => hubColors[props.hub].primaryRgb};
    --hub-secondary-rgb: ${props => hubColors[props.hub].secondaryRgb};
    --hub-accent-rgb: ${props => hubColors[props.hub].accentRgb};
  }

  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }

  * {
    border-color: hsl(var(--border));
  }
  
  body {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
  }
`

// Styled theme provider component that integrates with HubProvider
export interface StyledHubProviderProps {
  children: React.ReactNode
}

export const StyledHubProvider: React.FC<StyledHubProviderProps> = ({ children }) => {
  const { currentHub } = useHub()
  
  const theme = {
    ...baseTheme,
    hub: hubColors[currentHub]
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle hub={currentHub} />
      {children}
    </ThemeProvider>
  )
}

// Utility functions for styled components
export const getHubColor = (hub: HubType, colorType: 'primary' | 'secondary' | 'accent') => {
  return hubColors[hub][colorType]
}

export const createHubStyles = (hub: HubType) => ({
  colors: hubColors[hub],
  utils: {
    hubText: (colorType: 'primary' | 'secondary' | 'accent') => `color: ${hubColors[hub][colorType]};`,
    hubBg: (colorType: 'primary' | 'secondary' | 'accent') => `background-color: ${hubColors[hub][colorType]};`,
    hubBorder: (colorType: 'primary' | 'secondary' | 'accent') => `border-color: ${hubColors[hub][colorType]};`
  }
})

export { hubColors, baseTheme }