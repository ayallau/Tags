/**
 * Hook for fetching recent users with infinite scroll
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

export interface RecentUser {
  _id: string;
  username?: string;
  avatarUrl?: string;
  isOnline: boolean;
  lastVisitAt?: string;
  createdAt: string;
}

export interface RecentUsersResponse {
  users: RecentUser[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface RecentUsersParams {
  limit?: number;
  cursor?: string;
}

async function fetchRecentUsers(params: RecentUsersParams): Promise<RecentUsersResponse> {
  const { cursor, ...queryParams } = params;
  const searchParams = new URLSearchParams();
  if (queryParams.limit) searchParams.append('limit', String(queryParams.limit));
  if (cursor) searchParams.append('cursor', cursor);

  const response = await api.get<RecentUsersResponse>(`/users/recent?${searchParams.toString()}`);
  return response;
}

export function useRecentUsers(params: RecentUsersParams = { limit: 24 }) {
  return useInfiniteQuery({
    queryKey: ['recent-users', params],
    queryFn: ({ pageParam }) => {
      const queryParams: RecentUsersParams = { ...params };
      if (pageParam) {
        queryParams.cursor = pageParam;
      }
      return fetchRecentUsers(queryParams);
    },
    getNextPageParam: lastPage => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
}
