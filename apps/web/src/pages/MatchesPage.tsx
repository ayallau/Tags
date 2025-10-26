/**
 * Matches Page
 * Displays user matches sorted by compatibility score
 */

import { useState } from 'react';
import { MatchesFilters, MatchesList, EmptyMatches, type MatchSortOption } from '../features/matches';
import { useMatchesQuery } from '../shared/hooks/useMatchesQuery';

export default function MatchesPage() {
  const [sortBy, setSortBy] = useState<MatchSortOption>('score');

  // Fetch matches with infinite query
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useMatchesQuery({
    sort: sortBy,
    limit: 24,
  });

  // Get all matches from pages
  const matches = data?.pages.flatMap(page => page.matches) || [];

  // Handle sort change
  const handleSortChange = (sort: MatchSortOption) => {
    setSortBy(sort);
  };

  // Handle load more
  const handleLoadMore = async () => {
    if (hasNextPage && !isFetchingNextPage) {
      await fetchNextPage();
    }
  };

  // Placeholder actions (TODO: implement when features are ready)
  const handleBookmark = (userId: string) => {
    console.log('Bookmark user:', userId);
    // TODO: Implement bookmark functionality
  };

  const handleMessage = (userId: string) => {
    console.log('Message user:', userId);
    // TODO: Implement message functionality
  };

  const handleHide = (userId: string) => {
    console.log('Hide user:', userId);
    // TODO: Implement hide functionality
  };

  const handleBlock = (userId: string) => {
    console.log('Block user:', userId);
    // TODO: Implement block functionality
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-foreground mb-2'>Matches</h1>
        <p className='text-muted-foreground'>Users who share your interests</p>
      </div>

      {/* Filters */}
      <MatchesFilters sortBy={sortBy} onSortChange={handleSortChange} />

      {/* Error State */}
      {error && (
        <div className='text-center py-12'>
          <p className='text-red-600 dark:text-red-400'>Error loading matches: {error.message}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && matches.length === 0 && <EmptyMatches />}

      {/* Matches List */}
      {(!isLoading || matches.length > 0) && (
        <MatchesList
          matches={matches}
          isLoading={isLoading}
          isLoadingMore={isFetchingNextPage}
          hasMore={hasNextPage || false}
          onLoadMore={handleLoadMore}
          onBookmark={handleBookmark}
          onMessage={handleMessage}
          onHide={handleHide}
          onBlock={handleBlock}
        />
      )}
    </div>
  );
}
