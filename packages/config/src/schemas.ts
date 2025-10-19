import { z } from 'zod';

// Environment schema
export const EnvironmentSchema = z.enum(['development', 'staging', 'production']);

// Feature flags schema
export const FeatureFlagsSchema = z.object({
  enableNewUI: z.boolean(),
  enableBetaFeatures: z.boolean(),
  enableAnalytics: z.boolean(),
  enableNotifications: z.boolean(),
  enableSocialLogin: z.boolean(),
  enableFileUpload: z.boolean(),
  enableAdvancedSearch: z.boolean(),
});

// API configuration schema
export const ApiConfigSchema = z.object({
  baseURL: z.string().url(),
  timeout: z.number().min(1000).max(60000),
  retries: z.number().min(0).max(5),
});

// Database configuration schema
export const DatabaseConfigSchema = z.object({
  host: z.string(),
  port: z.number().min(1).max(65535),
  database: z.string(),
  username: z.string(),
  password: z.string(),
  ssl: z.boolean().default(false),
});

// Email configuration schema
export const EmailConfigSchema = z.object({
  host: z.string(),
  port: z.number().min(1).max(65535),
  secure: z.boolean().default(false),
  auth: z.object({
    user: z.string(),
    pass: z.string(),
  }),
});

// Application configuration schema
export const AppConfigSchema = z.object({
  name: z.string(),
  version: z.string(),
  description: z.string(),
  author: z.string(),
  environment: EnvironmentSchema,
  featureFlags: FeatureFlagsSchema,
  api: ApiConfigSchema,
  database: DatabaseConfigSchema.optional(),
  email: EmailConfigSchema.optional(),
});

// Types
export type Environment = z.infer<typeof EnvironmentSchema>;
export type FeatureFlags = z.infer<typeof FeatureFlagsSchema>;
export type ApiConfig = z.infer<typeof ApiConfigSchema>;
export type DatabaseConfig = z.infer<typeof DatabaseConfigSchema>;
export type EmailConfig = z.infer<typeof EmailConfigSchema>;
export type AppConfig = z.infer<typeof AppConfigSchema>;
