/**
 * Auth Hooks - React Query hooks for authentication
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuthStore } from '../../state/authStore';
import { useUIStore } from '../../state/ui';

interface LoginDto {
  email: string;
  password: string;
}

interface SignupDto {
  username: string;
  email: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
}

interface ForgotPasswordDto {
  email: string;
}

interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

/**
 * Query key factories for auth
 */
export const authKeys = {
  all: ['auth'] as const,
  current: ['auth', 'current'] as const,
  me: ['auth', 'me'] as const,
};

/**
 * Hook to get current user from /auth/me
 */
export function useAuthMe() {
  const { setUser, setAuthState } = useAuthStore();
  const accessToken = localStorage.getItem('accessToken');

  return useQuery({
    queryKey: authKeys.me,
    queryFn: async () => {
      const response = await api.get<any>('/users/me');
      setUser(response);
      setAuthState('user');
      return response;
    },
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!accessToken, // Only run if we have an access token
  });
}

/**
 * Hook to login with email/password
 */
export function useLogin() {
  const navigate = useNavigate();
  const { setAccessToken, setAuthState } = useAuthStore();
  const { pushToast } = useUIStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginDto) => {
      const response = await api.post<AuthResponse>('/auth/login', data);
      return response;
    },
    onSuccess: async data => {
      // Save token to localStorage first
      setAccessToken(data.accessToken);
      setAuthState('user');

      // Fetch user data
      try {
        const userData = (await queryClient.fetchQuery({ queryKey: authKeys.me })) as any;
        if (userData && userData._id) {
          const { login } = useAuthStore.getState();
          login(userData, data.accessToken);

          pushToast({
            title: 'Success',
            description: 'Logged in successfully',
            type: 'success',
          });

          // Redirect based on onboarding status
          if (!userData.isOnboardingComplete) {
            // Not completed onboarding, redirect there
            navigate('/onboarding');
          } else {
            // Completed onboarding, go to intended route or home
            const intendedRoute = sessionStorage.getItem('intendedRoute') || '/discover';
            sessionStorage.removeItem('intendedRoute');
            navigate(intendedRoute);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data after login:', error);
        pushToast({
          title: 'Success',
          description: 'Logged in successfully',
          type: 'success',
        });
        // Default to onboarding if we can't fetch user data
        navigate('/onboarding');
      }
    },
    onError: (error: Error & { status?: number }) => {
      let message = 'Failed to login';

      // Check status code if available
      if ((error as any).status === 400 || (error as any).status === 401) {
        message = error.message || 'Invalid email or password';
      } else if ((error as any).status === 500) {
        message = 'Server error. Please try again later.';
      } else {
        message = error.message || 'Failed to login';
      }

      pushToast({
        title: 'Login Failed',
        description: message,
        type: 'error',
      });
    },
  });
}

/**
 * Hook to signup with email/password
 */
export function useSignup() {
  const navigate = useNavigate();
  const { login, setAccessToken, setAuthState } = useAuthStore();
  const { pushToast } = useUIStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SignupDto) => {
      const response = await api.post<AuthResponse>('/auth/register', data);
      return response;
    },
    onSuccess: async data => {
      // Save token to localStorage first
      setAccessToken(data.accessToken);
      setAuthState('user');

      // Fetch user data
      try {
        const userData = (await queryClient.fetchQuery({ queryKey: authKeys.me })) as any;
        if (userData && userData._id) {
          login(userData, data.accessToken);

          pushToast({
            title: 'Account Created',
            description: 'Welcome! Please complete your profile',
            type: 'success',
          });

          // Redirect based on onboarding status
          if (!userData.isOnboardingComplete) {
            navigate('/onboarding');
          } else {
            // Already completed onboarding, go to home
            const intendedRoute = sessionStorage.getItem('intendedRoute') || '/discover';
            sessionStorage.removeItem('intendedRoute');
            navigate(intendedRoute);
          }
        }
      } catch (error) {
        // If /me fails, redirect to onboarding as fallback
        console.error('Failed to fetch user data after signup:', error);
        pushToast({
          title: 'Account Created',
          description: 'Welcome! Please complete your profile',
          type: 'success',
        });
        navigate('/onboarding');
      }
    },
    onError: (error: Error & { status?: number }) => {
      let message = 'Failed to create account';

      // Check status code if available
      if ((error as any).status === 409) {
        message = error.message || 'Email or username already registered';
      } else if ((error as any).status === 400) {
        message = error.message || 'Invalid signup data';
      } else if ((error as any).status === 500) {
        message = 'Server error. Please try again later.';
      } else {
        message = error.message || 'Failed to create account';
      }

      pushToast({
        title: 'Signup Failed',
        description: message,
        type: 'error',
      });
    },
  });
}

/**
 * Hook to logout
 */
export function useLogout() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { pushToast } = useUIStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return api.post('/auth/logout', {});
    },
    onSuccess: () => {
      // Clear store
      logout();
      queryClient.clear();

      pushToast({
        title: 'Logged Out',
        description: 'You have been logged out successfully',
        type: 'success',
      });

      // Redirect to welcome
      navigate('/welcome');
    },
    onError: () => {
      // Even if API fails, logout locally
      logout();
      queryClient.clear();
      navigate('/welcome');
    },
  });
}

/**
 * Hook to send forgot password email
 */
export function useForgotPassword() {
  const { pushToast } = useUIStore();

  return useMutation({
    mutationFn: async (data: ForgotPasswordDto) => {
      return api.post('/auth/forgot-password', data);
    },
    onSuccess: () => {
      pushToast({
        title: 'Reset Link Sent',
        description: 'Check your email for password reset instructions',
        type: 'success',
      });
    },
    onError: () => {
      pushToast({
        title: 'Error',
        description: 'Failed to send reset email',
        type: 'error',
      });
    },
  });
}

/**
 * Hook to reset password with token
 */
export function useResetPassword() {
  const navigate = useNavigate();
  const { pushToast } = useUIStore();

  return useMutation({
    mutationFn: async (data: ResetPasswordDto) => {
      return api.post('/auth/reset-password', data);
    },
    onSuccess: () => {
      pushToast({
        title: 'Password Reset',
        description: 'Your password has been reset successfully',
        type: 'success',
      });
      navigate('/welcome');
    },
    onError: (error: Error & { status?: number }) => {
      let message = 'Failed to reset password';

      // Check status code if available
      if ((error as any).status === 400) {
        message = error.message || 'Invalid or expired reset token';
      } else if ((error as any).status === 500) {
        message = 'Server error. Please try again later.';
      } else {
        message = error.message || 'Failed to reset password';
      }

      pushToast({
        title: 'Reset Failed',
        description: message,
        type: 'error',
      });
    },
  });
}
