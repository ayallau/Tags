/**
 * UserCard Component
 * Displays a single user's preview in Discover/Matches lists
 */

import { User as UserIcon } from 'lucide-react';
import { TagPill } from '../tags/TagPill';
import type { UserPreview } from '../../shared/types/user';

interface UserCardProps {
  user: UserPreview;
  className?: string;
}

export function UserCard({ user, className = '' }: UserCardProps) {
  return (
    <div className={`border border-border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow ${className}`}>
      {/* Header with avatar and online status */}
      <div className='flex items-center gap-3'>
        <div className='relative'>
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.username} className='h-10 w-10 rounded-full object-cover' />
          ) : (
            <div className='h-10 w-10 rounded-full bg-muted flex items-center justify-center'>
              <UserIcon className='h-6 w-6 text-muted-foreground' />
            </div>
          )}
          {user.isOnline && (
            <div className='absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background' />
          )}
        </div>
        <div className='flex-1 min-w-0'>
          <h3 className='font-semibold text-foreground truncate' title={user.username}>
            {user.username}
          </h3>
          {user.lastVisitAt && !user.isOnline && (
            <p className='text-xs text-muted-foreground'>
              Last seen: {new Date(user.lastVisitAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Tags */}
      {user.tags.length > 0 && (
        <div className='flex flex-wrap gap-1'>
          {user.tags.slice(0, 5).map(tag => (
            <TagPill
              key={tag._id}
              tag={{ _id: tag._id, slug: tag.slug, label: tag.label, createdAt: '', updatedAt: '' }}
              state='existing'
            />
          ))}
          {user.tags.length > 5 && (
            <span className='text-xs text-muted-foreground px-2 py-1'>+{user.tags.length - 5}</span>
          )}
        </div>
      )}
    </div>
  );
}
