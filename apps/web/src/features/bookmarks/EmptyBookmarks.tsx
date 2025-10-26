/**
 * EmptyBookmarks Component
 * Displays when user has no bookmarks
 */

import { Bookmark } from 'lucide-react';

interface EmptyBookmarksProps {
  hasSearchQuery?: boolean;
}

export function EmptyBookmarks({ hasSearchQuery = false }: EmptyBookmarksProps) {
  return (
    <div className='flex flex-col items-center justify-center py-16 text-center'>
      <div className='mb-4 rounded-full bg-muted p-6'>
        <Bookmark className='h-12 w-12 text-muted-foreground' />
      </div>
      <h3 className='text-xl font-semibold text-foreground mb-2'>
        {hasSearchQuery ? 'No bookmarks found' : 'No bookmarks yet'}
      </h3>
      <p className='text-muted-foreground max-w-md'>
        {hasSearchQuery
          ? 'Try adjusting your search query to find bookmarks'
          : "Start bookmarking users you're interested in to see them here"}
      </p>
    </div>
  );
}
