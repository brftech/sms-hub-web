#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

/**
 * Script to automatically fix accessibility issues by replacing low-contrast colors
 */

// Define color replacements for accessibility compliance
const colorReplacements = {
  // Replace gray-500 with gray-300 for better contrast
  'text-gray-500': 'text-gray-300',
  
  // Replace other low-contrast colors
  'text-gray-600': 'text-gray-200',
  'text-gray-700': 'text-gray-100',
};

// Files to process
const filePatterns = [
  'src/**/*.{ts,tsx}',
  'packages/ui/src/**/*.{ts,tsx}',
  // Exclude node_modules and build directories
  '!**/node_modules/**',
  '!**/dist/**',
  '!**/build/**'
];

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    // Apply color replacements
    Object.entries(colorReplacements).forEach(([oldColor, newColor]) => {
      const regex = new RegExp(oldColor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      if (content.includes(oldColor)) {
        content = content.replace(regex, newColor);
        hasChanges = true;
        console.log(`✓ Replaced ${oldColor} with ${newColor} in ${filePath}`);
      }
    });
    
    // Write back if changes were made
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🔍 Finding files to process...');
  
  const files = [];
  for (const pattern of filePatterns) {
    const matches = await glob(pattern);
    files.push(...matches);
  }
  
  console.log(`📁 Found ${files.length} files to check`);
  
  let processedCount = 0;
  let changedCount = 0;
  
  files.forEach(file => {
    processedCount++;
    if (processFile(file)) {
      changedCount++;
    }
  });
  
  console.log(`\n✅ Processing complete!`);
  console.log(`📊 Processed: ${processedCount} files`);
  console.log(`🔄 Changed: ${changedCount} files`);
  console.log(`\n🎯 Accessibility improvements applied!`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { processFile, colorReplacements };
