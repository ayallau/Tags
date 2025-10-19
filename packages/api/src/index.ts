import { ApiClient, type ApiConfig, type TokenStorage } from './client.js';
import { TagsApi } from './endpoints.js';

// Default API configuration based on environment
function getDefaultConfig(): ApiConfig {
  const baseURL = process.env['NODE_ENV'] === 'production' 
    ? 'https://api.tags.com' 
    : 'http://localhost:3001';

  return {
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  };
}

// Create default API instance
export function createApiClient(config?: Partial<ApiConfig>, tokenStorage?: TokenStorage): TagsApi {
  const defaultConfig = getDefaultConfig();
  const finalConfig = { ...defaultConfig, ...config };
  
  const client = new ApiClient(finalConfig, tokenStorage);
  return new TagsApi(client);
}

// Default API instance
export const api = createApiClient();

// Export types and classes
export { ApiClient } from './client.js';
export { TagsApi, AuthApi, UserApi, TagApi } from './endpoints.js';
export type { ApiConfig, TokenStorage } from './client.js';
