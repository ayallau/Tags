import { cn } from '../../shared/lib/utils';

interface PageSkeletonProps {
  className?: string;
}

export function PageSkeleton({ className }: PageSkeletonProps) {
  return (
    <div 
      className={cn('space-y-6 p-6', className)}
      aria-busy="true"
      aria-live="polite"
      role="status"
      aria-label="Loading page content"
    >
      {/* Page Title Skeleton */}
      <div className="space-y-3">
        <div className="h-8 w-64 bg-muted animate-pulse rounded-md" />
        <div className="h-4 w-96 bg-muted animate-pulse rounded-md" />
      </div>

      {/* Content Blocks */}
      <div className="space-y-4">
        {/* First content block */}
        <div className="space-y-3">
          <div className="h-6 w-48 bg-muted animate-pulse rounded-md" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted animate-pulse rounded-md" />
            <div className="h-4 w-3/4 bg-muted animate-pulse rounded-md" />
            <div className="h-4 w-1/2 bg-muted animate-pulse rounded-md" />
          </div>
        </div>

        {/* Second content block */}
        <div className="space-y-3">
          <div className="h-6 w-40 bg-muted animate-pulse rounded-md" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted animate-pulse rounded-md" />
            <div className="h-4 w-5/6 bg-muted animate-pulse rounded-md" />
          </div>
        </div>

        {/* Grid/List placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3 p-4 border border-border rounded-lg">
              <div className="h-4 w-3/4 bg-muted animate-pulse rounded-md" />
              <div className="h-3 w-1/2 bg-muted animate-pulse rounded-md" />
              <div className="h-3 w-full bg-muted animate-pulse rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
