/**
 * React Query hooks for friend management
 */

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

export interface FriendTargetUser {
  _id: string;
  username: string;
  avatarUrl?: string;
  isOnline: boolean;
  lastVisitAt?: string;
  tags?: Array<{
    _id: string;
    slug: string;
    label: string;
  }>;
  matchScore?: number;
}

export interface Friend {
  _id: string;
  userId: string;
  friendUserId: string;
  friendUser: FriendTargetUser;
  canNotify: boolean;
  createdAt: string;
}

export interface FriendListResponse {
  friends: Friend[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface CreateFriendDto {
  targetUserId: string;
}

export interface UpdateFriendDto {
  canNotify: boolean;
}

export interface FriendQueryParams {
  cursor?: string;
  limit?: number;
}

const FRIENDS_QUERY_KEY = 'friends';

async function getFriends(params: FriendQueryParams): Promise<FriendListResponse> {
  const { cursor, ...queryParams } = params;
  const searchParams = new URLSearchParams();
  if (cursor) searchParams.append('cursor', cursor);
  if (queryParams.limit) searchParams.append('limit', String(queryParams.limit));

  const queryString = searchParams.toString();
  const response = await api.get<FriendListResponse>(`/friends?${queryString}`);
  return response;
}

export function useFriendsQuery(params: FriendQueryParams = {}) {
  return useInfiniteQuery({
    queryKey: [FRIENDS_QUERY_KEY, params],
    queryFn: ({ pageParam }) => {
      const queryParams = { ...params };
      if (pageParam) {
        queryParams.cursor = pageParam;
      }
      return getFriends(queryParams);
    },
    getNextPageParam: lastPage => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
    enabled: true,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
}

export function useAddFriend() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (targetUserId: string) => {
      return api.post<Friend>(`/friends/${targetUserId}`, {});
    },
    onSuccess: () => {
      // Invalidate friends list to refetch
      queryClient.invalidateQueries({ queryKey: [FRIENDS_QUERY_KEY] });
    },
  });
}

export function useUpdateFriendVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateFriendDto }) => {
      return api.patch<Friend>(`/friends/${id}`, data);
    },
    onSuccess: () => {
      // Invalidate friends list to refetch
      queryClient.invalidateQueries({ queryKey: [FRIENDS_QUERY_KEY] });
    },
  });
}

export function useRemoveFriend() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (targetUserId: string) => {
      return api.delete<void>(`/friends/user/${targetUserId}`);
    },
    onSuccess: () => {
      // Invalidate friends list to refetch
      queryClient.invalidateQueries({ queryKey: [FRIENDS_QUERY_KEY] });
    },
  });
}

export function useCheckFriend(targetUserId?: string) {
  return useInfiniteQuery({
    queryKey: ['friends', 'check', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return { hasFriended: false };
      return api.get<{ hasFriended: boolean }>(`/friends/check?targetUserId=${targetUserId}`);
    },
    enabled: !!targetUserId,
    initialPageParam: undefined as string | undefined,
    getNextPageParam: () => undefined,
  });
}

export function useFriendsQueryKey() {
  return [FRIENDS_QUERY_KEY];
}
