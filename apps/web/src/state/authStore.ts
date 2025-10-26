/**
 * Auth Store - Zustand state management for authentication
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type AuthState = 'unknown' | 'guest' | 'user';

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
  isOnboardingComplete?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthStore {
  // State
  authState: AuthState;
  user: User | null;
  accessToken: string | null;

  // Actions
  setAuthState: (state: AuthState) => void;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;

  // Derived state
  isAuthenticated: () => boolean;
  isOnboardingComplete: () => boolean;
  hasProfile: () => boolean;
}

const initialState = {
  authState: 'unknown' as AuthState,
  user: null as User | null,
  accessToken: null as string | null,
};

// Create the store with SSR safety
export const useAuthStore = create<AuthStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Setters
      setAuthState: (state: AuthState) => set({ authState: state }, false, 'setAuthState'),

      setUser: (user: User | null) => set({ user }, false, `setUser/${user?._id || 'null'}`),

      setAccessToken: (token: string | null) => {
        if (token) {
          localStorage.setItem('accessToken', token);
        } else {
          localStorage.removeItem('accessToken');
        }
        set({ accessToken: token }, false, 'setAccessToken');
      },

      // Login action
      login: (user: User, token: string) => {
        localStorage.setItem('accessToken', token);
        set(
          {
            authState: 'user',
            user,
            accessToken: token,
          },
          false,
          `login/${user._id}`
        );
      },

      // Logout action
      logout: () => {
        localStorage.removeItem('accessToken');
        set(
          {
            authState: 'guest',
            user: null,
            accessToken: null,
          },
          false,
          'logout'
        );
      },

      // Derived state
      isAuthenticated: () => get().authState === 'user',

      isOnboardingComplete: () => {
        const user = get().user;
        return user?.isOnboardingComplete ?? false;
      },

      hasProfile: () => {
        const user = get().user;
        return Boolean(user?.username && user?.email);
      },
    }),
    { name: 'AuthStore' }
  )
);
