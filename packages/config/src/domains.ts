/**
 * Domain configuration for production hub deployments
 * Each hub has its own domain in production
 */

export interface HubDomainConfig {
  production: {
    web: string;  // Marketing/landing site
    unified: string;  // Authenticated application
  };
  staging: {
    web: string;
    unified: string;
  };
  development: {
    web: string;
    unified: string;
  };
}

export const HUB_DOMAINS: Record<string, HubDomainConfig> = {
  gnymble: {
    production: {
      web: 'https://www.gnymble.com',
      unified: 'https://unified.gnymble.com'
    },
    staging: {
      web: 'https://staging.gnymble.com',
      unified: 'https://unified-staging.gnymble.com'
    },
    development: {
      web: 'https://dev.gnymble.com',
      unified: 'https://unified-dev.gnymble.com'
    }
  },
  percytech: {
    production: {
      web: 'https://www.percytech.com',
      unified: 'https://unified.percytech.com'
    },
    staging: {
      web: 'https://staging.percytech.com',
      unified: 'https://unified-staging.percytech.com'
    },
    development: {
      web: 'https://dev.percytech.com',
      unified: 'https://unified-dev.percytech.com'
    }
  },
  percymd: {
    production: {
      web: 'https://www.percymd.com',
      unified: 'https://unified.percymd.com'
    },
    staging: {
      web: 'https://staging.percymd.com',
      unified: 'https://unified-staging.percymd.com'
    },
    development: {
      web: 'https://dev.percymd.com',
      unified: 'https://unified-dev.percymd.com'
    }
  },
  percytext: {
    production: {
      web: 'https://www.percytext.com',
      unified: 'https://unified.percytext.com'
    },
    staging: {
      web: 'https://staging.percytext.com',
      unified: 'https://unified-staging.percytext.com'
    },
    development: {
      web: 'https://dev.percytext.com',
      unified: 'https://unified-dev.percytext.com'
    }
  }
};

/**
 * Get the appropriate domain for a hub based on environment
 */
export function getHubDomain(
  hubName: string,
  environment: 'production' | 'staging' | 'development' = 'production',
  appType: 'web' | 'unified' = 'web'
): string {
  const hubConfig = HUB_DOMAINS[hubName.toLowerCase()];
  if (!hubConfig) {
    // Fallback to gnymble if hub not found
    return HUB_DOMAINS.gnymble[environment][appType];
  }
  return hubConfig[environment][appType];
}

/**
 * Detect hub from hostname
 */
export function detectHubFromHostname(hostname: string): string {
  // Remove protocol and www
  const cleanHost = hostname.replace(/^https?:\/\//, '').replace(/^www\./, '');

  // Check each hub's domains
  for (const [hubName, config] of Object.entries(HUB_DOMAINS)) {
    const domains = [
      ...Object.values(config.production),
      ...Object.values(config.staging),
      ...Object.values(config.development)
    ];

    if (domains.some(domain => domain.includes(cleanHost))) {
      return hubName;
    }
  }

  // Default to gnymble
  return 'gnymble';
}

/**
 * Get redirect URL after authentication based on hub
 */
export function getAuthRedirectUrl(
  hubName: string,
  environment: 'production' | 'staging' | 'development' = 'production'
): string {
  return getHubDomain(hubName, environment, 'unified');
}