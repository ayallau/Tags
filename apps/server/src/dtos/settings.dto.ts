import { z } from "zod";

// Query parameters for listing blocked/hidden users
export const SettingsListQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 24))
    .pipe(z.number().int().positive().max(100)),
});

export type SettingsListQuery = z.infer<typeof SettingsListQuerySchema>;

// Path parameter for target userId
export const TargetUserIdSchema = z.object({
  targetUserId: z.string().min(1, "Invalid target user ID"),
});

export type TargetUserIdDto = z.infer<typeof TargetUserIdSchema>;

// Minimal user projection for settings lists
export interface SettingsUserItem {
  _id: string;
  username: string;
  avatarUrl?: string;
  isOnline: boolean;
  lastVisitAt?: string;
  createdAt: string;
}

// Response structure
export interface SettingsListResponse {
  users: SettingsUserItem[];
  nextCursor?: string;
  hasMore: boolean;
}
