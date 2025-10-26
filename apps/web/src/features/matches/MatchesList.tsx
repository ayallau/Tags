/**
 * MatchesList Component
 * Displays list of matches with infinite scroll
 */

import { Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { MatchUserCard } from './MatchUserCard';
import type { Match } from '../../shared/hooks/useMatchesQuery';

interface MatchesListProps {
  matches: Match[];
  isLoading?: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onBookmark?: (userId: string) => void;
  onMessage?: (userId: string) => void;
  onHide?: (userId: string) => void;
  onBlock?: (userId: string) => void;
}

export function MatchesList({
  matches,
  isLoading = false,
  isLoadingMore = false,
  hasMore = false,
  onLoadMore,
  onBookmark,
  onMessage,
  onHide,
  onBlock,
}: MatchesListProps) {
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
              <div className='text-right'>
                <div className='h-6 w-12 bg-muted rounded' />
                <div className='h-3 w-16 bg-muted rounded mt-1' />
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

  if (matches.length === 0) {
    return null; // Empty state will be handled by parent
  }

  return (
    <div className='space-y-4'>
      {/* Matches Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {matches.map(match => (
          <MatchUserCard
            key={match.targetUser._id}
            match={match}
            {...(onBookmark && { onBookmark })}
            {...(onMessage && { onMessage })}
            {...(onHide && { onHide })}
            {...(onBlock && { onBlock })}
          />
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

      {!hasMore && matches.length > 0 && (
        <div className='mt-6 text-center text-sm text-muted-foreground'>No more matches to load</div>
      )}
    </div>
  );
}
