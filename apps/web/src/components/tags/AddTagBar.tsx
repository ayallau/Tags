/**
 * AddTagBar Component
 * Wrapper with TagPicker + current selections
 */

import { TagPicker } from './TagPicker';
import { TagPill } from './TagPill';
import type { Tag } from '../../shared/types/tag';

interface AddTagBarProps {
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function AddTagBar({
  selectedTags,
  onTagsChange,
  placeholder = 'Add tags...',
  disabled = false,
  className = '',
}: AddTagBarProps) {
  const handleSelect = (tag: Tag) => {
    if (!selectedTags.some(t => t._id === tag._id)) {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleRemove = (tagId: string) => {
    onTagsChange(selectedTags.filter(t => t._id !== tagId));
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <TagPicker onSelect={handleSelect} selectedTags={selectedTags} placeholder={placeholder} disabled={disabled} />

      {selectedTags.length > 0 && (
        <div className='flex flex-wrap gap-2' role='list' aria-label='Selected tags'>
          {selectedTags.map(tag => (
            <TagPill key={tag._id} tag={tag} state='removable' onRemove={() => handleRemove(tag._id)} />
          ))}
        </div>
      )}
    </div>
  );
}
