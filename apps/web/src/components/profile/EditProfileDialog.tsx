/**
 * EditProfileDialog Component
 * Dialog form for editing user profile (bio, location, avatarUrl)
 * Tags are managed separately via TagManagement
 */

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { useUpdateUser } from '../../shared/hooks/useUser';

interface EditProfileDialogProps {
  user: {
    username?: string;
    bio?: string;
    location?: string;
    avatarUrl?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function EditProfileDialog({ user, isOpen, onClose }: EditProfileDialogProps) {
  const [formData, setFormData] = useState({
    bio: (user as any).bio || '',
    location: (user as any).location || '',
    avatarUrl: (user as any).avatarUrl || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateMutation = useUpdateUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};

    if (formData.bio && formData.bio.length > 500) {
      newErrors['bio'] = 'Bio must be at most 500 characters';
    }

    if (formData.location && formData.location.length > 100) {
      newErrors['location'] = 'Location must be at most 100 characters';
    }

    if (formData.avatarUrl && !/^https?:\/\/.+/.test(formData.avatarUrl) && formData.avatarUrl !== '') {
      newErrors['avatarUrl'] = 'Invalid URL format';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Only send fields that have changed
      const updateData: Record<string, string> = {};
      if (formData.bio !== ((user as any).bio || '')) {
        updateData['bio'] = formData.bio || '';
      }
      if (formData.location !== ((user as any).location || '')) {
        updateData['location'] = formData.location || '';
      }
      if (formData.avatarUrl !== ((user as any).avatarUrl || '')) {
        updateData['avatarUrl'] = formData.avatarUrl || '';
      }

      if (Object.keys(updateData).length > 0) {
        await updateMutation.mutateAsync(updateData);
      }

      onClose();
    } catch (error) {
      console.error('Failed to update profile:', error);
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to update profile' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50' onClick={onClose}>
      <div
        className='relative bg-surface border border-border rounded-lg shadow-xl max-w-lg w-full mx-4'
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-border'>
          <h2 className='text-xl font-semibold text-foreground'>Edit Profile</h2>
          <Button variant='ghost' size='sm' onClick={onClose} aria-label='Close dialog'>
            <X className='h-5 w-5' />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-6 space-y-4'>
          {/* Bio */}
          <div>
            <label htmlFor='bio' className='block text-sm font-medium text-foreground mb-2'>
              Bio
            </label>
            <textarea
              id='bio'
              value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              maxLength={500}
              className='w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white resize-none'
              aria-invalid={!!errors['bio']}
              aria-describedby={errors['bio'] ? 'bio-error' : undefined}
            />
            {errors['bio'] && (
              <p id='bio-error' className='mt-1 text-sm text-red-600 dark:text-red-400' role='alert'>
                {errors['bio']}
              </p>
            )}
            <p className='mt-1 text-xs text-muted-foreground' dir='ltr' style={{ textAlign: 'left' }}>
              {formData.bio.length}/500
            </p>
          </div>

          {/* Location */}
          <div>
            <label htmlFor='location' className='block text-sm font-medium text-foreground mb-2'>
              Location
            </label>
            <input
              id='location'
              type='text'
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              maxLength={100}
              className='w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white'
              aria-invalid={!!errors['location']}
              aria-describedby={errors['location'] ? 'location-error' : undefined}
            />
            {errors['location'] && (
              <p id='location-error' className='mt-1 text-sm text-red-600 dark:text-red-400' role='alert'>
                {errors['location']}
              </p>
            )}
          </div>

          {/* Avatar URL */}
          <div>
            <label htmlFor='avatarUrl' className='block text-sm font-medium text-foreground mb-2'>
              Avatar URL
            </label>
            <input
              id='avatarUrl'
              type='url'
              value={formData.avatarUrl}
              onChange={e => setFormData({ ...formData, avatarUrl: e.target.value })}
              placeholder='https://example.com/avatar.jpg'
              className='w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white'
              aria-invalid={!!errors['avatarUrl']}
              aria-describedby={errors['avatarUrl'] ? 'avatarUrl-error' : undefined}
            />
            {errors['avatarUrl'] && (
              <p id='avatarUrl-error' className='mt-1 text-sm text-red-600 dark:text-red-400' role='alert'>
                {errors['avatarUrl']}
              </p>
            )}
          </div>

          {/* Submit Error */}
          {errors['submit'] && (
            <p className='text-sm text-red-600 dark:text-red-400' role='alert'>
              {errors['submit']}
            </p>
          )}

          {/* Actions */}
          <div className='flex justify-end gap-3 pt-4'>
            <Button type='button' variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button type='submit' disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
