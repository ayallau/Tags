import { cn } from '../../shared/lib/utils';

interface TileSkeletonProps {
  className?: string;
  variant?: 'card' | 'compact' | 'detailed';
}

export function TileSkeleton({ 
  className, 
  variant = 'card' 
}: TileSkeletonProps) {
  const baseClasses = "border border-border rounded-lg bg-background";
  
  if (variant === 'compact') {
    return (
      <div 
        className={cn(baseClasses, "p-3", className)}
        aria-busy="true"
        role="status"
        aria-label="Loading tile content"
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-muted animate-pulse rounded-full" />
          <div className="flex-1 space-y-1">
            <div className="h-4 w-24 bg-muted animate-pulse rounded-md" />
            <div className="h-3 w-16 bg-muted animate-pulse rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div 
        className={cn(baseClasses, "p-6", className)}
        aria-busy="true"
        role="status"
        aria-label="Loading detailed tile content"
      >
        <div className="space-y-4">
          {/* Header with avatar */}
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-muted animate-pulse rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-32 bg-muted animate-pulse rounded-md" />
              <div className="h-4 w-20 bg-muted animate-pulse rounded-md" />
            </div>
          </div>
          
          {/* Content */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted animate-pulse rounded-md" />
            <div className="h-4 w-3/4 bg-muted animate-pulse rounded-md" />
            <div className="h-4 w-1/2 bg-muted animate-pulse rounded-md" />
          </div>
          
          {/* Tags */}
          <div className="flex gap-2 flex-wrap">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-6 w-16 bg-muted animate-pulse rounded-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default card variant
  return (
    <div 
      className={cn(baseClasses, "p-4", className)}
      aria-busy="true"
      role="status"
      aria-label="Loading card content"
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-muted animate-pulse rounded-full" />
          <div className="flex-1 space-y-1">
            <div className="h-4 w-28 bg-muted animate-pulse rounded-md" />
            <div className="h-3 w-20 bg-muted animate-pulse rounded-md" />
          </div>
        </div>
        
        {/* Content */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted animate-pulse rounded-md" />
          <div className="h-4 w-2/3 bg-muted animate-pulse rounded-md" />
        </div>
        
        {/* Footer */}
        <div className="flex justify-between items-center">
          <div className="h-6 w-12 bg-muted animate-pulse rounded-full" />
          <div className="h-4 w-16 bg-muted animate-pulse rounded-md" />
        </div>
      </div>
    </div>
  );
}
