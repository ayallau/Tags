/**
 * Discover Page
 * Allows users to discover other users based on tags, search, and sorting
 */

import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Grid3x3, List as ListIcon } from 'lucide-react';
import { AddTagBar } from '../components/tags/AddTagBar';
import { UsersList } from '../components/users/UsersList';
import { Button } from '../components/ui/button';
import { useDiscoverUsers } from '../shared/hooks/useDiscoverUsers';
import { useListTags } from '../shared/hooks/useTags';
import type { Tag } from '../shared/types/tag';
import type { DiscoverUsersParams } from '../shared/types/user';

export default function DiscoverPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get URL params
  const selectedTagIds = searchParams.get('tags')?.split(',').filter(Boolean) || [];
  const searchQuery = searchParams.get('query') || '';
  const sortParam = searchParams.get('sort');
  const sortBy: DiscoverUsersParams['sort'] =
    sortParam && ['relevance', 'online', 'lastVisit', 'name'].includes(sortParam)
      ? (sortParam as DiscoverUsersParams['sort'])
      : 'relevance';

  // Fetch tags for the tag picker
  const { data: tagsData } = useListTags({ limit: 100 });

  // Build API params (only include defined values)
  const apiParams: DiscoverUsersParams = {
    ...(selectedTagIds.length > 0 && { tags: selectedTagIds.join(',') }),
    ...(searchQuery && { query: searchQuery }),
    sort: sortBy,
    limit: 24,
  };

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useDiscoverUsers(apiParams);

  // Update tags in URL
  const handleTagsChange = (tags: Tag[]) => {
    if (tags.length === 0) {
      searchParams.delete('tags');
    } else {
      searchParams.set('tags', tags.map(t => t._id).join(','));
    }
    setSearchParams(searchParams);
  };

  // Update search query in URL
  const handleSearchChange = (query: string) => {
    if (query) {
      searchParams.set('query', query);
    } else {
      searchParams.delete('query');
    }
    setSearchParams(searchParams);
  };

  // Update sort in URL
  const handleSortChange = (sort: DiscoverUsersParams['sort']) => {
    if (sort) {
      searchParams.set('sort', sort);
    } else {
      searchParams.delete('sort');
    }
    setSearchParams(searchParams);
  };

  // Load more handler
  const handleLoadMore = async () => {
    if (hasNextPage && !isFetchingNextPage) {
      await fetchNextPage();
    }
  };

  // Get selected tags from tag IDs
  const selectedTags = tagsData?.tags?.filter(tag => selectedTagIds.includes(tag._id)) || [];

  // Get users from infinite query pages
  const users = data?.pages.flatMap(page => page.users) || [];

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-foreground mb-2'>Discover</h1>
        <p className='text-muted-foreground'>Find people who share your interests</p>
      </div>

      {/* Filters Section */}
      <div className='space-y-4'>
        {/* Tag Filter */}
        <div className='bg-surface border border-border rounded-lg p-4'>
          <h2 className='text-sm font-semibold mb-3 text-foreground'>Filter by Tags</h2>
          <AddTagBar selectedTags={selectedTags} onTagsChange={handleTagsChange} placeholder='Search and add tags...' />
        </div>

        {/* Search and Sort Controls */}
        <div className='bg-surface border border-border rounded-lg p-4'>
          <div className='space-y-3'>
            {/* Search Input */}
            <div className='flex gap-2'>
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                <input
                  type='text'
                  placeholder='Search by username...'
                  value={searchQuery}
                  onChange={e => handleSearchChange(e.target.value)}
                  className='w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary'
                />
              </div>
            </div>

            {/* Sort and View Options */}
            <div className='flex gap-2 flex-wrap items-center'>
              <div className='flex gap-1 border border-border rounded-lg p-1'>
                <Button
                  variant={sortBy === 'relevance' ? 'default' : 'ghost'}
                  size='sm'
                  onClick={() => handleSortChange('relevance')}
                >
                  Relevance
                </Button>
                <Button
                  variant={sortBy === 'online' ? 'default' : 'ghost'}
                  size='sm'
                  onClick={() => handleSortChange('online')}
                >
                  Online
                </Button>
                <Button
                  variant={sortBy === 'lastVisit' ? 'default' : 'ghost'}
                  size='sm'
                  onClick={() => handleSortChange('lastVisit')}
                >
                  Last Visit
                </Button>
                <Button
                  variant={sortBy === 'name' ? 'default' : 'ghost'}
                  size='sm'
                  onClick={() => handleSortChange('name')}
                >
                  Name
                </Button>
              </div>

              <div className='flex gap-1 border border-border rounded-lg p-1 ml-auto'>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size='sm'
                  onClick={() => setViewMode('grid')}
                  aria-label='Grid view'
                >
                  <Grid3x3 className='h-4 w-4' />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size='sm'
                  onClick={() => setViewMode('list')}
                  aria-label='List view'
                >
                  <ListIcon className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Users List */}
      <UsersList
        users={users}
        isLoading={isLoading}
        isLoadingMore={isFetchingNextPage}
        hasMore={hasNextPage || false}
        onLoadMore={handleLoadMore}
        error={error}
        viewMode={viewMode}
      />
    </div>
  );
}
