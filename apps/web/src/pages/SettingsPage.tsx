/**
 * Settings Page
 * Manages blocked and hidden users
 */

import { useState } from 'react';
import { SettingsTabs } from '../components/settings/SettingsTabs';
import { BlockedList } from '../components/settings/BlockedList';
import { HiddenList } from '../components/settings/HiddenList';
import { Shield } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'blocked' | 'hidden'>('blocked');

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center gap-3'>
        <Shield className='h-8 w-8 text-primary' />
        <div>
          <h1 className='text-3xl font-bold text-foreground'>Settings</h1>
          <p className='text-muted-foreground'>Manage your privacy preferences</p>
        </div>
      </div>

      {/* Tabs */}
      <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content */}
      <div className='max-w-4xl'>{activeTab === 'blocked' ? <BlockedList /> : <HiddenList />}</div>
    </div>
  );
}
