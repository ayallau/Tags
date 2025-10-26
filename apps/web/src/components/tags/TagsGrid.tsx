/**
 * TagsGrid Component
 * Admin/management table for tags (create, edit, delete)
 */

import { useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useListTags, useCreateTag, useUpdateTag, useDeleteTag } from '../../shared/hooks/useTags';
import { Button } from '../ui/button';
import type { Tag } from '../../shared/types/tag';

interface TagsGridProps {
  className?: string;
}

export function TagsGrid({ className = '' }: TagsGridProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newLabel, setNewLabel] = useState('');
  const [editLabel, setEditLabel] = useState('');

  const { data, isLoading, error } = useListTags({ limit: 50 });
  const createMutation = useCreateTag();
  const updateMutation = useUpdateTag();
  const deleteMutation = useDeleteTag();

  const handleCreate = async () => {
    if (!newLabel.trim()) return;
    try {
      await createMutation.mutateAsync({ label: newLabel.trim() });
      setNewLabel('');
    } catch (error) {
      console.error('Failed to create tag:', error);
    }
  };

  const handleStartEdit = (tag: Tag) => {
    setEditingId(tag._id);
    setEditLabel(tag.label);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editLabel.trim()) return;
    try {
      await updateMutation.mutateAsync({ id, data: { label: editLabel.trim() } });
      setEditingId(null);
      setEditLabel('');
    } catch (error) {
      console.error('Failed to update tag:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tag?')) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete tag:', error);
    }
  };

  if (error) {
    return (
      <div className='p-4 text-red-600 dark:text-red-400'>
        Error loading tags: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Create new tag */}
      <div className='flex gap-2'>
        <input
          type='text'
          value={newLabel}
          onChange={e => setNewLabel(e.target.value)}
          placeholder='Enter tag label...'
          className='flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white'
          onKeyDown={e => {
            if (e.key === 'Enter') handleCreate();
          }}
        />
        <Button onClick={handleCreate} disabled={!newLabel.trim() || createMutation.isPending}>
          <Plus size={20} className='mr-2' />
          Create
        </Button>
      </div>

      {/* Tags table */}
      {isLoading ? (
        <div className='text-gray-500 dark:text-gray-400'>Loading tags...</div>
      ) : !data?.tags.length ? (
        <div className='text-gray-500 dark:text-gray-400'>No tags found</div>
      ) : (
        <div className='border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden'>
          <table className='w-full'>
            <thead className='bg-gray-100 dark:bg-gray-800'>
              <tr>
                <th className='px-4 py-2 text-left text-sm font-semibold'>Label</th>
                <th className='px-4 py-2 text-left text-sm font-semibold'>Slug</th>
                <th className='px-4 py-2 text-right text-sm font-semibold'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.tags.map(tag => (
                <tr key={tag._id} className='border-t border-gray-300 dark:border-gray-700'>
                  <td className='px-4 py-2'>
                    {editingId === tag._id ? (
                      <input
                        type='text'
                        value={editLabel}
                        onChange={e => setEditLabel(e.target.value)}
                        className='w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white'
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleSaveEdit(tag._id);
                          if (e.key === 'Escape') {
                            setEditingId(null);
                            setEditLabel('');
                          }
                        }}
                        autoFocus
                      />
                    ) : (
                      tag.label
                    )}
                  </td>
                  <td className='px-4 py-2 text-sm text-gray-600 dark:text-gray-400'>{tag.slug}</td>
                  <td className='px-4 py-2'>
                    <div className='flex justify-end gap-2'>
                      {editingId === tag._id ? (
                        <>
                          <Button size='sm' onClick={() => handleSaveEdit(tag._id)} disabled={updateMutation.isPending}>
                            Save
                          </Button>
                          <Button
                            size='sm'
                            variant='secondary'
                            onClick={() => {
                              setEditingId(null);
                              setEditLabel('');
                            }}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size='sm' onClick={() => handleStartEdit(tag)}>
                            <Edit size={16} />
                          </Button>
                          <Button size='sm' variant='destructive' onClick={() => handleDelete(tag._id)}>
                            <Trash2 size={16} />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
