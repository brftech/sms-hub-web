/**
 * Hub-Specific Styling Tests
 * 
 * Tests to ensure hub-specific styling is correctly applied via hubColors.tailwind
 * and that no broken dynamic Tailwind class patterns exist.
 */

import { describe, it, expect } from 'vitest';
import { getHubColors, getHubDemoMessages } from '@sms-hub/hub-logic';
import type { HubType } from '@sms-hub/ui';

describe('Hub-Specific Styling', () => {
  const hubs: HubType[] = ['gnymble', 'percytech', 'percymd', 'percytext'];

  describe('Hub Colors', () => {
    hubs.forEach(hubType => {
      it(`should have complete tailwind color definitions for ${hubType}`, () => {
        const colors = getHubColors(hubType);
        
        // Verify primary colors exist
        expect(colors.primary).toBeDefined();
        expect(colors.primary).toMatch(/^#[0-9A-F]{6}$/i);
        expect(colors.secondary).toBeDefined();
        expect(colors.accent).toBeDefined();
        
        // Verify tailwind classes exist
        expect(colors.tailwind).toBeDefined();
        expect(colors.tailwind.text).toBeDefined();
        expect(colors.tailwind.bg).toBeDefined();
        expect(colors.tailwind.bgHover).toBeDefined();
        expect(colors.tailwind.bgLight).toBeDefined();
        expect(colors.tailwind.border).toBeDefined();
        expect(colors.tailwind.borderLight).toBeDefined();
        expect(colors.tailwind.contactButton).toBeDefined();
        
        // Verify classes are actual Tailwind class strings (not template literals)
        expect(colors.tailwind.text).not.toContain('${');
        expect(colors.tailwind.bg).not.toContain('${');
        expect(colors.tailwind.contactButton).not.toContain('${');
      });
      
      it(`should have contactButton class with proper structure for ${hubType}`, () => {
        const colors = getHubColors(hubType);
        const buttonClass = colors.tailwind.contactButton;
        
        // Verify it's a border-2 transparent button
        expect(buttonClass).toContain('border-2');
        expect(buttonClass).toContain('bg-transparent');
        expect(buttonClass).toContain('text-white');
        expect(buttonClass).toContain('hover:bg-');
        expect(buttonClass).toContain('hover:border-');
      });
    });
    
    it('should have unique primary colors for each hub', () => {
      const colors = hubs.map(hub => getHubColors(hub).primary);
      const uniqueColors = new Set(colors);
      
      expect(uniqueColors.size).toBe(hubs.length);
    });
  });
  
  describe('Hub Demo Messages', () => {
    hubs.forEach(hubType => {
      it(`should have demo messages for ${hubType}`, () => {
        const messages = getHubDemoMessages(hubType);
        
        expect(messages).toBeDefined();
        expect(Array.isArray(messages)).toBe(true);
        expect(messages.length).toBeGreaterThan(0);
      });
      
      it(`should have properly structured demo scenarios for ${hubType}`, () => {
        const messages = getHubDemoMessages(hubType);
        
        messages.forEach(scenario => {
          expect(scenario.id).toBeDefined();
          expect(scenario.title).toBeDefined();
          expect(Array.isArray(scenario.messages)).toBe(true);
          expect(scenario.messages.length).toBeGreaterThan(0);
          
          scenario.messages.forEach(msg => {
            expect(msg.id).toBeDefined();
            expect(msg.content).toBeDefined();
            expect(msg.sender).toMatch(/^(user|business)$/);
            expect(msg.timestamp).toBeInstanceOf(Date);
          });
        });
      });
      
      it(`should have hub-specific content in demo messages for ${hubType}`, () => {
        const messages = getHubDemoMessages(hubType);
        const allContent = messages
          .flatMap(s => s.messages)
          .map(m => m.content.toLowerCase())
          .join(' ');
        
        // Each hub should have distinct terminology
        const hubSpecificTerms: Record<HubType, string[]> = {
          gnymble: ['cigar', 'lounge', 'humidor'],
          percytech: ['service', 'appointment', 'business'],
          percymd: ['appointment', 'prescription', 'health', 'medical'],
          percytext: ['fitness', 'class', 'workout', 'studio'],
        };
        
        const terms = hubSpecificTerms[hubType];
        const hasHubSpecificContent = terms.some(term => 
          allContent.includes(term.toLowerCase())
        );
        
        expect(hasHubSpecificContent).toBe(true);
      });
    });
    
    it('should return unique messages for each hub', () => {
      const messagesByHub = hubs.map(hub => getHubDemoMessages(hub));
      
      // Compare first scenario titles to ensure they're different
      const firstTitles = messagesByHub.map(messages => messages[0]?.title);
      const uniqueTitles = new Set(firstTitles);
      
      // At least some hubs should have different titles
      expect(uniqueTitles.size).toBeGreaterThan(1);
    });
  });
  
  describe('Color Consistency', () => {
    it('should have consistent color naming across all hubs', () => {
      const colorKeys = new Set<string>();
      
      hubs.forEach(hub => {
        const colors = getHubColors(hub);
        const keys = Object.keys(colors.tailwind);
        keys.forEach(key => colorKeys.add(key));
      });
      
      // All hubs should have the same set of tailwind color keys
      hubs.forEach(hub => {
        const colors = getHubColors(hub);
        const keys = Object.keys(colors.tailwind);
        
        expect(keys.sort()).toEqual(Array.from(colorKeys).sort());
      });
    });
  });
});

