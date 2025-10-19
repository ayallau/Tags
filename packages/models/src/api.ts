import { z } from 'zod';

// API Response wrapper
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.any().optional(),
  error: z.string().optional(),
  timestamp: z.date().default(() => new Date()),
});

// Paginated response schema
export const PaginatedResponseSchema = z.object({
  data: z.array(z.any()),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
  }),
});

// Error response schema
export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  error: z.string().optional(),
  code: z.string().optional(),
  timestamp: z.date().default(() => new Date()),
});

// Types
export type ApiResponse<T = any> = z.infer<typeof ApiResponseSchema> & {
  data?: T;
};

export type PaginatedResponse<T = any> = z.infer<typeof PaginatedResponseSchema> & {
  data: T[];
};

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
