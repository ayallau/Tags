// Enums and constants
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator',
} as const;

export const TAG_CATEGORIES = {
  GENERAL: 'general',
  WORK: 'work',
  PERSONAL: 'personal',
  PROJECT: 'project',
  LEARNING: 'learning',
  TRAVEL: 'travel',
  FOOD: 'food',
  HEALTH: 'health',
  FINANCE: 'finance',
  ENTERTAINMENT: 'entertainment',
} as const;

export const TAG_COLORS = {
  RED: '#ef4444',
  ORANGE: '#f97316',
  YELLOW: '#eab308',
  GREEN: '#22c55e',
  BLUE: '#3b82f6',
  PURPLE: '#a855f7',
  PINK: '#ec4899',
  GRAY: '#6b7280',
  INDIGO: '#6366f1',
  TEAL: '#14b8a6',
} as const;

export const AUTH_PROVIDERS = {
  LOCAL: 'local',
  GOOGLE: 'google',
  GITHUB: 'github',
  FACEBOOK: 'facebook',
} as const;

export const API_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

// Types
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type TagCategory = typeof TAG_CATEGORIES[keyof typeof TAG_CATEGORIES];
export type TagColor = typeof TAG_COLORS[keyof typeof TAG_COLORS];
export type AuthProvider = typeof AUTH_PROVIDERS[keyof typeof AUTH_PROVIDERS];
export type ApiStatusCode = typeof API_STATUS_CODES[keyof typeof API_STATUS_CODES];
export type HttpMethod = typeof HTTP_METHODS[keyof typeof HTTP_METHODS];
