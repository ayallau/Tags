/**
 * SettingsTabs Component
 * Simple tabs UI for Blocked/Hidden sections
 */

import { Button } from '../ui/button';
import { cn } from '../../shared/lib/utils';

interface SettingsTabsProps {
  activeTab: 'blocked' | 'hidden';
  onTabChange: (tab: 'blocked' | 'hidden') => void;
}

export function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  return (
    <div className='flex gap-2 border-b border-border mb-6'>
      <Button
        variant='ghost'
        onClick={() => onTabChange('blocked')}
        className={cn(
          'rounded-none border-b-2 border-transparent hover:border-border/50 transition-colors',
          activeTab === 'blocked' && 'border-primary text-primary'
        )}
      >
        Blocked Users
      </Button>
      <Button
        variant='ghost'
        onClick={() => onTabChange('hidden')}
        className={cn(
          'rounded-none border-b-2 border-transparent hover:border-border/50 transition-colors',
          activeTab === 'hidden' && 'border-primary text-primary'
        )}
      >
        Hidden Users
      </Button>
    </div>
  );
}
