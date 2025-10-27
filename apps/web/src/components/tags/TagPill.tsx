/**
 * TagPill Component
 * Displays a single tag with different states (existing, addable, removable)
 */

import { X } from 'lucide-react';
import type { Tag, TagState } from '../../shared/types/tag';

interface TagPillProps {
  tag: Tag;
  state?: TagState;
  onRemove?: () => void;
  className?: string;
}

export function TagPill({ tag, state = 'existing', onRemove, className = '' }: TagPillProps) {
  const isRemovable = state === 'removable' && onRemove;

  return (
    <div
      className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
        transition-colors
        ${
          state === 'addable'
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
        }
        ${className}
      `}
      role='listitem'
      aria-label={`Tag: ${tag.label}`}
    >
      <span>&lt; {tag.label} &gt;</span>
      {isRemovable && (
        <button
          onClick={onRemove}
          className='ml-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-0.5 transition-colors'
          aria-label={`Remove ${tag.label}`}
          type='button'
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
