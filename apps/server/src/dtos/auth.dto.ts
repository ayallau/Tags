// src/dtos/auth.dto.ts

// ========================================
// Request DTOs (מה שנכנס מה-client)
// ========================================

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

// ========================================
// Response DTOs (מה שיוצא ל-client)
// ========================================

export interface AuthResponseDto {
  accessToken: string;
  refreshToken?: string;
}

export interface MessageResponseDto {
  message: string;
  token?: string; // for dev mode
  redirectTo?: string;
  action?: string;
}

export interface ErrorResponseDto {
  error: string;
}

