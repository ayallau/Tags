/**
 * AuthInitializer - Initializes auth state on app mount
 */

import { useAuthMe } from '../../shared/hooks/useAuth';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  // Fetch current user on mount to initialize auth state
  useAuthMe();

  return <>{children}</>;
}
