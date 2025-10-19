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
  // לא חושפים: passwordHash, tokenVersion, passwordVersion
}

// ========================================
// Mapper Function
// ========================================

/**
 * המרה מ-IUser (Mongoose Model) ל-UserDto (API Response)
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
  email?: string;
  // שדות נוספים שניתן לעדכן
}

export interface GoogleUserDto {
  googleId: string;
  email: string | null;
}

