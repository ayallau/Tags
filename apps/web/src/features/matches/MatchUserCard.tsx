/**
 * MatchUserCard Component
 * Displays a match with score, shared tags, and quick actions
 */

import { User as UserIcon, Bookmark, MessageCircle, EyeOff, Ban } from 'lucide-react';
import { TagPill } from '../../components/tags/TagPill';
import { Button } from '../../components/ui/button';
import type { Match } from '../../shared/hooks/useMatchesQuery';

interface MatchUserCardProps {
  match: Match;
  onBookmark?: (userId: string) => void;
  onMessage?: (userId: string) => void;
  onHide?: (userId: string) => void;
  onBlock?: (userId: string) => void;
  className?: string;
}

export function MatchUserCard({ match, onBookmark, onMessage, onHide, onBlock, className = '' }: MatchUserCardProps) {
  const { targetUser, score, sharedTagsCount } = match;

  return (
    <div
      className={`border border-border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow bg-surface ${className}`}
    >
      {/* Header with avatar, name, and score */}
      <div className='flex items-start justify-between gap-3'>
        <div className='flex items-center gap-3 flex-1 min-w-0'>
          <div className='relative flex-shrink-0'>
            {targetUser.avatarUrl ? (
              <img
                src={targetUser.avatarUrl}
                alt={targetUser.username || 'User'}
                className='h-12 w-12 rounded-full object-cover'
              />
            ) : (
              <div className='h-12 w-12 rounded-full bg-muted flex items-center justify-center'>
                <UserIcon className='h-6 w-6 text-muted-foreground' />
              </div>
            )}
            {targetUser.isOnline && (
              <div className='absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background' />
            )}
          </div>
          <div className='flex-1 min-w-0'>
            <h3 className='font-semibold text-foreground truncate' title={targetUser.username}>
              {targetUser.username || 'Unknown User'}
            </h3>
            {targetUser.lastVisitAt && !targetUser.isOnline && (
              <p className='text-xs text-muted-foreground'>
                Last seen: {new Date(targetUser.lastVisitAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Score Display */}
        <div className='text-right flex-shrink-0'>
          <div className='text-2xl font-bold text-primary'>{score}%</div>
          <div className='text-xs text-muted-foreground'>
            {sharedTagsCount} shared {sharedTagsCount === 1 ? 'tag' : 'tags'}
          </div>
        </div>
      </div>

      {/* Shared Tags */}
      {targetUser.tags && targetUser.tags.length > 0 && (
        <div className='flex flex-wrap gap-1'>
          {targetUser.tags.slice(0, 5).map(tag => (
            <TagPill
              key={tag._id}
              tag={{ _id: tag._id, slug: tag.slug, label: tag.label, createdAt: '', updatedAt: '' }}
              state='existing'
            />
          ))}
          {targetUser.tags.length > 5 && (
            <span className='text-xs text-muted-foreground px-2 py-1'>+{targetUser.tags.length - 5}</span>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className='flex gap-2 pt-2 border-t border-border'>
        {onBookmark && (
          <Button
            variant='outline'
            size='sm'
            onClick={() => onBookmark(targetUser._id)}
            className='flex-1'
            aria-label='Bookmark user'
          >
            <Bookmark className='h-4 w-4 mr-1' />
            Save
          </Button>
        )}
        {onMessage && (
          <Button
            variant='outline'
            size='sm'
            onClick={() => onMessage(targetUser._id)}
            className='flex-1'
            aria-label='Send message'
          >
            <MessageCircle className='h-4 w-4 mr-1' />
            Message
          </Button>
        )}
        {onHide && (
          <Button variant='ghost' size='sm' onClick={() => onHide(targetUser._id)} aria-label='Hide user'>
            <EyeOff className='h-4 w-4' />
          </Button>
        )}
        {onBlock && (
          <Button variant='ghost' size='sm' onClick={() => onBlock(targetUser._id)} aria-label='Block user'>
            <Ban className='h-4 w-4' />
          </Button>
        )}
      </div>
    </div>
  );
}
