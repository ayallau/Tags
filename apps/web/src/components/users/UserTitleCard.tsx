/**
 * UserTitleCard Component
 * Compact horizontal card for displaying user info in grids
 * Used in Home/Discover pages
 */

import { Heart, Coffee, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { TagPill } from '../tags/TagPill';
import { useAddBookmark } from '../../shared/hooks/useBookmarks';
import { useAddFriend } from '../../shared/hooks/useFriends';
import { useState } from 'react';
import type { UserPreview } from '../../shared/types/user';
import type { RecentUser } from '../../shared/hooks/useRecentUsers';

interface UserTitleCardProps {
  user: UserPreview | RecentUser;
  className?: string;
}

// Helper function to calculate age from date of birth
function calculateAge(dateOfBirth?: string): number | null {
  if (!dateOfBirth) return null;
  try {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  } catch {
    return null;
  }
}

// Helper function to get gender icon or avatar
function getGenderAvatar(gender?: string) {
  switch (gender?.toLowerCase()) {
    case 'male':
      return '👦🏻';
    case 'female':
      return '👧🏻';
    case 'other':
      return '👤';
    default:
      return '👤';
  }
}

export function UserTitleCard({ user, className = '' }: UserTitleCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const addBookmarkMutation = useAddBookmark();
  const addFriendMutation = useAddFriend();

  const age = calculateAge('dateOfBirth' in user ? user.dateOfBirth : undefined);

  const handleAddMatch = () => {
    addBookmarkMutation.mutate(
      { targetUserId: user._id },
      {
        onSuccess: () => {
          setIsBookmarked(true);
        },
      }
    );
  };

  const handleAddFriend = () => {
    addFriendMutation.mutate(user._id);
  };

  const handleChat = () => {
    // Navigate to chat will be handled by the Link
    // This is just a placeholder for any additional logic
  };

  return (
    <div
      className={`border border-border rounded-lg bg-card hover:shadow-lg transition-all overflow-hidden ${className}`}
    >
      {/* Avatar Section - Full width image */}
      <div className='px-2 pt-2'>
        <div className='relative w-full h-48 overflow-hidden rounded-lg'>
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.username} className='w-full h-full object-cover' loading='lazy' />
          ) : (
            <div className='w-full h-full bg-muted flex items-center justify-center'>
              <span className='text-6xl'>{'gender' in user ? getGenderAvatar(user.gender) : getGenderAvatar()}</span>
            </div>
          )}
          {user.isOnline && (
            <div className='absolute top-2 right-2 h-3 w-3 bg-green-500 rounded-full border-2 border-background' />
          )}
        </div>
      </div>

      <div className='p-4 space-y-3'>
        {/* User Information */}
        <div className='space-y-1'>
          {/* Name */}
          <h3 className='font-semibold text-base text-foreground' title={user.username}>
            {user.username || 'Anonymous'}
          </h3>

          {/* Age, Gender */}
          {'gender' in user && user.gender && age !== null && (
            <div className='flex items-center gap-2'>
              <span className='text-sm text-muted-foreground'>
                {age} {user.gender}
              </span>
            </div>
          )}

          {/* Profession */}
          {'profession' in user && user.profession && (
            <p className='text-sm text-foreground font-medium'>{user.profession}</p>
          )}

          {/* Title/Headline */}
          {/* {'title' in user && user.title && <p className='text-xs text-muted-foreground line-clamp-2'>{user.title}</p>} */}
        </div>

        {/* Tags */}
        {'tags' in user && user.tags && user.tags.length > 0 && (
          <div className='flex flex-wrap gap-1 pt-2'>
            {user.tags.slice(0, 3).map(tag => (
              <TagPill
                key={tag._id}
                tag={{ _id: tag._id, slug: tag.slug, label: tag.label, createdAt: '', updatedAt: '' }}
                state='existing'
                className='text-xs px-2 py-0.5'
              />
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className='flex gap-1 justify-between pt-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={e => {
              e.preventDefault();
              handleAddMatch();
            }}
            disabled={isBookmarked || addBookmarkMutation.isPending}
            className='flex-1'
            aria-label='Add to matches'
          >
            <Heart className='h-4 w-4' />
          </Button>

          <Button
            variant='outline'
            size='sm'
            onClick={e => {
              e.preventDefault();
              handleAddFriend();
            }}
            disabled={addFriendMutation.isPending}
            className='flex-1'
            aria-label='Connect'
          >
            <Coffee className='h-4 w-4' />
          </Button>

          <Link to={`/chat/${user._id}`} className='flex-1'>
            <Button variant='outline' size='sm' className='w-full' onClick={handleChat} aria-label='Start conversation'>
              <MessageCircle className='h-4 w-6' />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
