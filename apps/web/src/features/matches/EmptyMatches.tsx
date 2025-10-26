/**
 * EmptyMatches Component
 * Displays empty state when no matches are found
 */

import { Heart, Search } from 'lucide-react';
import { EmptyState } from '../../components/data';

interface EmptyMatchesProps {
  hasFilters?: boolean;
}

export function EmptyMatches({ hasFilters = false }: EmptyMatchesProps) {
  if (hasFilters) {
    return (
      <EmptyState
        icon={<Search className='h-12 w-12 text-muted-foreground' />}
        title='No matches found'
        description='Try adjusting your filters or sort options'
      />
    );
  }

  return (
    <EmptyState
      icon={<Heart className='h-12 w-12 text-muted-foreground' />}
      title='No matches yet'
      description='Add more tags to your profile to discover better matches'
    />
  );
}
