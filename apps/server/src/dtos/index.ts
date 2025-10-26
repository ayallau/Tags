// src/dtos/index.ts
export type {
  UserDto,
  CreateUserDto,
  UpdateUserDto,
  GoogleUserDto,
  DiscoverUsersQuery,
  RecentUsersDto,
} from "./user.dto.js";

export type {
  GetMatchesQuery,
  MatchDto,
  GetMatchesResponse,
} from "./match.dto.js";

export type {
  LoginDto,
  RegisterDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  AuthResponseDto,
  MessageResponseDto,
  ErrorResponseDto,
} from "./auth.dto.js";

export type {
  BookmarkResponse,
  BookmarkListResponse,
  CreateBookmarkDto,
  UpdateBookmarkDto,
  BookmarkQueryDto,
} from "./bookmark.dto.js";

export type {
  SettingsListQuery,
  TargetUserIdDto,
  SettingsUserItem,
  SettingsListResponse,
} from "./settings.dto.js";
