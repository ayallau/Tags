/**
 * SelectTagsStep Component
 * Third step of onboarding wizard - select tags
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TagPicker } from '../../tags/TagPicker';
import { TagPill } from '../../tags/TagPill';
import { useSearchTags } from '../../../shared/hooks/useTags';
import type { Tag } from '../../../shared/types/tag';

interface SelectTagsStepProps {
  selectedTags: Tag[];
  onSelectTag: (tag: Tag) => void;
  onRemoveTag: (tagId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function SelectTagsStep({ selectedTags, onSelectTag, onRemoveTag, onNext, onBack }: SelectTagsStepProps) {
  const [query, setQuery] = useState('');

  const { data: suggestions = [] } = useSearchTags(query);

  const handleSelect = (tag: Tag) => {
    if (!selectedTags.some(t => t._id === tag._id)) {
      onSelectTag(tag);
    }
    setQuery('');
  };

  const handleRemove = (tagId: string) => {
    onRemoveTag(tagId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className='space-y-6'
    >
      <div className='text-center space-y-2'>
        <h2 className='text-2xl font-bold text-foreground'>Select Your Tags</h2>
        <p className='text-muted-foreground'>Choose topics that interest you (min 3 tags)</p>
      </div>

      <div className='max-w-2xl mx-auto space-y-6'>
        {/* Tag Search */}
        <div className='relative'>
          <TagPicker
            onSelect={handleSelect}
            selectedTags={selectedTags}
            placeholder='Search for tags (e.g., "photography", "coding")...'
            className='w-full'
          />
        </div>

        {/* Selected Tags */}
        <div>
          <h3 className='text-sm font-medium mb-3 text-foreground'>Selected Tags ({selectedTags.length}/3+)</h3>
          {selectedTags.length > 0 ? (
            <div className='flex flex-wrap gap-2 p-4 bg-surface border border-border rounded-lg min-h-[100px]'>
              {selectedTags.map(tag => (
                <TagPill key={tag._id} tag={tag} state='removable' onRemove={() => handleRemove(tag._id)} />
              ))}
            </div>
          ) : (
            <div className='p-8 bg-surface border border-border rounded-lg text-center'>
              <p className='text-muted-foreground'>No tags selected yet. Start searching above!</p>
            </div>
          )}
        </div>

        {/* Popular Tags Suggestion */}
        {selectedTags.length === 0 && suggestions.length > 0 && (
          <div>
            <h3 className='text-sm font-medium mb-3 text-foreground'>Suggestions</h3>
            <div className='flex flex-wrap gap-2'>
              {suggestions.slice(0, 8).map(tag => (
                <TagPill key={tag._id} tag={tag} state='addable' onRemove={() => handleSelect(tag)} />
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className='flex gap-3 pt-4'>
          <button
            onClick={onBack}
            className='flex-1 px-6 py-3 border border-border hover:bg-gray-50 dark:hover:bg-gray-800 text-foreground font-semibold rounded-lg transition-colors'
          >
            Back
          </button>
          <button
            onClick={onNext}
            disabled={selectedTags.length < 3}
            className={`flex-1 px-6 py-3 font-semibold rounded-lg transition-colors ${
              selectedTags.length >= 3
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
}
