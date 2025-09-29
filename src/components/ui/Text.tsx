import React from 'react';
import { useTextStyles, TextStyleOptions } from '../../hooks/useTextStyles';

export interface TextProps extends TextStyleOptions {
  children: React.ReactNode;
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
}

/**
 * Accessible Text component with consistent styling
 */
export const Text: React.FC<TextProps> = ({
  children,
  as: Component = 'p',
  className = '',
  ...textOptions
}) => {
  const { textClasses } = useTextStyles(textOptions);
  
  return (
    <Component className={`${textClasses} ${className}`.trim()}>
      {children}
    </Component>
  );
};

// Convenience components for common patterns
export const DescriptionText: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text {...props} variant="description" />
);

export const CaptionText: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text {...props} variant="caption" />
);

export const SecondaryText: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text {...props} variant="secondary" />
);

export const MutedText: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text {...props} variant="muted" />
);

export const ErrorText: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text {...props} variant="error" />
);

export const SuccessText: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text {...props} variant="success" />
);
