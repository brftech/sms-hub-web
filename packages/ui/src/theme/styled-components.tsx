import styled, { css } from 'styled-components'
import { HubType } from '@sms-hub/types'
import { hubColors } from './styled-provider'

// Hub-aware styled components
export const HubText = styled.span<{ 
  hub: HubType
  variant?: 'primary' | 'secondary' | 'accent'
}>`
  color: ${props => hubColors[props.hub][props.variant || 'primary']};
`

export const StyledHubButton = styled.button<{ 
  hub: HubType
  variant?: 'primary' | 'secondary' | 'accent'
  size?: 'sm' | 'md' | 'lg'
}>`
  background-color: ${props => hubColors[props.hub][props.variant || 'primary']};
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => {
    switch (props.size) {
      case 'sm': return css`padding: 0.5rem 1rem; font-size: 0.875rem;`
      case 'lg': return css`padding: 0.75rem 2rem; font-size: 1.125rem;` 
      default: return css`padding: 0.625rem 1.5rem; font-size: 1rem;`
    }
  }}
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`

export const HubCard = styled.div<{ hub: HubType }>`
  background: white;
  border-radius: 0.5rem;
  border: 1px solid hsl(var(--border));
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  overflow: hidden;
  
  &:hover {
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    border-color: ${props => hubColors[props.hub].accent};
  }
`

export const HubBadge = styled.span<{ 
  hub: HubType
  variant?: 'primary' | 'secondary' | 'accent' | 'outline'
}>`
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1;
  
  ${props => {
    const colors = hubColors[props.hub]
    switch (props.variant) {
      case 'secondary':
        return css`
          background-color: ${colors.secondary};
          color: white;
        `
      case 'accent':
        return css`
          background-color: ${colors.accent};
          color: white;
        `
      case 'outline':
        return css`
          background-color: transparent;
          color: ${colors.primary};
          border: 1px solid ${colors.primary};
        `
      default:
        return css`
          background-color: ${colors.primary};
          color: white;
        `
    }
  }}
`

export const HubGradient = styled.div<{ hub: HubType; direction?: 'linear' | 'radial' }>`
  ${props => {
    const colors = hubColors[props.hub]
    return props.direction === 'radial' 
      ? css`background: radial-gradient(circle, ${colors.primary} 0%, ${colors.secondary} 100%);`
      : css`background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%);`
  }}
`

// Utility mixins for styled components
export const hubStyles = {
  text: (hub: HubType, variant: 'primary' | 'secondary' | 'accent' = 'primary') => css`
    color: ${hubColors[hub][variant]};
  `,
  
  background: (hub: HubType, variant: 'primary' | 'secondary' | 'accent' = 'primary') => css`
    background-color: ${hubColors[hub][variant]};
  `,
  
  border: (hub: HubType, variant: 'primary' | 'secondary' | 'accent' = 'primary') => css`
    border-color: ${hubColors[hub][variant]};
  `,
  
  gradient: (hub: HubType, direction: 'linear' | 'radial' = 'linear') => {
    const colors = hubColors[hub]
    return direction === 'radial' 
      ? css`background: radial-gradient(circle, ${colors.primary} 0%, ${colors.secondary} 100%);`
      : css`background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%);`
  }
}

export { hubColors }