/**
 * Hook for fetching user matches
 * Supports sorting and cursor-based pagination
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

export interface MatchTargetUser {
  _id: string;
  username?: string;
  avatarUrl?: string;
  isOnline: boolean;
  lastVisitAt?: string;
  tags: Array<{
    _id: string;
    slug: string;
    label: string;
  }>;
}

export interface Match {
  targetUser: MatchTargetUser;
  score: number;
  sharedTagsCount: number;
  computedAt: string;
}

export interface GetMatchesResponse {
  matches: Match[];
  nextCursor?: string;
  hasMore: boolean;
  totalCount?: number;
}

export interface GetMatchesParams {
  sort?: 'score' | 'sharedCount' | 'name' | 'online' | 'lastVisit';
  cursor?: string;
  limit?: number;
}

const MATCHES_QUERY_KEY = 'matches';

async function getMatches(params: GetMatchesParams): Promise<GetMatchesResponse> {
  // Build query params (exclude cursor for initial page)
  const { cursor, ...queryParams } = params;
  const searchParams = new URLSearchParams();
  if (queryParams.sort) searchParams.append('sort', queryParams.sort);
  if (cursor) searchParams.append('cursor', cursor);
  if (queryParams.limit) searchParams.append('limit', String(queryParams.limit));

  const queryString = searchParams.toString();
  const response = await api.get<GetMatchesResponse>(`/users/matches?${queryString}`);
  return response;
}

export function useMatchesQuery(params: GetMatchesParams = {}) {
  return useInfiniteQuery({
    queryKey: [MATCHES_QUERY_KEY, params],
    queryFn: ({ pageParam }) => {
      const queryParams = { ...params };
      if (pageParam) {
        queryParams.cursor = pageParam;
      }
      return getMatches(queryParams);
    },
    getNextPageParam: lastPage => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
    enabled: true,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
}

export function useMatchesQueryKey() {
  return [MATCHES_QUERY_KEY];
}
