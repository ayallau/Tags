/**
 * BlockedList Component
 * Displays blocked users with infinite scroll
 */

import { EmptyState } from '../../components/data/EmptyState';
import { SettingsUserList } from './SettingsUserList';
import { useBlockedList, useUnblockUser } from '../../shared/hooks/useSettings';
import { UserX, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';

export function BlockedList() {
  const [removingUserId, setRemovingUserId] = useState<string | undefined>();

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useBlockedList({ limit: 24 });

  const unblockMutation = useUnblockUser();

  const users = data?.pages.flatMap(page => page.users) || [];

  const handleUnblock = async (userId: string) => {
    setRemovingUserId(userId);
    try {
      await unblockMutation.mutateAsync(userId);
    } finally {
      setRemovingUserId(undefined);
    }
  };

  const handleLoadMore = async () => {
    if (hasNextPage && !isFetchingNextPage) {
      await fetchNextPage();
    }
  };

  if (isLoading) {
    return (
      <div className='space-y-3'>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className='border border-border rounded-lg p-4 bg-surface animate-pulse'>
            <div className='flex items-center gap-3'>
              <div className='h-10 w-10 rounded-full bg-muted' />
              <div className='flex-1 space-y-2'>
                <div className='h-4 w-32 bg-muted rounded' />
                <div className='h-3 w-24 bg-muted rounded' />
              </div>
              <div className='h-8 w-8 bg-muted rounded' />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center py-12'>
        <p className='text-red-600 dark:text-red-400'>Error loading blocked users: {error.message}</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <EmptyState
        icon={<UserX className='h-12 w-12 text-muted-foreground' />}
        title='No blocked users'
        description='Users you block will appear here'
      />
    );
  }

  return (
    <div className='space-y-6'>
      <SettingsUserList users={users} onRemove={handleUnblock} isRemoving={removingUserId} type='blocked' />
      {hasNextPage && (
        <div className='text-center'>
          <Button onClick={handleLoadMore} disabled={isFetchingNextPage} variant='outline' className='min-w-32'>
            {isFetchingNextPage ? (
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
    </div>
  );
}
