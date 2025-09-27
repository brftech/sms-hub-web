// Minimal types for utils
export type HubType = 'gnymble' | 'percytech' | 'percymd' | 'percytext';

export interface HubConfig {
  id: number;
  name: string;
  hubNumber: number;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

export const HUB_CONFIGS = {
  gnymble: {
    id: 1,
    name: 'Gnymble',
    hubNumber: 1,
    primaryColor: '#FF6B35',
    secondaryColor: '#4ECDC4',
    accentColor: '#FFA500'
  },
  percytech: {
    id: 0,
    name: 'PercyTech',
    hubNumber: 0,
    primaryColor: '#007AFF',
    secondaryColor: '#5AC8FA',
    accentColor: '#FF3B30'
  },
  percymd: {
    id: 2,
    name: 'PercyMD',
    hubNumber: 2,
    primaryColor: '#5856D6',
    secondaryColor: '#AF52DE',
    accentColor: '#32ADE6'
  },
  percytext: {
    id: 3,
    name: 'PercyText',
    hubNumber: 3,
    primaryColor: '#FF9500',
    secondaryColor: '#FFCC00',
    accentColor: '#FF3B30'
  }
} as const;