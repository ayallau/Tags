/**
 * Web Application Configuration
 *
 * This file defines the configuration for the web application using
 * Vite environment variables (VITE_*) with typed fallback defaults.
 *
 * All values read from import.meta.env are safe to expose in the client bundle.
 */

// Default configuration values
const DEFAULT_CONFIG = {
  // Protocol Configuration
  https: false,

  // API Configuration
  apiBaseUrl: 'http://localhost:3001',
  apiTimeout: 10000,

  // Application
  appName: 'Tags',
  appVersion: '1.0.0',
  appDescription: 'A modern tagging system',

  // Features
  enableAnalytics: false,
  enableNotifications: true,
  enableSocialLogin: true,
  enableFileUpload: true,

  // OAuth (Google)
  googleClientId: '',

  // Development
  debugMode: false,
  logLevel: 'info' as const,
} as const;

/**
 * Helper function to safely read environment variables
 * with fallback to default values
 */
function getEnvString(key: string, fallback: string): string {
  const value = import.meta.env[key];
  return value || fallback;
}

function getEnvBoolean(key: string, fallback: boolean): boolean {
  const value = import.meta.env[key];
  if (value === undefined) return fallback;
  return value === 'true' || value === true;
}

function getEnvNumber(key: string, fallback: number): number {
  const value = import.meta.env[key];
  if (value === undefined) return fallback;
  const num = Number(value);
  return Number.isNaN(num) ? fallback : num;
}

/**
 * Web application configuration interface
 */
export interface WebConfig {
  // Protocol
  https: boolean;

  // API
  apiBaseUrl: string;
  apiTimeout: number;

  // Application
  appName: string;
  appVersion: string;
  appDescription: string;

  // Features
  enableAnalytics: boolean;
  enableNotifications: boolean;
  enableSocialLogin: boolean;
  enableFileUpload: boolean;

  // OAuth
  googleClientId: string;

  // Development
  debugMode: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

/**
 * Get the full URL for the API
 * Constructs the URL based on the configured protocol and base URL
 */
export function getApiUrl(): string {
  const protocol = config.https ? 'https' : 'http';
  // Remove protocol from baseUrl if present
  const baseUrl = config.apiBaseUrl.replace(/^https?:\/\//, '');
  return `${protocol}://${baseUrl}`;
}

/**
 * Get the full URL for a specific API endpoint
 */
export function getApiEndpoint(path: string): string {
  const apiUrl = getApiUrl();
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${apiUrl}${normalizedPath}`;
}

/**
 * Check if running in development mode
 */
export function isDevelopment(): boolean {
  return import.meta.env.DEV;
}

/**
 * Check if running in production mode
 */
export function isProduction(): boolean {
  return import.meta.env.PROD;
}

/**
 * Get the current environment mode
 */
export function getEnvironment(): string {
  return import.meta.env.MODE;
}

/**
 * Loaded web configuration
 * Uses Vite environment variables (VITE_*) with fallback to defaults
 */
export const config: WebConfig = {
  // Protocol
  https: getEnvBoolean('VITE_HTTPS', DEFAULT_CONFIG.https),

  // API Configuration
  apiBaseUrl: getEnvString('VITE_API_BASE_URL', DEFAULT_CONFIG.apiBaseUrl),
  apiTimeout: getEnvNumber('VITE_API_TIMEOUT', DEFAULT_CONFIG.apiTimeout),

  // Application
  appName: getEnvString('VITE_APP_NAME', DEFAULT_CONFIG.appName),
  appVersion: getEnvString('VITE_APP_VERSION', DEFAULT_CONFIG.appVersion),
  appDescription: getEnvString('VITE_APP_DESCRIPTION', DEFAULT_CONFIG.appDescription),

  // Features
  enableAnalytics: getEnvBoolean('VITE_ENABLE_ANALYTICS', DEFAULT_CONFIG.enableAnalytics),
  enableNotifications: getEnvBoolean('VITE_ENABLE_NOTIFICATIONS', DEFAULT_CONFIG.enableNotifications),
  enableSocialLogin: getEnvBoolean('VITE_ENABLE_SOCIAL_LOGIN', DEFAULT_CONFIG.enableSocialLogin),
  enableFileUpload: getEnvBoolean('VITE_ENABLE_FILE_UPLOAD', DEFAULT_CONFIG.enableFileUpload),

  // OAuth (Google)
  googleClientId: getEnvString('VITE_GOOGLE_CLIENT_ID', DEFAULT_CONFIG.googleClientId),

  // Development
  debugMode: getEnvBoolean('VITE_DEBUG_MODE', DEFAULT_CONFIG.debugMode),
  logLevel: getEnvString('VITE_LOG_LEVEL', DEFAULT_CONFIG.logLevel) as 'debug' | 'info' | 'warn' | 'error',
} as const;

/**
 * Validate critical configuration values
 * Throws error if required values are missing or invalid
 */
export function validateConfig(): void {
  if (!config.apiBaseUrl) {
    throw new Error('VITE_API_BASE_URL is required but not set');
  }

  if (config.enableSocialLogin && !config.googleClientId) {
    console.warn('VITE_ENABLE_SOCIAL_LOGIN is true but VITE_GOOGLE_CLIENT_ID is not set');
  }

  if (config.debugMode && isProduction()) {
    console.warn('Debug mode is enabled in production environment');
  }
}

// Auto-validate on import
if (typeof window !== 'undefined') {
  validateConfig();
}
