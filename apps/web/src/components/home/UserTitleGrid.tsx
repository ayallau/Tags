/**
 * UserTitleGrid Component
 * Displays recent users in a compact grid layout with infinite scroll
 */

import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDiscoverUsers } from '../../shared/hooks/useDiscoverUsers';
import { useRecentUsers, type RecentUser } from '../../shared/hooks/useRecentUsers';
import { EmptyState } from '../data/EmptyState';
import { User as UserIcon } from 'lucide-react';
import { TileSkeleton } from '../skeletons';
import type { UserPreview } from '../../shared/types/user';

interface UserTitleGridProps {
  className?: string;
  selectedTagId?: string | undefined;
}

function UserTitleCard({ user }: { user: RecentUser | UserPreview }) {
  return (
    <Link
      to={`/profile/${user._id}`}
      className='group relative block p-3 border border-border rounded-lg hover:shadow-md transition-all hover:scale-105 bg-card'
    >
      <div className='flex items-center gap-3'>
        <div className='relative flex-shrink-0'>
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.username}
              className='h-12 w-12 rounded-full object-cover border-2 border-background'
              loading='lazy'
            />
          ) : (
            <div className='h-12 w-12 rounded-full bg-muted flex items-center justify-center border-2 border-background'>
              <UserIcon className='h-6 w-6 text-muted-foreground' />
            </div>
          )}
          {user.isOnline && (
            <div className='absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background' />
          )}
        </div>
        <div className='flex-1 min-w-0'>
          <h3 className='font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors'>
            {user.username || 'Anonymous'}
          </h3>
          <p className='text-xs text-muted-foreground'>
            {user.isOnline
              ? 'Online now'
              : user.lastVisitAt
                ? `Active ${new Date(user.lastVisitAt).toLocaleDateString()}`
                : 'Recently joined'}
          </p>
        </div>
      </div>
    </Link>
  );
}

export function UserTitleGrid({ className = '', selectedTagId }: UserTitleGridProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Use discover users if a tag is selected, otherwise use recent users
  const discoverQuery = useDiscoverUsers({
    tags: selectedTagId,
    limit: 24,
  });

  const recentQuery = useRecentUsers({ limit: 24 });

  // Select which query to use based on whether a tag is selected
  const activeQuery = selectedTagId ? discoverQuery : recentQuery;
  const { data, isLoading, error, hasNextPage, isFetchingNextPage, fetchNextPage } = activeQuery;

  // Flatten all users from pages, filter out invalid entries, and limit to 100
  const totalCap = 100;
  const allUsers: (RecentUser | UserPreview)[] =
    data?.pages
      .flatMap((page: { users?: (RecentUser | UserPreview)[] }) => page.users || [])
      .filter((user: RecentUser | UserPreview | null | undefined): user is RecentUser | UserPreview =>
        Boolean(user && user._id)
      )
      .slice(0, totalCap) || [];

  // Infinite scroll observer
  useEffect(() => {
    if (typeof window === 'undefined' || !window.IntersectionObserver) return;

    const ObserverConstructor = window.IntersectionObserver;
    const observer = new ObserverConstructor(
      (entries: IntersectionObserverEntry[]) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (error) {
    return (
      <div className='p-4 text-red-600 dark:text-red-400'>
        Error loading recent users: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  if (isLoading && !allUsers.length) {
    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'>
        {Array.from({ length: 12 }).map((_, i) => (
          <TileSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!allUsers.length && !isLoading) {
    const title = selectedTagId ? 'No Users Found' : 'No Recent Users';
    const description = selectedTagId
      ? 'There are no users with this tag. Try selecting a different tag.'
      : 'There are no active users at the moment. Check back later!';

    return <EmptyState title={title} description={description} />;
  }

  return (
    <div className={className}>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'>
        {allUsers.map(user => (
          <UserTitleCard key={user._id} user={user} />
        ))}
      </div>

      {/* Loading more indicator */}
      {(isFetchingNextPage || isLoading) && (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-3'>
          {Array.from({ length: 4 }).map((_, i) => (
            <TileSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      )}

      {/* Intersection observer target */}
      <div ref={loadMoreRef} className='h-4' />
    </div>
  );
}
