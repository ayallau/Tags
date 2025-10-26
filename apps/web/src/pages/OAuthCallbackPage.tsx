/**
 * OAuth Callback Page - Handles OAuth redirect from server with access token
 */

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../state/authStore';
import { useUIStore } from '../state/ui';
import { useQueryClient } from '@tanstack/react-query';
import { authKeys } from '../shared/hooks/useAuth';
import { api } from '../lib/api';

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAccessToken, setAuthState, login } = useAuthStore();
  const { pushToast } = useUIStore();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const token = searchParams.get('token');

        if (!token) {
          setStatus('error');
          pushToast({
            title: 'Authentication Error',
            description: 'No access token received from server',
            type: 'error',
          });
          navigate('/welcome');
          return;
        }

        // Save token to store and localStorage
        setAccessToken(token);
        setAuthState('user');

        // Fetch user data from server
        const userData = await queryClient.fetchQuery({
          queryKey: authKeys.me,
          queryFn: async () => {
            return api.get<any>('/users/me');
          },
        });

        if (userData && userData._id) {
          login(userData, token);

          pushToast({
            title: 'Success',
            description: 'Logged in successfully',
            type: 'success',
          });

          // Navigate to intended route or discover
          const intendedRoute = sessionStorage.getItem('intendedRoute') || '/discover';
          sessionStorage.removeItem('intendedRoute');
          navigate(intendedRoute);

          setStatus('success');
        } else {
          throw new Error('Invalid user data received');
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        pushToast({
          title: 'Authentication Error',
          description: 'Failed to complete authentication',
          type: 'error',
        });
        navigate('/welcome');
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, setAccessToken, setAuthState, login, pushToast, queryClient]);

  if (status === 'loading') {
    return (
      <div className='min-h-dvh flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5'>
        <div className='text-center space-y-4'>
          <div className='mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent' />
          <h2 className='text-xl font-semibold text-foreground'>Completing authentication...</h2>
          <p className='text-muted-foreground'>Please wait while we log you in</p>
        </div>
      </div>
    );
  }

  return null;
}
