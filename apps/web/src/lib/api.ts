/**
 * API Client Helpers
 * Provides typed fetch wrappers for API requests
 */

import { getApiEndpoint } from '../config';

// Refresh token state
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

/**
 * Get auth headers for authenticated requests
 */
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

/**
 * Refresh access token using refresh token from cookie
 */
async function refreshAccessToken(): Promise<string | null> {
  // If already refreshing, return the existing promise
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const response = await fetch(getApiEndpoint('/auth/refresh'), {
        method: 'POST',
        credentials: 'include', // Important for cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      const newAccessToken = data.accessToken;

      if (newAccessToken) {
        localStorage.setItem('accessToken', newAccessToken);
      }

      return newAccessToken;
    } catch (error) {
      // Clear token on refresh failure
      localStorage.removeItem('accessToken');
      throw error;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Generic fetch wrapper with 401 handling and token refresh
 */
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = getApiEndpoint(endpoint);

  const response = await fetch(url, {
    ...options,
    credentials: 'include', // Important for cookies
    headers: {
      ...getAuthHeaders(),
      ...options?.headers,
    },
  });

  // Handle 401 Unauthorized - try to refresh token
  if (response.status === 401 && endpoint !== '/auth/refresh' && endpoint !== '/auth/logout') {
    try {
      const newToken = await refreshAccessToken();

      if (newToken) {
        // Retry the original request with new token
        const retryResponse = await fetch(url, {
          ...options,
          credentials: 'include',
          headers: {
            ...getAuthHeaders(),
            ...options?.headers,
          },
        });

        if (!retryResponse.ok) {
          const errorText = await retryResponse.text();
          throw new Error(`HTTP ${retryResponse.status}: ${errorText || retryResponse.statusText}`);
        }

        // Handle 204 No Content
        if (retryResponse.status === 204) {
          return undefined as T;
        }

        return retryResponse.json();
      }
    } catch (refreshError) {
      // Refresh failed, clear auth state
      localStorage.removeItem('accessToken');
      // Trigger logout
      if (typeof window !== 'undefined') {
        window.location.href = '/welcome';
      }
      throw new Error('Session expired. Please login again.');
    }
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

/**
 * API request methods
 */
export const api = {
  get<T>(endpoint: string): Promise<T> {
    return apiFetch<T>(endpoint, { method: 'GET' });
  },

  post<T>(endpoint: string, data?: unknown): Promise<T> {
    return apiFetch<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return apiFetch<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete<T>(endpoint: string): Promise<T> {
    return apiFetch<T>(endpoint, { method: 'DELETE' });
  },
};
