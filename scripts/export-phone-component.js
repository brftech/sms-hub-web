import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function exportPhoneComponent(scenarioIndex = 0) {
  console.log('🚀 Starting phone component export...');
  
  // Launch browser
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1200, height: 800 },
    deviceScaleFactor: 2, // High DPI for better quality
  });
  
  const page = await context.newPage();
  
  try {
    // Navigate to the phone demo page
    console.log('📱 Navigating to phone demo page...');
    await page.goto('http://localhost:3000/phone-demo', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Wait for the component to be fully loaded
    console.log('⏳ Waiting for component to load...');
    await page.waitForSelector('.phone-3d', { timeout: 15000 });
    
    // Wait for all animations and content to load
    await page.waitForTimeout(3000);
    
    // Add custom styling to fix margins and add rounded corners
    await page.addStyleTag({
      content: `
        .phone-3d {
          border-radius: 36px !important;
          overflow: hidden !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
          background: #000 !important;
          margin: 0 auto !important;
          padding: 0 !important;
        }
        
        .phone-screen {
          border-radius: 30px !important;
          margin: 8px !important;
          overflow: hidden !important;
        }
      `
    });
    
    // Wait a moment for styles to apply
    await page.waitForTimeout(500);
    
    // Wait for specific scenario to appear naturally
    if (scenarioIndex > 0) {
      console.log(`🎯 Waiting for scenario ${scenarioIndex + 1} to appear naturally...`);
      
      // Since scenarios cycle every 8 seconds, wait for the desired scenario
      // We'll wait for the text content to change to match our target scenario
      const targetTexts = [
        'Gymble Cigar Lounge', // Scenario 0 - Gnymble Event
        'Drew Estate Masterclass', // Scenario 1 - Event Announcement
        'Arturo Fuente Opus X', // Scenario 2 - New Arrivals
        'Davidoff', // Scenario 3 - Industry News
      ];
      
      const targetText = targetTexts[scenarioIndex];
      if (targetText) {
        console.log(`⏳ Waiting for "${targetText}" to appear...`);
        
        // Wait up to 30 seconds for the right scenario to cycle in
        let attempts = 0;
        const maxAttempts = 15; // 15 * 2 seconds = 30 seconds max
        
        while (attempts < maxAttempts) {
          const currentContent = await page.textContent('.phone-messages');
          if (currentContent && currentContent.includes(targetText)) {
            console.log(`✅ Found target scenario with "${targetText}"`);
            break;
          }
          
          console.log(`⏳ Attempt ${attempts + 1}/${maxAttempts} - waiting for scenario...`);
          await page.waitForTimeout(2000); // Wait 2 seconds between checks
          attempts++;
        }
        
        if (attempts >= maxAttempts) {
          console.log(`⚠️ Timeout waiting for "${targetText}", capturing current scenario`);
        }
      }
    } else {
      // For scenario 0, just wait a moment to ensure first scenario is loaded
      console.log('🎯 Capturing first scenario...');
      await page.waitForTimeout(1000);
    }
    
    // Take a full page screenshot first for debugging
    const debugPath = path.join(path.dirname(__dirname), 'exports', 'debug-full-page.png');
    await page.screenshot({ path: debugPath, fullPage: true });
    console.log(`🔍 Debug full-page screenshot saved: ${debugPath}`);
    
    // Use element screenshot instead of clipping - this captures only the element
    console.log('📱 Locating phone component...');
    const phoneElement = await page.locator('.phone-3d').first();
    
    if (!phoneElement) {
      throw new Error('Phone component not found');
    }
    
    // Check if element is visible
    const isVisible = await phoneElement.isVisible();
    if (!isVisible) {
      throw new Error('Phone component is not visible');
    }
    
    console.log('📱 Phone component found and visible');
    
    // Take screenshot of just the element (no clipping needed)
    const screenshotOptions = {
      type: 'png',
      scale: 'device' // Use device scale for crisp images
    };
    
    // Ensure the exports directory exists
    const exportsDir = path.join(path.dirname(__dirname), 'exports');
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }
    
    // Generate filename with timestamp and scenario info
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').replace('T', '-').split('.')[0];
    const scenarioNames = ['gnymble-event', 'event-announcement', 'new-arrivals', 'industry-news'];
    const scenarioName = scenarioNames[scenarioIndex] || 'default';
    const filename = `phone-${scenarioName}-${timestamp}.png`;
    const filepath = path.join(exportsDir, filename);
    
    // Take the screenshot of just the phone element
    console.log('📸 Capturing phone component screenshot...');
    await phoneElement.screenshot({
      path: filepath,
      ...screenshotOptions
    });
    
    console.log(`✅ Phone component exported successfully!`);
    console.log(`📁 Saved to: ${filepath}`);
    
    return filepath;
    
  } catch (error) {
    console.error('❌ Error exporting phone component:', error.message);
    
    // Try to take a full page screenshot as fallback
    console.log('📸 Attempting fallback full-page screenshot...');
    const fallbackPath = path.join(path.dirname(__dirname), 'exports', 'phone-demo-fallback.png');
    await page.screenshot({ path: fallbackPath, fullPage: true });
    console.log(`📁 Fallback screenshot saved to: ${fallbackPath}`);
    
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the export if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  // Get scenario index from command line args (default to 0)
  const scenarioIndex = parseInt(process.argv[2]) || 0;
  const scenarioNames = ['Gnymble Event', 'Event Announcement', 'New Arrivals (Opus X)', 'Industry News (Davidoff)'];
  
  console.log(`🎬 Exporting scenario: ${scenarioNames[scenarioIndex] || 'Default'}`);
  
  exportPhoneComponent(scenarioIndex)
    .then((filepath) => {
      console.log('\n🎉 Export completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Export failed:', error.message);
      process.exit(1);
    });
}

export { exportPhoneComponent };
