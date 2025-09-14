import { environmentConfig } from './environment';

/**
 * Feature flag management for the SMS Hub platform
 * Controls which features are enabled in different environments
 */

export class Features {
  private static instance: Features;
  private config = environmentConfig.features;

  private constructor() {}

  static getInstance(): Features {
    if (!Features.instance) {
      Features.instance = new Features();
    }
    return Features.instance;
  }

  /**
   * Check if debug mode is enabled
   * Shows additional debugging information and tools
   */
  get debugMode(): boolean {
    return this.config.debugMode;
  }

  /**
   * Check if dev authentication is enabled
   * Allows bypassing normal auth flow with a token
   */
  get devAuth(): boolean {
    return this.config.devAuth;
  }

  /**
   * Check if email confirmation is required
   * In dev, we might skip this for faster testing
   */
  get emailConfirmation(): boolean {
    return this.config.emailConfirmation;
  }

  /**
   * Check if analytics tracking is enabled
   */
  get analytics(): boolean {
    return this.config.analytics;
  }

  /**
   * Check if error reporting is enabled
   */
  get errorReporting(): boolean {
    return this.config.errorReporting;
  }

  /**
   * Check if hub switcher is enabled
   * Allows switching between different hubs in the UI
   */
  get hubSwitcher(): boolean {
    return this.config.hubSwitcher;
  }

  /**
   * Check if a specific feature is enabled
   * @param featureName - Name of the feature to check
   */
  isEnabled(featureName: keyof typeof this.config): boolean {
    return Boolean(this.config[featureName]);
  }

  /**
   * Override a feature flag (useful for testing)
   * Note: This only affects the current session
   */
  override(featureName: keyof typeof this.config, value: boolean): void {
    if (environmentConfig.isDevelopment) {
      this.config[featureName] = value;
      console.log(`Feature '${featureName}' overridden to: ${value}`);
    } else {
      console.warn('Feature overrides are only allowed in development');
    }
  }

  /**
   * Get all feature flags
   */
  getAll(): typeof this.config {
    return { ...this.config };
  }

  /**
   * Log current feature configuration (dev only)
   */
  debug(): void {
    if (this.config.debugMode) {
      console.group('🚀 Feature Flags');
      Object.entries(this.config).forEach(([key, value]) => {
        console.log(`${key}: ${value ? '✅' : '❌'}`);
      });
      console.groupEnd();
    }
  }
}

// Export singleton instance
export const features = Features.getInstance();