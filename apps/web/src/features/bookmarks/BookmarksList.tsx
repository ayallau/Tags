/**
 * BookmarksList Component
 * Displays list of bookmarks with search and infinite scroll
 */

import { Loader2, Search, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { BookmarkUserCard } from './BookmarkUserCard';
import type { Bookmark } from '../../shared/hooks/useBookmarks';

interface BookmarksListProps {
  bookmarks: Bookmark[];
  isLoading?: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onLoadMore?: () => void;
  onDelete?: (bookmarkId: string) => void;
}

export function BookmarksList({
  bookmarks,
  isLoading = false,
  isLoadingMore = false,
  hasMore = false,
  searchQuery = '',
  onSearchChange,
  onLoadMore,
  onDelete,
}: BookmarksListProps) {
  if (isLoading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className='border border-border rounded-lg p-4 space-y-3 bg-surface animate-pulse'>
            <div className='flex items-start justify-between gap-3'>
              <div className='flex items-center gap-3 flex-1'>
                <div className='h-12 w-12 bg-muted rounded-full' />
                <div className='flex-1 space-y-2'>
                  <div className='h-4 w-32 bg-muted rounded' />
                  <div className='h-3 w-24 bg-muted rounded' />
                </div>
              </div>
            </div>
            <div className='flex gap-1'>
              <div className='h-6 w-16 bg-muted rounded' />
              <div className='h-6 w-20 bg-muted rounded' />
              <div className='h-6 w-14 bg-muted rounded' />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return null; // Empty state will be handled by parent
  }

  return (
    <div className='space-y-4'>
      {/* Search Bar */}
      {onSearchChange && (
        <div className='relative max-w-md mx-auto'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            type='text'
            placeholder='Search bookmarks...'
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
            className='pl-10 pr-10'
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground'
              aria-label='Clear search'
            >
              <X className='h-4 w-4' />
            </button>
          )}
        </div>
      )}

      {/* Bookmarks Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {bookmarks.map(bookmark => (
          <BookmarkUserCard key={bookmark._id} bookmark={bookmark} onDelete={onDelete} />
        ))}
      </div>

      {/* Load More button */}
      {hasMore && (
        <div className='mt-6 text-center'>
          <Button onClick={onLoadMore} disabled={isLoadingMore} variant='outline' className='min-w-32'>
            {isLoadingMore ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}

      {!hasMore && bookmarks.length > 0 && (
        <div className='mt-6 text-center text-sm text-muted-foreground'>No more bookmarks to load</div>
      )}
    </div>
  );
}
