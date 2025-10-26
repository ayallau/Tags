// src/dtos/match.dto.ts

/**
 * Query parameters for fetching user matches
 */
export interface GetMatchesQuery {
  cursor?: string; // Cursor for pagination
  limit?: number; // Number of results (default: 24)
  sort?: "score" | "sharedCount" | "name"; // Sort order (default: score)
}

/**
 * Response DTO for a single match
 */
export interface MatchDto {
  targetUser: {
    _id: string;
    username?: string;
    avatarUrl?: string;
    isOnline: boolean;
    lastVisitAt?: Date;
    tags: Array<{
      _id: string;
      slug: string;
      label: string;
    }>;
  };
  score: number;
  sharedTagsCount: number;
  computedAt: Date;
}

/**
 * Response for GET /users/matches
 */
export interface GetMatchesResponse {
  matches: MatchDto[];
  nextCursor?: string;
  hasMore: boolean;
  totalCount?: number;
}
