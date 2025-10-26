/**
 * React Query hooks for settings (blocked & hidden users)
 */

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

export interface SettingsUser {
  _id: string;
  username: string;
  avatarUrl?: string;
  isOnline: boolean;
  lastVisitAt?: string;
  createdAt: string;
}

export interface SettingsListResponse {
  users: SettingsUser[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface SettingsQueryParams {
  cursor?: string;
  limit?: number;
}

const BLOCKED_QUERY_KEY = 'blocked';
const HIDDEN_QUERY_KEY = 'hidden';

async function getBlocked(params: SettingsQueryParams): Promise<SettingsListResponse> {
  const { cursor, limit } = params;
  const searchParams = new URLSearchParams();
  if (cursor) searchParams.append('cursor', cursor);
  if (limit) searchParams.append('limit', String(limit));

  const queryString = searchParams.toString();
  const response = await api.get<SettingsListResponse>(`/api/settings/blocked${queryString ? `?${queryString}` : ''}`);
  return response;
}

async function getHidden(params: SettingsQueryParams): Promise<SettingsListResponse> {
  const { cursor, limit } = params;
  const searchParams = new URLSearchParams();
  if (cursor) searchParams.append('cursor', cursor);
  if (limit) searchParams.append('limit', String(limit));

  const queryString = searchParams.toString();
  const response = await api.get<SettingsListResponse>(`/api/settings/hidden${queryString ? `?${queryString}` : ''}`);
  return response;
}

/**
 * Hook to fetch blocked users with infinite scroll
 */
export function useBlockedList(params: SettingsQueryParams = {}) {
  return useInfiniteQuery({
    queryKey: [BLOCKED_QUERY_KEY, params],
    queryFn: ({ pageParam }) => {
      const queryParams = { ...params };
      if (pageParam) {
        queryParams.cursor = pageParam;
      }
      return getBlocked(queryParams);
    },
    getNextPageParam: lastPage => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
    enabled: true,
    staleTime: 30000,
  });
}

/**
 * Hook to fetch hidden users with infinite scroll
 */
export function useHiddenList(params: SettingsQueryParams = {}) {
  return useInfiniteQuery({
    queryKey: [HIDDEN_QUERY_KEY, params],
    queryFn: ({ pageParam }) => {
      const queryParams = { ...params };
      if (pageParam) {
        queryParams.cursor = pageParam;
      }
      return getHidden(queryParams);
    },
    getNextPageParam: lastPage => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
    enabled: true,
    staleTime: 30000,
  });
}

/**
 * Hook to block a user
 */
export function useBlockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (targetUserId: string) => {
      const response = await api.post<{ message: string }>(`/api/settings/blocked/${targetUserId}`);
      return response;
    },
    onSuccess: () => {
      // Invalidate all affected queries
      queryClient.invalidateQueries({ queryKey: [BLOCKED_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['discover'] });
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });
}

/**
 * Hook to unblock a user
 */
export function useUnblockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (targetUserId: string) => {
      const response = await api.delete<{ message: string }>(`/api/settings/blocked/${targetUserId}`);
      return response;
    },
    onSuccess: () => {
      // Invalidate all affected queries
      queryClient.invalidateQueries({ queryKey: [BLOCKED_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['discover'] });
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });
}

/**
 * Hook to hide a user
 */
export function useHideUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (targetUserId: string) => {
      const response = await api.post<{ message: string }>(`/api/settings/hidden/${targetUserId}`);
      return response;
    },
    onSuccess: () => {
      // Invalidate all affected queries
      queryClient.invalidateQueries({ queryKey: [HIDDEN_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['discover'] });
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });
}

/**
 * Hook to unhide a user
 */
export function useUnhideUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (targetUserId: string) => {
      const response = await api.delete<{ message: string }>(`/api/settings/hidden/${targetUserId}`);
      return response;
    },
    onSuccess: () => {
      // Invalidate all affected queries
      queryClient.invalidateQueries({ queryKey: [HIDDEN_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['discover'] });
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });
}
