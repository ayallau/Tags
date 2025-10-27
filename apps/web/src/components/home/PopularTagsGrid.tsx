/**
 * PopularTagsGrid Component
 * Displays trending/popular tags in a grid layout
 */

import { usePopularTags } from '../../shared/hooks/useTags';
import { TagPill } from '../tags/TagPill';
import { EmptyState } from '../data/EmptyState';
import { TileSkeleton } from '../skeletons';

interface PopularTagsGridProps {
  className?: string;
}

export function PopularTagsGrid({ className = '' }: PopularTagsGridProps) {
  const { data: tags, isLoading, error } = usePopularTags({ limit: 30, fillRandom: true });

  if (error) {
    return (
      <div className='p-4 text-red-600 dark:text-red-400'>
        Error loading popular tags: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 justify-items-center'>
        {Array.from({ length: 12 }).map((_, i) => (
          <TileSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!tags || tags.length === 0) {
    return (
      <EmptyState
        title='No Popular Tags Yet'
        description='There are no tags with users at the moment. Be the first to add tags!'
      />
    );
  }

  return (
    <div className={className}>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 justify-items-center'>
        {tags.map(tag => (
          <TagPill
            key={tag._id}
            tag={{
              _id: tag._id,
              slug: tag.slug,
              label: tag.label,
              createdAt: '',
              updatedAt: '',
            }}
            state='existing'
          />
        ))}
      </div>
    </div>
  );
}
