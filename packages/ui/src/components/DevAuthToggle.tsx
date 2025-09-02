import React from 'react'
import styled from 'styled-components'
import { Shield } from 'lucide-react'
import { EnvironmentAdapter } from '../types'

const ToggleButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #1f2937;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s;
  z-index: 9999;
  
  &:hover {
    background: #374151;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
`

const DevBadge = styled.span`
  background: #ef4444;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

interface DevAuthToggleProps {
  environment: EnvironmentAdapter
  onActivate: () => void
}

export function DevAuthToggle({ environment, onActivate }: DevAuthToggleProps) {
  // Only show in development
  if (!environment.isDevelopment()) {
    return null
  }
  
  const handleClick = () => {
    console.log('Dev auth toggle clicked')
    onActivate()
  }
  
  return (
    <ToggleButton onClick={handleClick} title="Activate dev superadmin mode">
      <Shield size={16} />
      <span>Dev Superadmin</span>
      <DevBadge>DEV</DevBadge>
    </ToggleButton>
  )
}