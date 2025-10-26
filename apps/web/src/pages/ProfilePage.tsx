/**
 * ProfilePage Component
 * User profile page with editing capabilities
 * Includes ProfileHeader, TagManagement, and EditProfileDialog
 */

import { useState } from 'react';
import { useCurrentUser } from '../shared/hooks/useUser';
import { ProfileHeader, EditProfileDialog, TagManagement } from '../components/profile';
import { PageSkeleton } from '../components/skeletons';
import { EmptyState } from '../components/data/EmptyState';

export default function ProfilePage() {
  const { data: user, isLoading, error } = useCurrentUser();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Loading state
  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-foreground mb-4'>My Profile</h1>
        </div>
        <PageSkeleton />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <EmptyState
        variant='error'
        title='Error loading profile'
        description={error instanceof Error ? error.message : 'Unknown error'}
      />
    );
  }

  // No user data
  if (!user) {
    return <EmptyState title='No data found' description='Unable to load profile information' />;
  }

  return (
    <div className='space-y-6'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-foreground mb-4'>My Profile</h1>
      </div>

      <div className='max-w-2xl mx-auto space-y-6'>
        {/* Profile Header */}
        <ProfileHeader user={user} onEdit={() => setIsEditDialogOpen(true)} />

        {/* Tag Management */}
        {user.tags && Array.isArray(user.tags) && <TagManagement currentTagIds={user.tags} />}
      </div>

      {/* Edit Profile Dialog */}
      <EditProfileDialog user={user} isOpen={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} />
    </div>
  );
}
