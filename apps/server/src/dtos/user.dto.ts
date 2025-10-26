// src/dtos/user.dto.ts
import type { IUser } from "../models/User.js";
import { z } from "zod";

// ========================================
// Response DTO
// ========================================

export interface UserDto {
  id: string;
  email: string;
  roles: string[];
  createdAt: Date;
  // Not exposed: passwordHash, tokenVersion, passwordVersion
}

// ========================================
// Mapper Function
// ========================================

/**
 * Convert from IUser (Mongoose Model) to UserDto (API Response)
 */
export function toUserDto(user: IUser): UserDto {
  return {
    id: String(user._id),
    email: user.emailLower || "",
    roles: user.roles,
    createdAt: user.createdAt,
  };
}

// ========================================
// Zod Schemas
// ========================================

/**
 * Schema for updating user profile (bio, location, avatarUrl)
 * Tags are managed separately via TagManagement
 */
export const UpdateProfileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, underscores, and hyphens"
    )
    .optional(),
  bio: z
    .string()
    .max(500, "Bio must be at most 500 characters")
    .optional()
    .or(z.literal("")),
  location: z
    .string()
    .max(100, "Location must be at most 100 characters")
    .optional()
    .or(z.literal("")),
  avatarUrl: z.string().url("Invalid URL format").or(z.literal("")).optional(),
});

/**
 * Schema for updating user tags (managed separately)
 */
export const UpdateTagsSchema = z.object({
  tags: z.array(z.string()).max(20, "Cannot have more than 20 tags"),
});

/**
 * Schema for updating user photos (for future Photo Gallery feature)
 */
export const UpdatePhotosSchema = z.object({
  photos: z.array(z.string().url()).max(10, "Cannot have more than 10 photos"),
});

// ========================================
// Request DTOs
// ========================================

export interface CreateUserDto {
  username: string;
  email: string;
  passwordHash: string;
}

export type UpdateUserDto = z.infer<typeof UpdateProfileSchema>;
export type UpdateTagsDto = z.infer<typeof UpdateTagsSchema>;
export type UpdatePhotosDto = z.infer<typeof UpdatePhotosSchema>;

export interface GoogleUserDto {
  googleId: string;
  email: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
}

// Discover users query DTO
export interface DiscoverUsersQuery {
  tags?: string; // comma-separated tag IDs
  query?: string; // search query for username
  sort?: "relevance" | "online" | "lastVisit" | "name";
  cursor?: string;
  limit?: number;
}

// Recent users query DTO - exported for use in controllers
export const RecentUsersSchema = z.object({
  limit: z.coerce.number().min(1).max(100).optional().default(24),
  cursor: z.string().optional(),
});

export type RecentUsersDto = z.infer<typeof RecentUsersSchema>;
