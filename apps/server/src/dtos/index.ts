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
  DiscoverUsersQuery,
} from "./user.dto.js";

export { toUserDto } from "./user.dto.js";

// ========================================
// Tag DTOs
// ========================================
export type {
  CreateTagDto,
  UpdateTagDto,
  TagQueryDto,
  TagSearchDto,
  TagResponse,
  TagListResponse,
} from "./tag.dto.js";

export {
  CreateTagSchema,
  UpdateTagSchema,
  TagQuerySchema,
  TagSearchSchema,
} from "./tag.dto.js";
