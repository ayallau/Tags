/**
 * React Query hooks for tags
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import type { Tag, TagListResponse, CreateTagDto, UpdateTagDto } from '../types/tag';

/**
 * Query keys for tags
 */
export const tagKeys = {
  all: ['tags'] as const,
  lists: () => [...tagKeys.all, 'list'] as const,
  list: (params: Record<string, unknown>) => [...tagKeys.lists(), params] as const,
  details: () => [...tagKeys.all, 'detail'] as const,
  detail: (id: string) => [...tagKeys.details(), id] as const,
  searches: () => [...tagKeys.all, 'search'] as const,
  search: (query: string) => [...tagKeys.searches(), query] as const,
};

/**
 * Hook to list tags with pagination
 */
export function useListTags(params: { query?: string; limit?: number; cursor?: string }) {
  return useQuery<TagListResponse>({
    queryKey: tagKeys.list(params),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.query) searchParams.append('query', params.query);
      if (params.limit) searchParams.append('limit', params.limit.toString());
      if (params.cursor) searchParams.append('cursor', params.cursor);

      const queryString = searchParams.toString();
      const endpoint = `/tags${queryString ? `?${queryString}` : ''}`;

      return api.get<TagListResponse>(endpoint);
    },
  });
}

/**
 * Hook to search tags (autocomplete)
 * Returns empty array if query is less than 2 characters
 */
export function useSearchTags(query: string) {
  return useQuery<Tag[]>({
    queryKey: tagKeys.search(query),
    queryFn: async () => {
      if (query.length < 2) return [];

      return api.get<Tag[]>(`/tags/search?query=${encodeURIComponent(query)}`);
    },
    enabled: query.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes for autocomplete
  });
}

/**
 * Hook to get a single tag by ID
 */
export function useTag(id: string) {
  return useQuery<Tag>({
    queryKey: tagKeys.detail(id),
    queryFn: () => api.get<Tag>(`/tags/${id}`),
    enabled: !!id,
  });
}

/**
 * Hook to create a tag
 */
export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation<Tag, Error, CreateTagDto>({
    mutationFn: data => api.post<Tag>('/tags', data),
    onSuccess: () => {
      // Invalidate all tag queries
      queryClient.invalidateQueries({ queryKey: tagKeys.all });
    },
  });
}

/**
 * Hook to update a tag
 */
export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation<Tag, Error, { id: string; data: UpdateTagDto }>({
    mutationFn: ({ id, data }) => api.patch<Tag>(`/tags/${id}`, data),
    onSuccess: (_, variables) => {
      // Invalidate specific tag and all lists
      queryClient.invalidateQueries({ queryKey: tagKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
    },
  });
}

/**
 * Hook to delete a tag
 */
export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: id => api.delete<void>(`/tags/${id}`),
    onSuccess: () => {
      // Invalidate all tag queries
      queryClient.invalidateQueries({ queryKey: tagKeys.all });
    },
  });
}
