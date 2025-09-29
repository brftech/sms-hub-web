import React from 'react';
import { Text, DescriptionText, CaptionText, SecondaryText, MutedText } from '../ui/Text';
import { useTextStyles } from '../../hooks/useTextStyles';

/**
 * Demo component showing the new text system in action
 */
export const TextSystemDemo: React.FC = () => {
  const { textClasses, getDescriptionText } = useTextStyles({
    variant: 'secondary',
    size: 'lg',
    center: true
  });

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-900 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-8 text-center">
        🎨 New Text System Demo
      </h2>

      <div className="space-y-6">
        {/* Method 1: Using Text Components */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-orange-400">Method 1: Text Components</h3>
          
          <DescriptionText center>
            This is a description using the DescriptionText component - automatically accessible!
          </DescriptionText>
          
          <CaptionText center>
            This is a caption using the CaptionText component
          </CaptionText>
          
          <SecondaryText size="lg" center>
            This is secondary text with large size
          </SecondaryText>
          
          <MutedText center>
            This is muted text for less important information
          </MutedText>
        </div>

        {/* Method 2: Using the Hook */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-orange-400">Method 2: useTextStyles Hook</h3>
          
          <p className={textClasses}>
            This text uses the useTextStyles hook with dynamic styling
          </p>
          
          <p className={useTextStyles({ variant: 'muted', size: 'sm' }).textClasses}>
            Small muted text using the hook
          </p>
        </div>

        {/* Method 3: Using Utility Classes */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-orange-400">Method 3: Utility Classes</h3>
          
          <p className="text-secondary text-center">
            This uses the new text-secondary utility class
          </p>
          
          <p className="text-description text-center">
            This uses the new text-description utility class
          </p>
          
          <p className="text-caption text-center">
            This uses the new text-caption utility class
          </p>
        </div>

        {/* Method 4: Using Tailwind Custom Colors */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-orange-400">Method 4: Custom Tailwind Colors</h3>
          
          <p className="text-text-secondary text-center">
            This uses the custom text-secondary color from Tailwind config
          </p>
          
          <p className="text-text-muted text-center">
            This uses the custom text-muted color from Tailwind config
          </p>
        </div>

        {/* Accessibility Info */}
        <div className="mt-8 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
          <h4 className="text-green-400 font-semibold mb-2">✅ Accessibility Benefits</h4>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• All text meets WCAG 2 AA contrast requirements (4.5:1 ratio)</li>
            <li>• Consistent styling across the entire application</li>
            <li>• Easy to maintain and update colors globally</li>
            <li>• Semantic naming makes intent clear</li>
            <li>• Type-safe with TypeScript support</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TextSystemDemo;
