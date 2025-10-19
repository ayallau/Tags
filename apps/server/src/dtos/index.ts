// src/dtos/index.ts

// ========================================
// Auth DTOs
// ========================================
export type {
  LoginDto,
  RegisterDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  AuthResponseDto,
  MessageResponseDto,
  ErrorResponseDto,
} from "./auth.dto.js";

// ========================================
// User DTOs
// ========================================
export type {
  UserDto,
  CreateUserDto,
  UpdateUserDto,
  GoogleUserDto,
} from "./user.dto.js";

export { toUserDto } from "./user.dto.js";

