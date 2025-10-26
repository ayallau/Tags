/**
 * MatchesFilters Component
 * Provides sorting options for the matches list
 */

import { Button } from '../../components/ui/button';

export type MatchSortOption = 'score' | 'sharedCount' | 'online' | 'lastVisit' | 'name';

interface MatchesFiltersProps {
  sortBy: MatchSortOption;
  onSortChange: (sort: MatchSortOption) => void;
}

const sortOptions: { value: MatchSortOption; label: string }[] = [
  { value: 'score', label: 'Match Score' },
  { value: 'sharedCount', label: 'Shared Tags' },
  { value: 'online', label: 'Online First' },
  { value: 'lastVisit', label: 'Last Visit' },
  { value: 'name', label: 'Name' },
];

export function MatchesFilters({ sortBy, onSortChange }: MatchesFiltersProps) {
  return (
    <div className='bg-surface border border-border rounded-lg p-4'>
      <div className='flex flex-wrap gap-2'>
        <span className='text-sm font-semibold text-foreground my-auto'>Sort by:</span>
        <div className='flex gap-1 border border-border rounded-lg p-1'>
          {sortOptions.map(option => (
            <Button
              key={option.value}
              variant={sortBy === option.value ? 'default' : 'ghost'}
              size='sm'
              onClick={() => onSortChange(option.value)}
              aria-label={`Sort by ${option.label}`}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
