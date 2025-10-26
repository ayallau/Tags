/**
 * UsersList Component
 * Displays a list of users with grid/list layout
 */

import { Users, Loader2 } from 'lucide-react';
import { UserCard } from './UserCard';
import { TileSkeleton } from '../skeletons/TileSkeleton';
import { EmptyState } from '../data';
import { Button } from '../ui/button';
import type { UserPreview } from '../../shared/types/user';
import { cn } from '../../shared/lib/utils';

interface UsersListProps {
  users: UserPreview[];
  isLoading?: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  error?: Error | null;
  className?: string;
  viewMode?: 'grid' | 'list';
}

export function UsersList({
  users,
  isLoading = false,
  isLoadingMore = false,
  hasMore = false,
  onLoadMore,
  error = null,
  className = '',
  viewMode = 'grid',
}: UsersListProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          'grid gap-4',
          viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1',
          className
        )}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <TileSkeleton key={i} variant='card' />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center py-12'>
        <p className='text-red-600 dark:text-red-400'>Error loading users: {error.message}</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <EmptyState
        icon={<Users className='h-12 w-12 text-muted-foreground' />}
        title='No users found'
        description='Try adjusting your filters or tags'
      />
    );
  }

  return (
    <div className={className}>
      <div
        className={cn('grid gap-4', viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1')}
      >
        {users.map(user => (
          <UserCard key={user._id} user={user} />
        ))}
      </div>

      {/* Load More button */}
      {hasMore && (
        <div className='mt-6 text-center'>
          <Button onClick={onLoadMore} disabled={isLoadingMore} variant='outline' className='min-w-32'>
            {isLoadingMore ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}

      {!hasMore && users.length > 0 && (
        <div className='mt-6 text-center text-sm text-muted-foreground'>No more users to load</div>
      )}
    </div>
  );
}
