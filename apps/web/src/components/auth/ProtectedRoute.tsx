/**
 * ProtectedRoute - Guards routes that require authentication
 */

import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../state/authStore';
import { useAuthMe } from '../../shared/hooks/useAuth';
import { PageSkeleton } from '../skeletons';

interface ProtectedRouteProps {
  children: ReactElement;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const { authState, setAuthState } = useAuthStore();

  // Fetch current user on mount
  const { data, isLoading, isError } = useAuthMe();

  const [initialCheck, setInitialCheck] = useState(false);

  useEffect(() => {
    if (!isLoading && data) {
      // User is authenticated
      setInitialCheck(true);
    } else if (!isLoading && isError) {
      // User is not authenticated
      sessionStorage.setItem('intendedRoute', location.pathname);
      setAuthState('guest');
      setInitialCheck(true);
    }
  }, [isLoading, isError, data, location.pathname, setAuthState]);

  // Show skeleton while checking
  if (!initialCheck || isLoading) {
    return <PageSkeleton />;
  }

  // Redirect to welcome if not authenticated
  if (authState === 'guest' || authState === 'unknown') {
    return <Navigate to='/welcome' replace />;
  }

  // Render protected content
  return children;
}
