/**
 * Friends Page
 * Displays list of all friends with visibility toggle
 */

import { Users as UsersIcon, X } from 'lucide-react';
import { useFriendsQuery, useUpdateFriendVisibility, useRemoveFriend } from '../shared/hooks/useFriends';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { useCallback, useState } from 'react';
import { Skeleton } from '../components/ui/skeleton';
import { EmptyState } from '../components/data';

export default function FriendsPage() {
  const [removedFriends, setRemovedFriends] = useState<Set<string>>(new Set());

  const friendsQuery = useFriendsQuery({ limit: 24 });
  const updateVisibilityMutation = useUpdateFriendVisibility();
  const removeFriendMutation = useRemoveFriend();

  const handleToggleVisibility = useCallback(
    async (friendId: string, currentValue: boolean) => {
      try {
        await updateVisibilityMutation.mutateAsync({
          id: friendId,
          data: { canNotify: !currentValue },
        });
      } catch (error) {
        console.error('Failed to update visibility:', error);
      }
    },
    [updateVisibilityMutation]
  );

  const handleRemoveFriend = useCallback(
    async (friendId: string) => {
      if (removedFriends.has(friendId)) return;

      setRemovedFriends(prev => new Set(prev).add(friendId));

      try {
        await removeFriendMutation.mutateAsync(friendId);
      } catch (error) {
        console.error('Failed to remove friend:', error);
        setRemovedFriends(prev => {
          const next = new Set(prev);
          next.delete(friendId);
          return next;
        });
      }
    },
    [removeFriendMutation, removedFriends]
  );

  const allFriends = friendsQuery.data?.pages.flatMap(page => page.friends) ?? [];

  if (friendsQuery.isLoading && !friendsQuery.data) {
    return (
      <div className='space-y-6'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-foreground mb-4'>Friends</h1>
          <p className='text-muted-foreground'>Your connections</p>
        </div>

        <div className='space-y-4'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className='bg-surface border border-border rounded-lg p-4'>
              <div className='flex items-center gap-4'>
                <Skeleton className='h-12 w-12 rounded-full' />
                <div className='flex-1 space-y-2'>
                  <Skeleton className='h-4 w-28' />
                  <Skeleton className='h-3 w-20' />
                </div>
                <div className='flex gap-2'>
                  <Skeleton className='h-8 w-16' />
                  <Skeleton className='h-8 w-8 rounded-md' />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!allFriends.length && !friendsQuery.isFetchingNextPage) {
    return (
      <div className='space-y-6'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-foreground mb-4'>Friends</h1>
          <p className='text-muted-foreground'>Your connections</p>
        </div>

        <EmptyState
          icon={<UsersIcon className='h-12 w-12' />}
          title='No friends yet'
          description='Start building your network by adding people as friends from their profile cards.'
        />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-foreground mb-4'>Friends</h1>
        <p className='text-muted-foreground'>
          {allFriends.length} {allFriends.length === 1 ? 'friend' : 'friends'}
        </p>
      </div>

      <div className='space-y-3'>
        {allFriends
          .filter(friend => !removedFriends.has(friend._id))
          .map(friend => (
            <div
              key={friend._id}
              className='bg-surface border border-border rounded-lg p-4 hover:shadow-md transition-shadow'
            >
              <div className='flex items-center gap-4'>
                {/* Avatar */}
                <div className='relative'>
                  {friend.friendUser.avatarUrl ? (
                    <img
                      src={friend.friendUser.avatarUrl}
                      alt={friend.friendUser.username}
                      className='h-12 w-12 rounded-full object-cover'
                    />
                  ) : (
                    <div className='h-12 w-12 rounded-full bg-muted flex items-center justify-center'>
                      <UsersIcon className='h-6 w-6 text-muted-foreground' />
                    </div>
                  )}
                  {friend.friendUser.isOnline && (
                    <div className='absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background' />
                  )}
                </div>

                {/* Name and status */}
                <div className='flex-1 min-w-0'>
                  <h3 className='font-semibold text-foreground truncate' title={friend.friendUser.username}>
                    {friend.friendUser.username}
                  </h3>
                  {friend.friendUser.lastVisitAt && !friend.friendUser.isOnline && (
                    <p className='text-xs text-muted-foreground'>
                      Last seen: {new Date(friend.friendUser.lastVisitAt).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className='flex items-center gap-3 flex-shrink-0'>
                  {/* Visibility Toggle */}
                  <div className='flex items-center gap-2'>
                    <label
                      htmlFor={`visibility-${friend._id}`}
                      className='text-sm text-muted-foreground cursor-pointer whitespace-nowrap'
                    >
                      Let them know
                    </label>
                    <Switch
                      id={`visibility-${friend._id}`}
                      checked={friend.canNotify}
                      onCheckedChange={() => handleToggleVisibility(friend._id, friend.canNotify)}
                      disabled={updateVisibilityMutation.isPending}
                      aria-label={`Allow ${friend.friendUser.username} to know you added them`}
                    />
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => handleRemoveFriend(friend._id)}
                    disabled={removeFriendMutation.isPending}
                    className='flex-shrink-0 text-destructive hover:text-destructive'
                    aria-label={`Remove ${friend.friendUser.username} from friends`}
                  >
                    <X className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </div>
          ))}

        {friendsQuery.isFetchingNextPage && (
          <div className='space-y-3'>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className='bg-surface border border-border rounded-lg p-4'>
                <div className='flex items-center gap-4'>
                  <Skeleton className='h-12 w-12 rounded-full' />
                  <div className='flex-1 space-y-2'>
                    <Skeleton className='h-4 w-28' />
                    <Skeleton className='h-3 w-20' />
                  </div>
                  <Skeleton className='h-8 w-16' />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Load More Button */}
      {friendsQuery.hasNextPage && (
        <div className='flex justify-center mt-6'>
          <Button
            onClick={() => {
              if (friendsQuery.hasNextPage && !friendsQuery.isFetchingNextPage) {
                friendsQuery.fetchNextPage();
              }
            }}
            disabled={friendsQuery.isFetchingNextPage}
            variant='outline'
          >
            {friendsQuery.isFetchingNextPage ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  );
}
