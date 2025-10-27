/**
 * User types for client application
 */

export interface UserPreview {
  _id: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  dateOfBirth?: string;
  gender?: string;
  profession?: string;
  title?: string;
  isOnline: boolean;
  lastVisitAt?: string;
  createdAt: string;
  tags: Array<{
    _id: string;
    slug: string;
    label: string;
  }>;
}

export interface DiscoverUsersResponse {
  users: UserPreview[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface DiscoverUsersParams {
  tags?: string | undefined; // comma-separated tag IDs
  query?: string | undefined;
  sort?: 'relevance' | 'online' | 'lastVisit' | 'name' | undefined;
  cursor?: string | undefined;
  limit?: number | undefined;
}
