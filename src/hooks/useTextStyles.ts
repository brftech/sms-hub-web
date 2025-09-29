import { useMemo } from 'react';

export type TextVariant = 
  | 'heading'
  | 'subheading'
  | 'body'
  | 'primary' 
  | 'secondary' 
  | 'muted' 
  | 'caption' 
  | 'description'
  | 'accent'
  | 'destructive'
  | 'error'
  | 'warning'
  | 'success'
  | 'interactive'
  | 'disabled';

export interface TextStyleOptions {
  variant?: TextVariant;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  center?: boolean;
}

/**
 * Hook for consistent, accessible text styling across the app
 */
export const useTextStyles = (options: TextStyleOptions = {}) => {
  const {
    variant = 'secondary',
    size = 'base',
    weight = 'normal',
    center = false
  } = options;

  const textClasses = useMemo(() => {
    const baseClasses = [];
    
    // Variant-based colors (accessibility compliant)
    switch (variant) {
      case 'primary':
        baseClasses.push('text-white');
        break;
      case 'secondary':
        baseClasses.push('text-gray-300');
        break;
      case 'muted':
        baseClasses.push('text-gray-400');
        break;
      case 'caption':
        baseClasses.push('text-gray-400 text-sm');
        break;
      case 'description':
        baseClasses.push('text-gray-300 text-sm');
        break;
      case 'error':
        baseClasses.push('text-red-400');
        break;
      case 'warning':
        baseClasses.push('text-yellow-400');
        break;
      case 'success':
        baseClasses.push('text-green-400');
        break;
      case 'interactive':
        baseClasses.push('text-orange-400 hover:text-orange-300 transition-colors');
        break;
      case 'disabled':
        baseClasses.push('text-gray-300 opacity-50');
        break;
    }
    
    // Size classes
    if (variant !== 'caption' && variant !== 'description') {
      switch (size) {
        case 'xs':
          baseClasses.push('text-xs');
          break;
        case 'sm':
          baseClasses.push('text-sm');
          break;
        case 'base':
          baseClasses.push('text-base');
          break;
        case 'lg':
          baseClasses.push('text-lg');
          break;
        case 'xl':
          baseClasses.push('text-xl');
          break;
      }
    }
    
    // Weight classes
    switch (weight) {
      case 'medium':
        baseClasses.push('font-medium');
        break;
      case 'semibold':
        baseClasses.push('font-semibold');
        break;
      case 'bold':
        baseClasses.push('font-bold');
        break;
    }
    
    // Center alignment
    if (center) {
      baseClasses.push('text-center');
    }
    
    return baseClasses.join(' ');
  }, [variant, size, weight, center]);

  // Helper function to get text classes without hook
  const getTextClasses = (options: TextStyleOptions) => {
    const baseClasses = ['text'];
    
    // Variant styles
    switch (options.variant) {
      case 'heading':
        baseClasses.push('font-bold text-foreground');
        break;
      case 'subheading':
        baseClasses.push('font-semibold text-foreground');
        break;
      case 'body':
        baseClasses.push('text-foreground');
        break;
      case 'description':
        baseClasses.push('text-muted-foreground');
        break;
      case 'caption':
        baseClasses.push('text-xs text-muted-foreground');
        break;
      case 'secondary':
        baseClasses.push('text-muted-foreground');
        break;
      case 'muted':
        baseClasses.push('text-muted-foreground');
        break;
      case 'accent':
        baseClasses.push('text-accent-foreground');
        break;
      case 'destructive':
        baseClasses.push('text-destructive');
        break;
      case 'success':
        baseClasses.push('text-green-600');
        break;
      case 'warning':
        baseClasses.push('text-yellow-600');
        break;
      default:
        baseClasses.push('text-foreground');
    }
    
    // Size styles
    switch (options.size) {
      case 'xs':
        baseClasses.push('text-xs');
        break;
      case 'sm':
        baseClasses.push('text-sm');
        break;
      case 'base':
        baseClasses.push('text-base');
        break;
      case 'lg':
        baseClasses.push('text-lg');
        break;
      case 'xl':
        baseClasses.push('text-xl');
        break;
      case '2xl':
        baseClasses.push('text-2xl');
        break;
      case '3xl':
        baseClasses.push('text-3xl');
        break;
      case '4xl':
        baseClasses.push('text-4xl');
        break;
      default:
        baseClasses.push('text-base');
    }
    
    // Weight styles
    if (options.weight) {
      switch (options.weight) {
        case 'light':
          baseClasses.push('font-light');
          break;
        case 'normal':
          baseClasses.push('font-normal');
          break;
        case 'medium':
          baseClasses.push('font-medium');
          break;
        case 'semibold':
          baseClasses.push('font-semibold');
          break;
        case 'bold':
          baseClasses.push('font-bold');
          break;
        case 'extrabold':
          baseClasses.push('font-extrabold');
          break;
      }
    }
    
    // Center alignment
    if (options.center) {
      baseClasses.push('text-center');
    }
    
    return baseClasses.join(' ');
  };

  return {
    textClasses,
    // Helper functions for common patterns (without hook calls)
    getDescriptionText: (text: string, center = false) => ({
      className: getTextClasses({ variant: 'description', center }),
      children: text
    }),
    getCaptionText: (text: string, center = false) => ({
      className: getTextClasses({ variant: 'caption', center }),
      children: text
    }),
    getSecondaryText: (text: string, size: TextStyleOptions['size'] = 'base') => ({
      className: getTextClasses({ variant: 'secondary', size }),
      children: text
    })
  };
};
