/**
 * API Client Helpers
 * Provides typed fetch wrappers for API requests
 */

import { getApiEndpoint } from '../config';

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
 * Generic fetch wrapper
 */
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = getApiEndpoint(endpoint);

  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options?.headers,
    },
  });

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
