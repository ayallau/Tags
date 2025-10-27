import { useState } from 'react';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { PopularTagsGrid } from '../components/home/PopularTagsGrid';
import { UserTitleGrid } from '../components/home/UserTitleGrid';
import { usePopularTags } from '../shared/hooks/useTags';

export default function HomePage() {
  const [selectedTagId, setSelectedTagId] = useState<string | undefined>(undefined);
  const { data: popularTags } = usePopularTags({ limit: 30, fillRandom: true });

  const handleTagClick = (tagId: string) => {
    // Toggle: if clicking the same tag, deselect it
    if (selectedTagId === tagId) {
      setSelectedTagId(undefined);
    } else {
      setSelectedTagId(tagId);
    }
  };

  // Find the selected tag to display its label
  const selectedTag = popularTags?.find(tag => tag._id === selectedTagId);

  return (
    <ProtectedRoute>
      <div className='container mx-auto px-4 space-y-16'>
        {/* Popular Tags Section */}
        <section className='space-y-6'>
          <div className='text-center'>
            <h1 className='text-3xl font-bold text-foreground mb-2'>Trending Tags</h1>
            <p className='text-muted-foreground text-sm'>Discover the most popular tags</p>
          </div>
          <PopularTagsGrid onTagClick={handleTagClick} selectedTagId={selectedTagId} />
        </section>

        {/* Recent Users Section */}
        <section className='space-y-6'>
          <div className='text-center'>
            {/* <h1 className='text-3xl font-bold text-foreground mb-2'>
              {selectedTagId ? 'Filtered Users' : 'Recently Active Users'}
            </h1> */}
            <h2 className='text-2xl font-bold text-foreground mb-2'>Get to know our community</h2>
            <p className='text-muted-foreground text-sm'>
              {selectedTagId && selectedTag
                ? `People who like ${selectedTag.label}`
                : 'Travel through our users and discover similar interests'}
            </p>
          </div>
          <UserTitleGrid selectedTagId={selectedTagId} />
        </section>
      </div>
    </ProtectedRoute>
  );
}
