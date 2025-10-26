/**
 * React Query hooks for bookmark management
 */

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

export interface BookmarkTargetUser {
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

export interface Bookmark {
  _id: string;
  userId: string;
  targetUserId: string;
  targetUser: BookmarkTargetUser;
  remark?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookmarkListResponse {
  bookmarks: Bookmark[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface CreateBookmarkDto {
  targetUserId: string;
  remark?: string;
}

export interface UpdateBookmarkDto {
  remark?: string;
}

export interface BookmarkQueryParams {
  query?: string;
  cursor?: string;
  limit?: number;
}

const BOOKMARKS_QUERY_KEY = 'bookmarks';

async function getBookmarks(params: BookmarkQueryParams): Promise<BookmarkListResponse> {
  const { cursor, ...queryParams } = params;
  const searchParams = new URLSearchParams();
  if (queryParams.query) searchParams.append('query', queryParams.query);
  if (cursor) searchParams.append('cursor', cursor);
  if (queryParams.limit) searchParams.append('limit', String(queryParams.limit));

  const queryString = searchParams.toString();
  const response = await api.get<BookmarkListResponse>(`/bookmarks?${queryString}`);
  return response;
}

export function useBookmarksQuery(params: BookmarkQueryParams = {}) {
  return useInfiniteQuery({
    queryKey: [BOOKMARKS_QUERY_KEY, params],
    queryFn: ({ pageParam }) => {
      const queryParams = { ...params };
      if (pageParam) {
        queryParams.cursor = pageParam;
      }
      return getBookmarks(queryParams);
    },
    getNextPageParam: lastPage => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
    enabled: true,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
}

export function useAddBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBookmarkDto) => {
      return api.post<Bookmark>('/bookmarks', data);
    },
    onSuccess: () => {
      // Invalidate bookmarks list to refetch
      queryClient.invalidateQueries({ queryKey: [BOOKMARKS_QUERY_KEY] });
    },
  });
}

export function useUpdateBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateBookmarkDto }) => {
      return api.patch<Bookmark>(`/bookmarks/${id}`, data);
    },
    onSuccess: () => {
      // Invalidate bookmarks list to refetch
      queryClient.invalidateQueries({ queryKey: [BOOKMARKS_QUERY_KEY] });
    },
  });
}

export function useRemoveBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return api.delete<void>(`/bookmarks/${id}`);
    },
    onSuccess: () => {
      // Invalidate bookmarks list to refetch
      queryClient.invalidateQueries({ queryKey: [BOOKMARKS_QUERY_KEY] });
    },
  });
}

export function useCheckBookmark(targetUserId?: string) {
  return useInfiniteQuery({
    queryKey: ['bookmarks', 'check', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return { hasBookmarked: false };
      return api.get<{ hasBookmarked: boolean }>(`/bookmarks/check?targetUserId=${targetUserId}`);
    },
    enabled: !!targetUserId,
    initialPageParam: undefined as string | undefined,
    getNextPageParam: () => undefined,
  });
}

export function useBookmarksQueryKey() {
  return [BOOKMARKS_QUERY_KEY];
}
