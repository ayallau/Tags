import type { IBookmark } from "../models/Bookmark.js";
import { z } from "zod";

// ========================================
// Response DTOs
// ========================================

export interface BookmarkResponse {
  _id: string;
  userId: string;
  targetUserId: string;
  targetUser: {
    _id: string;
    username: string;
    avatarUrl?: string;
    isOnline: boolean;
    lastVisitAt?: string;
    tags?: Array<{ _id: string; slug: string; label: string }>;
    matchScore?: number;
  };
  remark?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookmarkListResponse {
  bookmarks: BookmarkResponse[];
  nextCursor?: string;
  hasMore: boolean;
}

// ========================================
// Mapper Function
// ========================================

export function toBookmarkDto(
  bookmark: IBookmark
): Omit<BookmarkResponse, "targetUser"> {
  return {
    _id: String(bookmark._id),
    userId: String(bookmark.userId),
    targetUserId: String(bookmark.targetUserId),
    remark: bookmark.remark,
    createdAt: bookmark.createdAt.toISOString(),
    updatedAt: bookmark.updatedAt.toISOString(),
  };
}

// ========================================
// Zod Schemas & Request DTOs
// ========================================

/**
 * Schema for creating a bookmark (idempotent - creates or updates)
 */
export const CreateBookmarkSchema = z.object({
  targetUserId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),
  remark: z
    .string()
    .max(500, "Remark must be at most 500 characters")
    .optional()
    .or(z.literal("")),
});

export type CreateBookmarkDto = z.infer<typeof CreateBookmarkSchema>;

/**
 * Schema for updating a bookmark (remark only)
 */
export const UpdateBookmarkSchema = z.object({
  remark: z
    .string()
    .max(500, "Remark must be at most 500 characters")
    .optional()
    .or(z.literal("")),
});

export type UpdateBookmarkDto = z.infer<typeof UpdateBookmarkSchema>;

/**
 * Schema for bookmark query parameters (list/search)
 */
export interface BookmarkQueryDto {
  query?: string; // search in remarks or usernames
  cursor?: string;
  limit?: number;
}
