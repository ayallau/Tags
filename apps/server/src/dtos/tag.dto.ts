import { z } from "zod";

// Tag creation schema
export const CreateTagSchema = z.object({
  label: z
    .string()
    .min(2, "Label must be at least 2 characters")
    .max(32, "Label must be at most 32 characters"),
});

// Tag update schema
export const UpdateTagSchema = z.object({
  label: z
    .string()
    .min(2, "Label must be at least 2 characters")
    .max(32, "Label must be at most 32 characters"),
});

// Tag query schema
export const TagQuerySchema = z.object({
  query: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  cursor: z.string().optional(),
});

// Tag search schema (autocomplete)
export const TagSearchSchema = z.object({
  query: z.string().min(1, "Query must be at least 1 character"),
});

// Types
export type CreateTagDto = z.infer<typeof CreateTagSchema>;
export type UpdateTagDto = z.infer<typeof UpdateTagSchema>;
export type TagQueryDto = z.infer<typeof TagQuerySchema>;
export type TagSearchDto = z.infer<typeof TagSearchSchema>;

// Response types
export interface TagResponse {
  _id: string;
  slug: string;
  label: string;
  createdAt: string;
  updatedAt: string;
}

export interface TagListResponse {
  tags: TagResponse[];
  nextCursor?: string;
  hasMore: boolean;
}
