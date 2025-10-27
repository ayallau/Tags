/**
 * UserCard Component
 * Displays a single user's preview in Discover/Matches lists
 */

import { Bookmark, UserPlus, UserMinus, Shield, EyeOff, AlertTriangle, MessageCircle } from 'lucide-react';
import { TagPill } from '../tags/TagPill';
import { Button } from '../ui/button';
import { useAddBookmark } from '../../shared/hooks/useBookmarks';
import { useAddFriend, useRemoveFriend, useCheckFriend } from '../../shared/hooks/useFriends';
import { useBlockUser, useHideUser } from '../../shared/hooks/useSettings';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { UserPreview } from '../../shared/types/user';

// Helper function to calculate age from date of birth
function calculateAge(dateOfBirth?: string): number | null {
  if (!dateOfBirth) return null;
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// Helper function to get gender avatar
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

interface UserCardProps {
  user: UserPreview;
  className?: string;
  showBookmarkButton?: boolean;
  showFriendButton?: boolean;
  showBlockButton?: boolean;
  showHideButton?: boolean;
}

export function UserCard({
  user,
  className = '',
  showBookmarkButton = false,
  showFriendButton = false,
  showBlockButton = false,
  showHideButton = false,
}: UserCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isFriended, setIsFriended] = useState(false);
  const [isCheckingFriend, setIsCheckingFriend] = useState(true);

  const addBookmarkMutation = useAddBookmark();
  const addFriendMutation = useAddFriend();
  const removeFriendMutation = useRemoveFriend();
  const blockUserMutation = useBlockUser();
  const hideUserMutation = useHideUser();

  // Check if user is friended
  const { data: friendCheckData } = useCheckFriend(showFriendButton ? user._id : undefined);

  useEffect(() => {
    if (showFriendButton && friendCheckData?.pages?.[0]?.hasFriended !== undefined) {
      setIsFriended(friendCheckData.pages[0].hasFriended);
      setIsCheckingFriend(false);
    }
  }, [showFriendButton, friendCheckData, user._id]);

  // Check if user is bookmarked
  useEffect(() => {
    if (showBookmarkButton) {
      // TODO: Implement check bookmark query when ready
      setIsChecking(false);
    }
  }, [showBookmarkButton, user._id]);

  const handleBookmark = () => {
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
    addFriendMutation.mutate(user._id, {
      onSuccess: () => {
        setIsFriended(true);
      },
    });
  };

  const handleRemoveFriend = () => {
    // Since we don't have the friend record ID yet, we'll use the targetUserId
    // The service will handle finding the correct friend record
    removeFriendMutation.mutate(user._id, {
      onSuccess: () => {
        setIsFriended(false);
      },
    });
  };

  const handleToggleFriend = () => {
    if (isFriended) {
      handleRemoveFriend();
    } else {
      handleAddFriend();
    }
  };

  const handleBlock = () => {
    if (window.confirm(`Are you sure you want to block ${user.username}?`)) {
      blockUserMutation.mutate(user._id);
    }
  };

  const handleHide = () => {
    if (window.confirm(`Are you sure you want to hide ${user.username}?`)) {
      hideUserMutation.mutate(user._id);
    }
  };

  const handleReport = () => {
    if (window.confirm(`Are you sure you want to report ${user.username}?`)) {
      // TODO: Implement report functionality
      // eslint-disable-next-line no-console
      console.log('Report user:', user._id);
    }
  };

  const age = calculateAge(user.dateOfBirth);

  return (
    <div
      className={`border border-border rounded-lg p-4 space-y-4 hover:shadow-lg transition-all bg-card ${className}`}
    >
      {/* Header with avatar and basic info */}
      <div className='flex items-start gap-3'>
        <div className='relative flex-shrink-0'>
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.username}
              className='h-20 w-20 rounded-full object-cover border-2 border-border'
              loading='lazy'
            />
          ) : (
            <div className='h-20 w-20 rounded-full bg-muted flex items-center justify-center border-2 border-border'>
              <span className='text-3xl'>{getGenderAvatar(user.gender)}</span>
            </div>
          )}
          {user.isOnline && (
            <div className='absolute bottom-1 right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-background' />
          )}
        </div>

        <div className='flex-1 min-w-0'>
          <h3 className='font-semibold text-lg text-foreground truncate' title={user.username}>
            {user.username}
          </h3>
          <div className='flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-muted-foreground'>
            {user.gender && <span>{user.gender}</span>}
            {age !== null && <span>• Age {age}</span>}
            {user.location && <span>• {user.location}</span>}
          </div>
          {user.profession && <p className='text-sm font-medium text-foreground mt-1'>{user.profession}</p>}
          {user.title && <p className='text-sm text-muted-foreground truncate'>{user.title}</p>}
        </div>

        {/* Action buttons in header */}
        <div className='flex gap-1 flex-shrink-0'>
          {showBookmarkButton && (
            <Button
              variant='ghost'
              size='sm'
              onClick={handleBookmark}
              disabled={isBookmarked || addBookmarkMutation.isPending || isChecking}
              className='flex-shrink-0'
              aria-label={isBookmarked ? 'Bookmarked' : 'Bookmark user'}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>
          )}
          {showFriendButton && (
            <Button
              variant='ghost'
              size='sm'
              onClick={handleToggleFriend}
              disabled={addFriendMutation.isPending || removeFriendMutation.isPending || isCheckingFriend}
              className='flex-shrink-0'
              aria-label={isFriended ? 'Remove friend' : 'Add friend'}
            >
              {isFriended ? <UserMinus className='h-4 w-4 text-destructive' /> : <UserPlus className='h-4 w-4' />}
            </Button>
          )}
        </div>
      </div>

      {/* Bio */}
      {user.bio && (
        <div className='border-t border-border pt-3'>
          <p className='text-sm text-muted-foreground line-clamp-3'>{user.bio}</p>
        </div>
      )}

      {/* Actions and links */}
      <div className='flex items-center justify-between pt-2 border-t border-border'>
        <div className='flex gap-2'>
          <Link to={`/chat/${user._id}`}>
            <Button variant='outline' size='sm' aria-label='Start conversation'>
              <MessageCircle className='h-4 w-4 mr-1' />
              Message
            </Button>
          </Link>
        </div>
        <div className='flex gap-1'>
          {(showBlockButton || showHideButton) && (
            <>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleReport}
                className='text-muted-foreground hover:text-foreground'
                aria-label='Report user'
              >
                <AlertTriangle className='h-4 w-4' />
              </Button>
              {showHideButton && (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={handleHide}
                  disabled={hideUserMutation.isPending}
                  className='text-muted-foreground hover:text-foreground'
                  aria-label='Hide user'
                >
                  <EyeOff className='h-4 w-4' />
                </Button>
              )}
              {showBlockButton && (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={handleBlock}
                  disabled={blockUserMutation.isPending}
                  className='text-muted-foreground hover:text-destructive'
                  aria-label='Block user'
                >
                  <Shield className='h-4 w-4' />
                </Button>
              )}
            </>
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
