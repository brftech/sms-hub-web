import { useMemo } from 'react';

export type TextVariant = 
  | 'primary' 
  | 'secondary' 
  | 'muted' 
  | 'caption' 
  | 'description'
  | 'error'
  | 'warning'
  | 'success'
  | 'interactive'
  | 'disabled';

export interface TextStyleOptions {
  variant?: TextVariant;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
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

  return {
    textClasses,
    // Helper functions for common patterns
    getDescriptionText: (text: string, center = false) => ({
      className: useTextStyles({ variant: 'description', center }).textClasses,
      children: text
    }),
    getCaptionText: (text: string, center = false) => ({
      className: useTextStyles({ variant: 'caption', center }).textClasses,
      children: text
    }),
    getSecondaryText: (text: string, size: TextStyleOptions['size'] = 'base') => ({
      className: useTextStyles({ variant: 'secondary', size }).textClasses,
      children: text
    })
  };
};
