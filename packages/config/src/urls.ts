import { environmentConfig } from './environment';

/**
 * Centralized URL management for the SMS Hub platform
 * All URLs are environment-aware and automatically adjust based on the current environment
 */

export class URLs {
  private static instance: URLs;
  private config = environmentConfig;

  private constructor() {}

  static getInstance(): URLs {
    if (!URLs.instance) {
      URLs.instance = new URLs();
    }
    return URLs.instance;
  }

  /**
   * Get the base URL for the web app (marketing/auth)
   */
  get webApp(): string {
    return this.config.webAppUrl;
  }

  /**
   * Get the base URL for the unified app (authenticated dashboard)
   */
  get unifiedApp(): string {
    return this.config.unifiedAppUrl;
  }

  /**
   * Get the base URL for the API
   */
  get api(): string {
    return this.config.apiUrl;
  }

  /**
   * Get the Supabase URL
   */
  get supabase(): string {
    return this.config.supabaseUrl;
  }

  /**
   * Auth-related URLs
   */
  get auth() {
    return {
      login: `${this.webApp}/login`,
      signup: `${this.webApp}/signup`,
      checkEmail: `${this.webApp}/check-email`,
      verifyAuth: `${this.webApp}/verify-auth`,
      callback: `${this.webApp}/auth-callback`,
      logout: `${this.webApp}/logout`,
    };
  }

  /**
   * Dashboard URLs
   */
  get dashboard() {
    return {
      home: this.unifiedApp,
      user: `${this.unifiedApp}/user`,
      admin: `${this.unifiedApp}/admin`,
      superadmin: `${this.unifiedApp}/superadmin`,
      onboarding: `${this.unifiedApp}/onboarding`,
      accountDetails: `${this.unifiedApp}/account-details`,
      payment: `${this.unifiedApp}/payment`,
      paymentCallback: `${this.unifiedApp}/payment-callback`,
    };
  }

  /**
   * Get redirect URL after authentication
   * @param role - User role to determine appropriate dashboard
   * @param returnTo - Optional specific path to return to
   */
  getAuthRedirect(role?: string, returnTo?: string): string {
    if (returnTo) {
      return `${this.unifiedApp}${returnTo}`;
    }

    switch (role) {
      case 'SUPERADMIN':
        return this.dashboard.superadmin;
      case 'ADMIN':
        return this.dashboard.admin;
      case 'ONBOARDED':
      case 'USER':
      default:
        return this.dashboard.user;
    }
  }

  /**
   * Get email confirmation redirect URL
   * This is what goes in the magic link email
   */
  getEmailConfirmationUrl(): string {
    return `${this.webApp}/verify-auth`;
  }

  /**
   * Build URL with query parameters
   */
  buildUrl(baseUrl: string, params: Record<string, string | number | boolean>): string {
    const url = new URL(baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
    return url.toString();
  }

  /**
   * Check if a URL is external (not part of our platform)
   */
  isExternal(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const ourDomains = [
        new URL(this.webApp).hostname,
        new URL(this.unifiedApp).hostname,
        new URL(this.api).hostname,
      ];
      return !ourDomains.includes(urlObj.hostname);
    } catch {
      return false;
    }
  }

  /**
   * Ensure URL uses HTTPS in production
   */
  ensureSecure(url: string): string {
    if (this.config.security.requireHttps && url.startsWith('http://')) {
      return url.replace('http://', 'https://');
    }
    return url;
  }
}

// Export singleton instance
export const urls = URLs.getInstance();