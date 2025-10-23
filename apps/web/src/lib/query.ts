import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useUIStore } from '../state/ui';

// Query error handler that maps errors to toasts
const queryErrorHandler = (error: unknown): void => {
  console.error('Query error:', error);
  
  // Get toast actions from the store
  const { pushToast } = useUIStore.getState();
  
  // Map error to toast
  let errorMessage = 'An unexpected error occurred';
  let errorType: 'error' | 'warn' = 'error';
  
  if (error instanceof Error) {
    errorMessage = error.message;
    
    // Map specific error types
    if (error.message.includes('404')) {
      errorMessage = 'Resource not found';
      errorType = 'warn';
    } else if (error.message.includes('401')) {
      errorMessage = 'Authentication required';
      errorType = 'warn';
    } else if (error.message.includes('403')) {
      errorMessage = 'Access denied';
      errorType = 'warn';
    } else if (error.message.includes('500')) {
      errorMessage = 'Server error occurred';
    } else if (error.message.includes('Network')) {
      errorMessage = 'Network connection failed';
    }
  }
  
  // Push toast notification (non-blocking)
  try {
    pushToast({
      title: 'Error',
      description: errorMessage,
      type: errorType,
      duration: 7000, // Longer duration for errors
    });
  } catch (toastError) {
    console.warn('Failed to show error toast:', toastError);
  }
};

// Create and configure QueryClient
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data freshness settings
      staleTime: 30_000, // 30 seconds
      gcTime: 5 * 60_000, // 5 minutes (formerly cacheTime)
      
      // Retry settings
      retry: (failureCount, error) => {
        // Don't retry on 404 or 401 errors
        if (error instanceof Error) {
          if (error.message.includes('404') || error.message.includes('401')) {
            return false;
          }
        }
        // Retry once for other errors
        return failureCount < 1;
      },
      
      // Refetch settings
      refetchOnWindowFocus: false, // Don't refetch when window gains focus
      refetchOnReconnect: true, // Refetch when network reconnects
      refetchOnMount: true, // Refetch when component mounts
      
      // Error handling
      throwOnError: false, // Don't throw errors to components
    },
    mutations: {
      // Retry mutations once
      retry: 1,
      
      // Error handling for mutations
      onError: queryErrorHandler,
    },
  },
});

// QueryClientProvider wrapper component
interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      
      {/* React Query Devtools - only in development */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools
          initialIsOpen={false}
          position="bottom-right"
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
}

// React import for JSX
import React from 'react';
