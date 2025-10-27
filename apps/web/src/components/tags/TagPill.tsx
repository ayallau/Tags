/**
 * TagPill Component
 * Displays a single tag with different states (existing, addable, removable)
 */

import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Tag, TagState } from '../../shared/types/tag';

interface TagPillProps {
  tag: Tag;
  state?: TagState;
  onRemove?: () => void;
  className?: string;
  isClickable?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
}

export function TagPill({
  tag,
  state = 'existing',
  onRemove,
  className = '',
  isClickable = false,
  onClick,
  isSelected = false,
}: TagPillProps) {
  const isRemovable = state === 'removable' && onRemove;

  const baseClasses = `
    inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
    transition-colors
    ${
      state === 'addable'
        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    }
    ${className}
  `;

  // If selected, show active state (hover colors as background)
  const selectedClasses = isSelected ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-200 dark:hover:bg-gray-700';

  const clickableClasses = isClickable || onClick ? `${selectedClasses} cursor-pointer` : '';

  const content = (
    <>
      <span>&lt; {tag.label} &gt;</span>
      {isRemovable && (
        <button
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            onRemove?.();
          }}
          className='ml-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-0.5 transition-colors'
          aria-label={`Remove ${tag.label}`}
          type='button'
        >
          <X size={14} />
        </button>
      )}
    </>
  );

  // If onClick is provided, wrap in button
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${clickableClasses}`}
        type='button'
        role='listitem'
        aria-label={`Filter by tag: ${tag.label}`}
      >
        {content}
      </button>
    );
  }

  // If clickable and not removable, wrap in Link
  if (isClickable && !isRemovable) {
    return (
      <Link
        to={`/discover?tags=${tag._id}`}
        className={`${baseClasses} ${clickableClasses}`}
        role='listitem'
        aria-label={`Filter by tag: ${tag.label}`}
      >
        {content}
      </Link>
    );
  }

  // Regular div
  return (
    <div className={`${baseClasses} ${clickableClasses}`} role='listitem' aria-label={`Tag: ${tag.label}`}>
      {content}
    </div>
  );
}
