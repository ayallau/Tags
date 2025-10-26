/**
 * PublicOnlyRoute - Guards routes that should not be accessible when authenticated
 */

import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../state/authStore';
import { useAuthMe } from '../../shared/hooks/useAuth';
import { PageSkeleton } from '../skeletons';

interface PublicOnlyRouteProps {
  children: ReactElement;
}

export function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const { authState, setAuthState } = useAuthStore();

  // Fetch current user on mount (to check if authenticated)
  const { data, isLoading, isError } = useAuthMe();

  const [initialCheck, setInitialCheck] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setInitialCheck(true);
      if (!isError && data) {
        // User is authenticated
        setAuthState('user');
      } else {
        // User is not authenticated
        setAuthState('guest');
      }
    }
  }, [isLoading, isError, data, setAuthState]);

  // Show skeleton while checking
  if (!initialCheck || isLoading) {
    return <PageSkeleton />;
  }

  // Redirect to home if authenticated
  if (authState === 'user') {
    return <Navigate to='/discover' replace />;
  }

  // Render public content
  return children;
}
