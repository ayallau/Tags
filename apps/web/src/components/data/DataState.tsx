import type { ReactNode } from 'react';
import { cn } from '../../shared/lib/utils';
import { PageSkeleton } from '../skeletons';
import { EmptyState } from './EmptyState';

type DataStatus = 'idle' | 'loading' | 'empty' | 'error' | 'success';

interface DataStateProps {
  status: DataStatus;
  loadingFallback?: ReactNode;
  emptyFallback?: ReactNode;
  errorFallback?: ReactNode;
  children?: ReactNode;
  'aria-busy'?: boolean;
  'aria-live'?: 'polite' | 'assertive' | 'off';
  className?: string;
}

export function DataState({
  status,
  loadingFallback,
  emptyFallback,
  errorFallback,
  children,
  'aria-busy': ariaBusy,
  'aria-live': ariaLive,
  className,
}: DataStateProps) {
  const isBusy = ariaBusy ?? (status === 'loading');
  const liveRegion = ariaLive ?? (status === 'loading' || status === 'error' ? 'polite' : 'off');

  const getContent = () => {
    switch (status) {
      case 'loading':
        return loadingFallback ?? <PageSkeleton />;
      
      case 'empty':
        return emptyFallback ?? (
          <EmptyState
            title="No results found"
            description="Try adjusting your search criteria or filters"
            variant="default"
          />
        );
      
      case 'error':
        return errorFallback ?? (
          <EmptyState
            title="Something went wrong"
            description="We encountered an error while loading the data. Please try again."
            variant="error"
          />
        );
      
      case 'success':
        return children;
      
      case 'idle':
      default:
        return null;
    }
  };

  return (
    <div
      className={cn('min-h-[200px]', className)}
      aria-busy={isBusy}
      aria-live={liveRegion}
      role={status === 'error' ? 'alert' : 'status'}
    >
      {getContent()}
    </div>
  );
}
