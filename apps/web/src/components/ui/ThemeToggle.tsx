import React from 'react';
import { Monitor, Sun, Moon } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { getThemePreference, setTheme, type Theme } from '@/lib/theme';

interface ThemeToggleProps {
  className?: string;
}

const themeOptions: { value: Theme; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'system', label: 'System', icon: Monitor },
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
];

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [currentTheme, setCurrentTheme] = React.useState<Theme>(() => getThemePreference());
  const [isOpen, setIsOpen] = React.useState(false);

  const handleThemeChange = (theme: Theme) => {
    setTheme(theme);
    setCurrentTheme(theme);
    setIsOpen(false);
  };

  const currentOption = (themeOptions.find(option => option.value === currentTheme) ?? themeOptions[0])!;
  const CurrentIcon = currentOption.icon;

  return (
    <div className={cn('relative', className)}>
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-md',
          'bg-surface hover:bg-surface-hover active:bg-surface-active',
          'border border-border hover:border-border-hover',
          'text-foreground',
          'transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
          'aria-expanded={isOpen}'
        )}
        aria-label='Select theme'
        aria-haspopup='true'
      >
        <CurrentIcon className='w-4 h-4' />
        <span className='text-sm font-medium'>{currentOption.label}</span>
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute top-full left-0 mt-1 w-48',
            'bg-surface border border-border rounded-md shadow-lg',
            'z-50'
          )}
          role='menu'
          aria-orientation='vertical'
        >
          {themeOptions.map(option => {
            const Icon = option.icon;
            const isSelected = option.value === currentTheme;

            return (
              <button
                key={option.value}
                type='button'
                onClick={() => handleThemeChange(option.value)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 text-right',
                  'hover:bg-surface-hover active:bg-surface-active',
                  'text-foreground',
                  'transition-colors duration-200',
                  'first:rounded-t-md last:rounded-b-md',
                  'focus-visible:outline-none focus-visible:bg-surface-hover',
                  isSelected && 'bg-surface-hover'
                )}
                role='menuitem'
                aria-checked={isSelected}
              >
                <Icon className='w-4 h-4' />
                <span className='text-sm font-medium'>{option.label}</span>
                {isSelected && <span className='mr-auto text-xs text-foreground-muted'>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
