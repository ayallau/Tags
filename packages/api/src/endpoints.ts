import { ApiClient } from './client.js';
import type { 
  Login, 
  Register, 
  AuthResponse, 
  PasswordResetRequest, 
  PasswordReset
} from '../../models/dist/auth.js';
import type { User, UpdateUser } from '../../models/dist/user.js';
import type { Tag, CreateTag, UpdateTag, TagFilter } from '../../models/dist/tag.js';
import type { ApiResponse, PaginatedResponse } from '../../models/dist/api.js';

// Auth API methods
export class AuthApi {
  constructor(private client: ApiClient) {}

  async login(credentials: Login): Promise<ApiResponse<AuthResponse>> {
    return this.client.post('/auth/login', credentials);
  }

  async register(userData: Register): Promise<ApiResponse<AuthResponse>> {
    return this.client.post('/auth/register', userData);
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.client.post('/auth/logout');
  }

  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    // Refresh token is automatically sent via HttpOnly cookie
    return this.client.post('/auth/refresh', {});
  }

  async requestPasswordReset(data: PasswordResetRequest): Promise<ApiResponse<void>> {
    return this.client.post('/auth/forgot-password', data);
  }

  async resetPassword(data: PasswordReset): Promise<ApiResponse<void>> {
    return this.client.post('/auth/reset-password', data);
  }

  async verifyEmail(token: string): Promise<ApiResponse<void>> {
    return this.client.post('/auth/verify-email', { token });
  }
}

// User API methods
export class UserApi {
  constructor(private client: ApiClient) {}

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.client.get('/users/me');
  }

  async updateProfile(userData: UpdateUser): Promise<ApiResponse<User>> {
    return this.client.patch('/users/me', userData);
  }

  async deleteAccount(): Promise<ApiResponse<void>> {
    return this.client.delete('/users/me');
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return this.client.get(`/users/${id}`);
  }

  async searchUsers(query: string, limit = 20): Promise<ApiResponse<User[]>> {
    return this.client.get('/users/search', {
      params: { q: query, limit }
    });
  }
}

// Tag API methods
export class TagApi {
  constructor(private client: ApiClient) {}

  async getTags(filter?: TagFilter): Promise<ApiResponse<PaginatedResponse<Tag>>> {
    return this.client.get('/tags', {
      params: filter
    });
  }

  async getTagById(id: string): Promise<ApiResponse<Tag>> {
    return this.client.get(`/tags/${id}`);
  }

  async createTag(tagData: CreateTag): Promise<ApiResponse<Tag>> {
    return this.client.post('/tags', tagData);
  }

  async updateTag(id: string, tagData: UpdateTag): Promise<ApiResponse<Tag>> {
    return this.client.patch(`/tags/${id}`, tagData);
  }

  async deleteTag(id: string): Promise<ApiResponse<void>> {
    return this.client.delete(`/tags/${id}`);
  }

  async getUserTags(userId?: string): Promise<ApiResponse<Tag[]>> {
    const url = userId ? `/users/${userId}/tags` : '/users/me/tags';
    return this.client.get(url);
  }

  async searchTags(query: string, limit = 20): Promise<ApiResponse<Tag[]>> {
    return this.client.get('/tags/search', {
      params: { q: query, limit }
    });
  }
}

// Main API class that combines all APIs
export class TagsApi {
  public auth: AuthApi;
  public users: UserApi;
  public tags: TagApi;

  constructor(client: ApiClient) {
    this.auth = new AuthApi(client);
    this.users = new UserApi(client);
    this.tags = new TagApi(client);
  }
}
