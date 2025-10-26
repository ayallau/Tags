/**
 * TagManagement Component
 * Manages user tags with AddTagBar and TagPills for profile editing
 */

import { useEffect, useState } from 'react';
import { useListTags } from '../../shared/hooks/useTags';
import { AddTagBar } from '../tags/AddTagBar';
import { TagPill } from '../tags/TagPill';
import type { Tag } from '../../shared/types/tag';
import { useUpdateUser } from '../../shared/hooks/useUser';

interface TagManagementProps {
  currentTagIds?: string[] | Array<{ _id: string; [key: string]: unknown }>;
  className?: string;
}

export function TagManagement({ currentTagIds = [], className = '' }: TagManagementProps) {
  const { data: allTagsData } = useListTags({ limit: 100 });
  const allTags = allTagsData?.tags || [];

  // Normalize tag IDs - extract _id if it's an object
  const normalizedTagIds = currentTagIds.map(id => (typeof id === 'string' ? id : id._id));

  // Map tag IDs to Tag objects
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(normalizedTagIds);
  const selectedTags = allTags.filter(tag => selectedTagIds.includes(tag._id));

  // Sync with prop changes
  useEffect(() => {
    const normalized = currentTagIds.map(id => (typeof id === 'string' ? id : id._id));
    setSelectedTagIds(normalized);
  }, [currentTagIds]);

  const updateMutation = useUpdateUser();

  const handleAddTag = (tags: Tag[]) => {
    // AddTagBar sends the full array, we need to find the new tag
    const newTags = tags.filter(t => !selectedTagIds.includes(t._id));
    if (newTags.length === 0) return;

    if (selectedTagIds.length >= 20) {
      alert('You cannot add more than 20 tags');
      return;
    }

    const newTagIds = [...selectedTagIds, ...newTags.map(t => t._id)];
    setSelectedTagIds(newTagIds);
    saveTags(newTagIds);
  };

  const handleRemoveTag = (tagId: string) => {
    const newTags = selectedTagIds.filter(id => id !== tagId);
    setSelectedTagIds(newTags);
    saveTags(newTags);
  };

  const saveTags = async (tagIds: string[]) => {
    try {
      await updateMutation.mutateAsync({ tags: tagIds });
    } catch (error) {
      console.error('Failed to update tags:', error);
      // Revert on error
      setSelectedTagIds(currentTagIds);
    }
  };

  return (
    <div className={`bg-surface border border-border rounded-lg p-6 ${className}`}>
      <h2 className='text-lg font-semibold text-foreground mb-4'>My Tags</h2>

      {/* Add Tag Bar */}
      <AddTagBar
        selectedTags={selectedTags}
        onTagsChange={handleAddTag}
        placeholder='Add tags...'
        disabled={selectedTagIds.length >= 20}
        className='mb-4'
      />

      {/* Selected Tags */}
      {selectedTags.length > 0 ? (
        <div className='flex flex-wrap gap-2'>
          {selectedTags.map(tag => (
            <TagPill key={tag._id} tag={tag} state='removable' onRemove={() => handleRemoveTag(tag._id)} />
          ))}
        </div>
      ) : (
        <p className='text-sm text-muted-foreground'>No tags selected</p>
      )}

      <p className='mt-4 text-xs text-muted-foreground'>{selectedTagIds.length}/20 tags</p>
    </div>
  );
}
