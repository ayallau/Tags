// Environment types
export type Environment = 'development' | 'staging' | 'production';

// Feature flags type
export interface FeatureFlags {
  enableNewUI: boolean;
  enableBetaFeatures: boolean;
  enableAnalytics: boolean;
  enableNotifications: boolean;
  enableSocialLogin: boolean;
  enableFileUpload: boolean;
  enableAdvancedSearch: boolean;
}

// Default feature flags by environment
export const DEFAULT_FEATURE_FLAGS: Record<Environment, FeatureFlags> = {
  development: {
    enableNewUI: true,
    enableBetaFeatures: true,
    enableAnalytics: false,
    enableNotifications: true,
    enableSocialLogin: true,
    enableFileUpload: true,
    enableAdvancedSearch: true,
  },
  staging: {
    enableNewUI: true,
    enableBetaFeatures: true,
    enableAnalytics: true,
    enableNotifications: true,
    enableSocialLogin: true,
    enableFileUpload: true,
    enableAdvancedSearch: false,
  },
  production: {
    enableNewUI: false,
    enableBetaFeatures: false,
    enableAnalytics: true,
    enableNotifications: true,
    enableSocialLogin: true,
    enableFileUpload: true,
    enableAdvancedSearch: false,
  },
};

// Get current environment
export function getCurrentEnvironment(): Environment {
  const env = process.env['NODE_ENV'] as Environment;
  return env || 'development';
}

// Get feature flags for current environment
export function getFeatureFlags(): FeatureFlags {
  const env = getCurrentEnvironment();
  return DEFAULT_FEATURE_FLAGS[env];
}

// Check if feature is enabled
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  const flags = getFeatureFlags();
  return flags[feature];
}
