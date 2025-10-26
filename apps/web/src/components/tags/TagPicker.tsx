/**
 * TagPicker Component
 * Autocomplete input for tags with keyboard navigation (↑/↓/Enter/Escape)
 * Supports RTL and Dark Mode
 * Now with support for creating new tags
 */

import { useEffect, useRef, useState } from 'react';
import { useSearchTags, useCreateTag } from '../../shared/hooks/useTags';
import type { Tag } from '../../shared/types/tag';

interface TagPickerProps {
  onSelect: (tag: Tag) => void;
  selectedTags?: Tag[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  allowCreate?: boolean; // Allow creating new tags when no results found
}

export function TagPicker({
  onSelect,
  selectedTags = [],
  placeholder = 'Search tags...',
  disabled = false,
  className = '',
  allowCreate = false,
}: TagPickerProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const { data: suggestions = [], isLoading } = useSearchTags(query);
  const createTagMutation = useCreateTag();

  // Filter out already selected tags
  const availableSuggestions = suggestions.filter(tag => !selectedTags.some(selected => selected._id === tag._id));

  // Check if we can create a new tag
  const canCreateNewTag = allowCreate && query.length >= 2 && !isLoading && availableSuggestions.length === 0;

  const totalItems = canCreateNewTag ? 1 : availableSuggestions.length;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length >= 2);
  };

  const handleSelect = (tag: Tag) => {
    onSelect(tag);
    setQuery('');
    setIsOpen(false);
    setFocusedIndex(-1);
    inputRef.current?.focus();
  };

  const handleCreateNewTag = async () => {
    if (!canCreateNewTag || !query.trim()) return;

    try {
      const newTag = await createTagMutation.mutateAsync({ label: query.trim() });
      onSelect(newTag);
      setQuery('');
      setIsOpen(false);
      setFocusedIndex(-1);
      inputRef.current?.focus();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to create tag:', error);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prev => (prev < totalItems - 1 ? prev + 1 : prev));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (focusedIndex === 0 && canCreateNewTag) {
            // Create new tag
            handleCreateNewTag();
          } else if (focusedIndex >= 0 && availableSuggestions[focusedIndex]) {
            handleSelect(availableSuggestions[focusedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setFocusedIndex(-1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isOpen,
    availableSuggestions,
    focusedIndex,
    onSelect,
    canCreateNewTag,
    totalItems,
    handleCreateNewTag,
    handleSelect,
  ]);

  const handleFocus = () => {
    if (query.length >= 2) {
      setIsOpen(true);
    }
  };

  const handleBlur = () => {
    // Delay to allow click on suggestion
    setTimeout(() => {
      if (!listRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
      }
    }, 200);
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        type='text'
        value={query}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        className='w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white'
        role='combobox'
        aria-expanded={isOpen}
        aria-autocomplete='list'
        aria-controls='tag-suggestions'
      />

      {isOpen && query.length >= 2 && (
        <ul
          ref={listRef}
          id='tag-suggestions'
          className='absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto'
          role='listbox'
        >
          {isLoading ? (
            <li className='px-4 py-2 text-gray-500 dark:text-gray-400' role='status'>
              Searching...
            </li>
          ) : canCreateNewTag ? (
            <li
              className={`
                px-4 py-2 cursor-pointer transition-colors flex items-center gap-2 rounded-lg
                ${focusedIndex === 0 ? 'bg-blue-100 dark:bg-blue-900/30' : ''}
                hover:bg-gray-100 dark:hover:bg-gray-700
              `}
              onClick={handleCreateNewTag}
              role='option'
              aria-selected={focusedIndex === 0}
            >
              <span className='text-blue-600 dark:text-blue-400'>+</span>
              <span>
                Create new tag: <strong>{query}</strong>
              </span>
              {createTagMutation.isPending && <span className='ml-auto text-sm text-gray-500'>Creating...</span>}
            </li>
          ) : availableSuggestions.length === 0 ? (
            <li className='px-4 py-2 text-gray-500 dark:text-gray-400' role='status'>
              No tags found
            </li>
          ) : (
            <>
              {availableSuggestions.map((tag, index) => (
                <li
                  key={tag._id}
                  className={`
                    px-4 py-2 cursor-pointer transition-colors
                    ${focusedIndex === index ? 'bg-blue-100 dark:bg-blue-900/30' : ''}
                    ${index === 0 ? 'rounded-t-lg' : ''}
                    ${index === availableSuggestions.length - 1 ? 'rounded-b-lg' : ''}
                    hover:bg-gray-100 dark:hover:bg-gray-700
                  `}
                  onClick={() => handleSelect(tag)}
                  role='option'
                  aria-selected={focusedIndex === index}
                >
                  {tag.label}
                </li>
              ))}
              {allowCreate && (
                <li
                  className={`
                    px-4 py-2 cursor-pointer transition-colors flex items-center gap-2
                    border-t border-gray-300 dark:border-gray-700
                    ${focusedIndex === availableSuggestions.length ? 'bg-blue-100 dark:bg-blue-900/30' : ''}
                    hover:bg-gray-100 dark:hover:bg-gray-700
                  `}
                  onClick={handleCreateNewTag}
                  role='option'
                  aria-selected={focusedIndex === availableSuggestions.length}
                >
                  <span className='text-blue-600 dark:text-blue-400'>+</span>
                  <span>
                    Create new tag: <strong>{query}</strong>
                  </span>
                  {createTagMutation.isPending && <span className='ml-auto text-sm text-gray-500'>Creating...</span>}
                </li>
              )}
            </>
          )}
        </ul>
      )}
    </div>
  );
}
