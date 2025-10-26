/**
 * BookmarkUserCard Component
 * Displays a bookmarked user with remark editing and delete
 */

import { User as UserIcon, Trash2, Edit3 } from 'lucide-react';
import { TagPill } from '../../components/tags/TagPill';
import { Button } from '../../components/ui/button';
import { useUpdateBookmark } from '../../shared/hooks/useBookmarks';
import { useState } from 'react';
import type { Bookmark } from '../../shared/hooks/useBookmarks';

interface BookmarkUserCardProps {
  bookmark: Bookmark;
  onDelete?: ((bookmarkId: string) => void) | undefined;
  className?: string;
}

export function BookmarkUserCard({ bookmark, onDelete, className = '' }: BookmarkUserCardProps) {
  const [isEditingRemark, setIsEditingRemark] = useState(false);
  const [remarkText, setRemarkText] = useState(bookmark.remark || '');
  const updateBookmarkMutation = useUpdateBookmark();

  const { targetUser, remark } = bookmark;

  const handleSaveRemark = () => {
    updateBookmarkMutation.mutate(
      { id: bookmark._id, data: { remark: remarkText } },
      {
        onSuccess: () => {
          setIsEditingRemark(false);
        },
      }
    );
  };

  const handleCancel = () => {
    setRemarkText(remark || '');
    setIsEditingRemark(false);
  };

  return (
    <div
      className={`border border-border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow bg-surface ${className}`}
    >
      {/* Header with avatar and name */}
      <div className='flex items-start justify-between gap-3'>
        <div className='flex items-center gap-3 flex-1 min-w-0'>
          <div className='relative flex-shrink-0'>
            {targetUser.avatarUrl ? (
              <img
                src={targetUser.avatarUrl}
                alt={targetUser.username}
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
              {targetUser.username}
            </h3>
            {targetUser.lastVisitAt && !targetUser.isOnline && (
              <p className='text-xs text-muted-foreground'>
                Last seen: {new Date(targetUser.lastVisitAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Delete button */}
        {onDelete && (
          <Button variant='ghost' size='sm' onClick={() => onDelete(bookmark._id)} aria-label='Delete bookmark'>
            <Trash2 className='h-4 w-4' />
          </Button>
        )}
      </div>

      {/* Tags */}
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

      {/* Remark Section */}
      <div className='border-t border-border pt-3 space-y-2'>
        {!isEditingRemark ? (
          <>
            <div className='flex items-start justify-between gap-2'>
              <div className='flex-1 min-w-0'>
                <p className='text-xs text-muted-foreground'>Note:</p>
                <p className='text-sm text-foreground break-words whitespace-pre-wrap'>{remark || 'No note added'}</p>
              </div>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setIsEditingRemark(true)}
                className='flex-shrink-0'
                aria-label='Edit note'
              >
                <Edit3 className='h-4 w-4' />
              </Button>
            </div>
          </>
        ) : (
          <div className='space-y-2'>
            <textarea
              value={remarkText}
              onChange={e => setRemarkText(e.target.value)}
              placeholder='Add a note...'
              rows={3}
              maxLength={500}
              className='w-full px-3 py-2 text-sm rounded-md border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
            />
            <div className='flex gap-2 justify-end'>
              <Button variant='outline' size='sm' onClick={handleCancel} disabled={updateBookmarkMutation.isPending}>
                Cancel
              </Button>
              <Button size='sm' onClick={handleSaveRemark} disabled={updateBookmarkMutation.isPending}>
                Save
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
