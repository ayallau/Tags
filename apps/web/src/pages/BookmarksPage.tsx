/**
 * Bookmarks Page
 * Displays saved bookmarks with search and remark editing
 */

import { useState } from 'react';
import { useBookmarksQuery, useRemoveBookmark } from '../shared/hooks/useBookmarks';
import { BookmarksList, EmptyBookmarks } from '../features/bookmarks';

export default function BookmarksPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch bookmarks with infinite query
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useBookmarksQuery({
    query: searchQuery,
    limit: 24,
  });

  const removeBookmarkMutation = useRemoveBookmark();

  // Get all bookmarks from pages
  const bookmarks = data?.pages.flatMap(page => page.bookmarks) || [];

  // Handle search change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  // Handle load more
  const handleLoadMore = async () => {
    if (hasNextPage && !isFetchingNextPage) {
      await fetchNextPage();
    }
  };

  // Handle delete bookmark
  const handleDelete = (bookmarkId: string) => {
    if (confirm('Are you sure you want to remove this bookmark?')) {
      removeBookmarkMutation.mutate(bookmarkId);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-foreground mb-2'>Bookmarks</h1>
        <p className='text-muted-foreground'>Your saved users and notes</p>
      </div>

      {/* Error State */}
      {error && (
        <div className='text-center py-12'>
          <p className='text-red-600 dark:text-red-400'>Error loading bookmarks: {error.message}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && bookmarks.length === 0 && <EmptyBookmarks hasSearchQuery={!!searchQuery} />}

      {/* Bookmarks List */}
      {(!isLoading || bookmarks.length > 0) && (
        <BookmarksList
          bookmarks={bookmarks}
          isLoading={isLoading}
          isLoadingMore={isFetchingNextPage}
          hasMore={hasNextPage || false}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onLoadMore={handleLoadMore}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
