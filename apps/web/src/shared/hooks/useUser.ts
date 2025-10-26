/**
 * React Query hooks for user management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

export interface User {
  _id: string;
  email?: string;
  username?: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  photos?: string[];
  tags?: string[];
  isOnline?: boolean;
  lastVisitAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateUserDto {
  username?: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  photos?: string[];
  tags?: string[];
}

/**
 * Query keys for users
 */
export const userKeys = {
  all: ['users'] as const,
  current: ['users', 'current'] as const,
  profile: (id: string) => ['users', 'profile', id] as const,
};

/**
 * Hook to get current user profile
 */
export function useCurrentUser() {
  return useQuery<User>({
    queryKey: userKeys.current,
    queryFn: async () => {
      return api.get<User>('/users/me');
    },
  });
}

/**
 * Hook to update current user profile
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation<User, Error, UpdateUserDto>({
    mutationFn: async data => {
      return api.patch<User>('/users/me', data);
    },
    onSuccess: () => {
      // Invalidate current user query
      queryClient.invalidateQueries({ queryKey: userKeys.current });
    },
  });
}
