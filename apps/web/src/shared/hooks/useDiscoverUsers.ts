/**
 * Hook for fetching users in Discover page
 * Supports filtering by tags, sorting, and cursor-based pagination
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import type { DiscoverUsersResponse, DiscoverUsersParams } from '../types/user';

const DISCOVER_USERS_QUERY_KEY = 'discover-users';

async function discoverUsers(params: DiscoverUsersParams): Promise<DiscoverUsersResponse> {
  // Build query params (exclude cursor for initial page)
  const { cursor, ...queryParams } = params;
  const searchParams = new URLSearchParams();
  if (queryParams.tags) searchParams.append('tags', queryParams.tags);
  if (queryParams.query) searchParams.append('query', queryParams.query);
  if (queryParams.sort) searchParams.append('sort', queryParams.sort);
  if (cursor) searchParams.append('cursor', cursor);
  if (queryParams.limit) searchParams.append('limit', String(queryParams.limit));

  const response = await api.get<DiscoverUsersResponse>(`/users/discover?${searchParams.toString()}`);
  return response;
}

export function useDiscoverUsers(params: DiscoverUsersParams = {}) {
  return useInfiniteQuery({
    queryKey: [DISCOVER_USERS_QUERY_KEY, params],
    queryFn: ({ pageParam }) => {
      const queryParams = { ...params };
      if (pageParam) {
        queryParams.cursor = pageParam;
      }
      return discoverUsers(queryParams);
    },
    getNextPageParam: lastPage => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
    enabled: true,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
}

export function useDiscoverUsersQueryKey() {
  return [DISCOVER_USERS_QUERY_KEY];
}
