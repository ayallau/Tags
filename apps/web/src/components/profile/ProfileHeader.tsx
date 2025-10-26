/**
 * ProfileHeader Component
 * Displays user avatar, name, bio, location, and edit button
 */

import { Edit } from 'lucide-react';
import { Button } from '../ui/button';
import type { User } from '../../shared/hooks/useUser';

interface ProfileHeaderProps {
  user: User;
  onEdit?: () => void;
  className?: string;
}

export function ProfileHeader({ user, onEdit, className = '' }: ProfileHeaderProps) {
  return (
    <div className={`bg-surface border border-border rounded-lg p-6 ${className}`}>
      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-6'>
        {/* Avatar */}
        <div className='relative'>
          <img
            src={user.avatarUrl || '/default-avatar.png'}
            alt={user.username || 'User'}
            className='h-24 w-24 rounded-full object-cover border-2 border-border'
            loading='lazy'
          />
          {user.isOnline && (
            <div className='absolute bottom-0 right-0 h-4 w-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full' />
          )}
        </div>

        {/* User Info */}
        <div className='flex-1 space-y-2'>
          <div className='flex items-center gap-3'>
            <h1 className='text-2xl font-bold text-foreground'>{user.username || 'User'}</h1>
            {user.email && <span className='text-sm text-muted-foreground'>{user.email}</span>}
          </div>

          {user.bio && <p className='text-muted-foreground max-w-2xl'>{user.bio}</p>}

          <div className='flex flex-wrap items-center gap-4 text-sm text-muted-foreground'>
            {user.location && <span className='flex items-center gap-1'>📍 {user.location}</span>}
            {user.createdAt && (
              <span className='flex items-center gap-1'>
                ✨ Joined {new Date(user.createdAt).toLocaleDateString('he-IL')}
              </span>
            )}
          </div>
        </div>

        {/* Edit Button */}
        {onEdit && (
          <Button onClick={onEdit} variant='outline' className='flex items-center gap-2' aria-label='Edit profile'>
            <Edit className='h-4 w-4' />
            <span>Edit Profile</span>
          </Button>
        )}
      </div>
    </div>
  );
}
