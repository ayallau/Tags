import { cn } from '../../shared/lib/utils';

interface ListSkeletonProps {
  className?: string;
  itemCount?: number;
  variant?: 'avatar' | 'icon' | 'minimal';
}

export function ListSkeleton({ 
  className, 
  itemCount = 5,
  variant = 'avatar'
}: ListSkeletonProps) {
  const renderSkeletonItem = (index: number) => {
    if (variant === 'minimal') {
      return (
        <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
          <div className="flex-1 space-y-1">
            <div className="h-4 w-32 bg-muted animate-pulse rounded-md" />
            <div className="h-3 w-24 bg-muted animate-pulse rounded-md" />
          </div>
          <div className="h-4 w-16 bg-muted animate-pulse rounded-md" />
        </div>
      );
    }

    if (variant === 'icon') {
      return (
        <div key={index} className="flex items-center gap-3 py-3 border-b border-border last:border-b-0">
          <div className="h-8 w-8 bg-muted animate-pulse rounded-md" />
          <div className="flex-1 space-y-1">
            <div className="h-4 w-28 bg-muted animate-pulse rounded-md" />
            <div className="h-3 w-20 bg-muted animate-pulse rounded-md" />
          </div>
          <div className="h-4 w-12 bg-muted animate-pulse rounded-md" />
        </div>
      );
    }

    // Default avatar variant
    return (
      <div key={index} className="flex items-center gap-4 py-4 border-b border-border last:border-b-0">
        <div className="h-12 w-12 bg-muted animate-pulse rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 bg-muted animate-pulse rounded-md" />
          <div className="h-3 w-24 bg-muted animate-pulse rounded-md" />
          <div className="h-3 w-40 bg-muted animate-pulse rounded-md" />
        </div>
        <div className="flex flex-col items-end space-y-1">
          <div className="h-3 w-16 bg-muted animate-pulse rounded-md" />
          <div className="h-4 w-8 bg-muted animate-pulse rounded-full" />
        </div>
      </div>
    );
  };

  return (
    <div 
      className={cn("space-y-0", className)}
      aria-busy="true"
      aria-live="polite"
      role="status"
      aria-label={`Loading list with ${itemCount} items`}
    >
      {Array.from({ length: itemCount }).map((_, index) => renderSkeletonItem(index))}
    </div>
  );
}
