/**
 * RemarkEditor Component
 * Dialog/Sheet for editing bookmark remarks
 */

import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import type { Bookmark } from '../../shared/hooks/useBookmarks';
import { useUpdateBookmark } from '../../shared/hooks/useBookmarks';

interface RemarkEditorProps {
  bookmark: Bookmark;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RemarkEditor({ bookmark, open, onOpenChange }: RemarkEditorProps) {
  const [remark, setRemark] = useState(bookmark.remark || '');
  const updateBookmarkMutation = useUpdateBookmark();

  const handleSave = () => {
    updateBookmarkMutation.mutate(
      { id: bookmark._id, data: { remark } },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Note for {bookmark.targetUser.username}</DialogTitle>
        </DialogHeader>
        <textarea
          value={remark}
          onChange={e => setRemark(e.target.value)}
          placeholder='Add a note about this user...'
          rows={4}
          maxLength={500}
          className='w-full px-3 py-2 text-sm rounded-md border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
        />
        <p className='text-xs text-muted-foreground text-right'>{remark.length}/500</p>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={updateBookmarkMutation.isPending}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
