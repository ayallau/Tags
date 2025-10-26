/**
 * SettingsUserList Component
 * Displays a list of blocked or hidden users
 */

import { User as UserIcon, X } from 'lucide-react';
import { Button } from '../ui/button';
import type { SettingsUser } from '../../shared/hooks/useSettings';

interface SettingsUserListProps {
  users: SettingsUser[];
  onRemove: (userId: string) => void;
  isRemoving?: string | undefined;
  type: 'blocked' | 'hidden';
}

export function SettingsUserList({ users, onRemove, isRemoving, type }: SettingsUserListProps) {
  if (users.length === 0) {
    return (
      <div className='text-center py-8'>
        <UserIcon className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
        <p className='text-muted-foreground'>No {type} users yet</p>
      </div>
    );
  }

  return (
    <div className='space-y-3'>
      {users.map(user => (
        <div
          key={user._id}
          className='flex items-center justify-between p-4 border border-border rounded-lg bg-surface hover:bg-muted/5 transition-colors'
        >
          <div className='flex items-center gap-3 flex-1 min-w-0'>
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.username}
                className='h-10 w-10 rounded-full object-cover flex-shrink-0'
              />
            ) : (
              <div className='h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0'>
                <UserIcon className='h-6 w-6 text-muted-foreground' />
              </div>
            )}
            <div className='flex-1 min-w-0'>
              <h3 className='font-semibold text-foreground truncate' title={user.username}>
                {user.username}
              </h3>
              {user.lastVisitAt && !user.isOnline && (
                <p className='text-xs text-muted-foreground'>
                  Last seen: {new Date(user.lastVisitAt).toLocaleDateString()}
                </p>
              )}
              {user.isOnline && (
                <div className='flex items-center gap-1 mt-1'>
                  <div className='h-2 w-2 bg-green-500 rounded-full' />
                  <span className='text-xs text-green-600 dark:text-green-400'>Online</span>
                </div>
              )}
            </div>
          </div>
          <Button
            variant='outline'
            size='sm'
            onClick={() => onRemove(user._id)}
            disabled={isRemoving === user._id}
            className='flex-shrink-0'
            aria-label={`Remove ${type} user`}
          >
            <X className='h-4 w-4' />
          </Button>
        </div>
      ))}
    </div>
  );
}
