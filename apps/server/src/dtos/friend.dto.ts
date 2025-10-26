import type { IFriend } from "../models/Friend.js";
import { z } from "zod";

// ========================================
// Response DTOs
// ========================================

export interface FriendResponse {
  _id: string;
  userId: string;
  friendUserId: string;
  friendUser: {
    _id: string;
    username: string;
    avatarUrl?: string;
    isOnline: boolean;
    lastVisitAt?: string;
    tags?: Array<{ _id: string; slug: string; label: string }>;
    matchScore?: number;
  };
  canNotify: boolean;
  createdAt: string;
}

export interface FriendListResponse {
  friends: FriendResponse[];
  nextCursor?: string;
  hasMore: boolean;
}

// ========================================
// Mapper Function
// ========================================

export function toFriendDto(
  friend: IFriend
): Omit<FriendResponse, "friendUser"> {
  return {
    _id: String(friend._id),
    userId: String(friend.userId),
    friendUserId: String(friend.friendUserId),
    canNotify: friend.canNotify,
    createdAt: friend.createdAt.toISOString(),
  };
}

// ========================================
// Zod Schemas & Request DTOs
// ========================================

/**
 * Schema for creating a friend (idempotent - creates or updates)
 */
export const CreateFriendSchema = z.object({
  targetUserId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),
});

export type CreateFriendDto = z.infer<typeof CreateFriendSchema>;

/**
 * Schema for updating friend visibility (canNotify)
 */
export const UpdateFriendSchema = z.object({
  canNotify: z.boolean(),
});

export type UpdateFriendDto = z.infer<typeof UpdateFriendSchema>;

/**
 * Schema for friend query parameters (list)
 */
export interface FriendQueryDto {
  cursor?: string;
  limit?: number;
}
