import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import type { ApiResponse } from "../../models/dist/api.js";

// API Configuration
export interface ApiConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

// Token storage interface
export interface TokenStorage {
  getAccessToken(): string | null;
  setAccessToken(token: string): void;
  removeAccessToken(): void;
  getRefreshToken(): string | null;
  setRefreshToken(token: string): void;
  removeRefreshToken(): void;
}

// Cookie utility functions
function setCookie(
  name: string,
  value: string,
  options: {
    secure?: boolean;
    sameSite?: "strict" | "lax" | "none";
    maxAge?: number;
    path?: string;
  } = {}
): void {
  if (typeof document === "undefined") return;

  const {
    secure = true,
    sameSite = "strict",
    maxAge = 7 * 24 * 60 * 60, // 7 days default
    path = "/",
  } = options;

  let cookieString = `${name}=${value}; Path=${path}; Max-Age=${maxAge}; SameSite=${sameSite}`;

  if (secure) {
    cookieString += "; Secure";
  }

  document.cookie = cookieString;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
}

function deleteCookie(name: string, path: string = "/"): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; Path=${path}; Max-Age=0`;
}

// Default token storage using localStorage for access token and cookies for refresh token
class LocalTokenStorage implements TokenStorage {
  private readonly ACCESS_TOKEN_KEY = "tags_access_token";
  private readonly REFRESH_TOKEN_KEY = "tags_refresh_token";

  getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  setAccessToken(token: string): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  removeAccessToken(): void {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return getCookie(this.REFRESH_TOKEN_KEY);
  }

  setRefreshToken(token: string): void {
    setCookie(this.REFRESH_TOKEN_KEY, token, {
      secure: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });
  }

  removeRefreshToken(): void {
    deleteCookie(this.REFRESH_TOKEN_KEY);
  }
}

// API Client class
export class ApiClient {
  private client: AxiosInstance;
  private tokenStorage: TokenStorage;
  private isRefreshing = false;
  private refreshPromise: Promise<string> | null = null;

  constructor(config: ApiConfig, tokenStorage?: TokenStorage) {
    this.tokenStorage = tokenStorage || new LocalTokenStorage();

    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      withCredentials: true, // Include cookies in all requests
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.tokenStorage.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            this.clearTokens();
            // Redirect to login or emit event
            this.handleAuthError();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private async refreshAccessToken(): Promise<string> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.performTokenRefresh();

    try {
      const newToken = await this.refreshPromise;
      return newToken;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<string> {
    try {
      const response = await axios.post(
        `${this.client.defaults.baseURL}/auth/refresh`,
        {},
        {
          withCredentials: true, // Include cookies in request
        }
      );

      const { accessToken } = response.data;

      this.tokenStorage.setAccessToken(accessToken);
      // Refresh token is automatically updated in cookie by server

      return accessToken;
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  private clearTokens(): void {
    this.tokenStorage.removeAccessToken();
    this.tokenStorage.removeRefreshToken();
  }

  private handleAuthError(): void {
    // Emit custom event or call callback
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("auth:logout"));
    }
  }

  // Public methods
  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.get(
      url,
      config
    );
    return response.data;
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.post(
      url,
      data,
      config
    );
    return response.data;
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.put(
      url,
      data,
      config
    );
    return response.data;
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.patch(
      url,
      data,
      config
    );
    return response.data;
  }

  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.delete(
      url,
      config
    );
    return response.data;
  }

  // Auth methods
  setTokens(accessToken: string, refreshToken: string): void {
    this.tokenStorage.setAccessToken(accessToken);
    this.tokenStorage.setRefreshToken(refreshToken);
  }

  clearAuth(): void {
    this.clearTokens();
  }

  isAuthenticated(): boolean {
    return !!this.tokenStorage.getAccessToken();
  }
}
