/**
 * UserTitleCard Component
 * Compact horizontal card for displaying user info in grids
 * Used in Home/Discover pages
 */

import { Heart, UserPlus, MessageCircle } from 'lucide-react';
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
      return '👨';
    case 'female':
      return '👩';
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
    <div className={`border border-border rounded-lg bg-card hover:shadow-lg transition-all ${className}`}>
      <div className='p-4 space-y-3'>
        {/* Header with avatar and basic info */}
        <div className='flex items-start gap-3'>
          <div className='relative flex-shrink-0'>
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.username}
                className='h-16 w-16 rounded-full object-cover border-2 border-border'
                loading='lazy'
              />
            ) : (
              <div className='h-16 w-16 rounded-full bg-muted flex items-center justify-center border-2 border-border'>
                <span className='text-2xl'>{'gender' in user ? getGenderAvatar(user.gender) : getGenderAvatar()}</span>
              </div>
            )}
            {user.isOnline && (
              <div className='absolute bottom-1 right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-background' />
            )}
          </div>

          <div className='flex-1 min-w-0'>
            <h3 className='font-semibold text-base text-foreground truncate' title={user.username}>
              {user.username || 'Anonymous'}
            </h3>
            <div className='flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground'>
              {'gender' in user && user.gender && <span>{user.gender}</span>}
              {age !== null && <span>• Age {age}</span>}
            </div>
            {'profession' in user && user.profession && (
              <p className='text-sm text-foreground font-medium mt-0.5'>{user.profession}</p>
            )}
            {'title' in user && user.title && <p className='text-xs text-muted-foreground truncate'>{user.title}</p>}
          </div>
        </div>

        {/* Action buttons */}
        <div className='flex gap-1 justify-between'>
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
            aria-label='Add friend'
          >
            <UserPlus className='h-4 w-4' />
          </Button>

          <Link to={`/chat/${user._id}`} className='flex-1'>
            <Button variant='outline' size='sm' className='w-full' onClick={handleChat} aria-label='Start conversation'>
              <MessageCircle className='h-4 w-4' />
            </Button>
          </Link>
        </div>

        {/* Tags */}
        {'tags' in user && user.tags && user.tags.length > 0 && (
          <div className='flex flex-wrap gap-1'>
            {user.tags.slice(0, 3).map(tag => (
              <TagPill
                key={tag._id}
                tag={{ _id: tag._id, slug: tag.slug, label: tag.label, createdAt: '', updatedAt: '' }}
                state='existing'
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
