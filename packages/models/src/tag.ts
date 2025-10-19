import { z } from 'zod';

// Base Tag schema
export const TagSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, 'Tag name is required').max(50, 'Tag name too long'),
  description: z.string().max(200, 'Description too long').optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format').optional(),
  category: z.string().optional(),
  isPublic: z.boolean().default(true),
  createdBy: z.string(), // User ID
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Tag creation schema
export const CreateTagSchema = TagSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

// Tag update schema
export const UpdateTagSchema = TagSchema.partial().required({
  _id: true,
});

// Tag search/filter schema
export const TagFilterSchema = z.object({
  name: z.string().optional(),
  category: z.string().optional(),
  isPublic: z.boolean().optional(),
  createdBy: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

// Types
export type Tag = z.infer<typeof TagSchema>;
export type CreateTag = z.infer<typeof CreateTagSchema>;
export type UpdateTag = z.infer<typeof UpdateTagSchema>;
export type TagFilter = z.infer<typeof TagFilterSchema>;
