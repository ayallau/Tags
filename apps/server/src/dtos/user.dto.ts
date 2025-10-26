// src/dtos/user.dto.ts
import type { IUser } from "../models/User.js";

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
// Request DTOs
// ========================================

export interface CreateUserDto {
  email: string;
  passwordHash: string;
}

export interface UpdateUserDto {
  username?: string;
  bio?: string;
  location?: string;
  photos?: string[];
  tags?: string[];
}

export interface GoogleUserDto {
  googleId: string;
  email: string | null;
}
