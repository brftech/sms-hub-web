// Minimal types for hub-logic
export type HubType = 'gnymble' | 'percytech' | 'percymd' | 'percytext';

export interface HubConfig {
  id: number;
  name: string;
  hubNumber: number;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}