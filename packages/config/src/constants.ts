// Application constants
export const APP_CONFIG = {
  name: 'Tags',
  version: '1.0.0',
  description: 'A modern tagging system',
  author: 'Tags Team',
} as const;

// API Configuration
export const API_CONFIG = {
  endpoints: {
    auth: '/auth',
    users: '/users',
    tags: '/tags',
    health: '/health',
  },
  timeouts: {
    default: 10000,
    upload: 30000,
    download: 60000,
  },
  retries: {
    maxAttempts: 3,
    delay: 1000,
  },
} as const;

// Pagination defaults
export const PAGINATION_CONFIG = {
  defaultLimit: 20,
  maxLimit: 100,
  defaultOffset: 0,
} as const;

// Validation limits
export const VALIDATION_CONFIG = {
  user: {
    username: {
      minLength: 3,
      maxLength: 30,
    },
    password: {
      minLength: 8,
      maxLength: 128,
    },
    firstName: {
      minLength: 1,
      maxLength: 50,
    },
    lastName: {
      minLength: 1,
      maxLength: 50,
    },
  },
  tag: {
    name: {
      minLength: 1,
      maxLength: 50,
    },
    description: {
      maxLength: 200,
    },
  },
} as const;

// File upload limits
export const UPLOAD_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  allowedDocumentTypes: ['application/pdf', 'text/plain'],
} as const;

// Cache configuration
export const CACHE_CONFIG = {
  ttl: {
    short: 5 * 60 * 1000, // 5 minutes
    medium: 30 * 60 * 1000, // 30 minutes
    long: 24 * 60 * 60 * 1000, // 24 hours
  },
  keys: {
    user: 'user',
    tags: 'tags',
    auth: 'auth',
  },
} as const;
