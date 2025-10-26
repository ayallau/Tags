// src/dtos/auth.dto.ts

// ========================================
// Request DTOs (what comes from client)
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
// Response DTOs (what goes to client)
// ========================================

export interface AuthResponseDto {
  accessToken: string;
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
