/**
 * FinishStep Component
 * Final step of onboarding wizard - review and submit
 */

import { motion } from 'framer-motion';
import type { Tag } from '../../../shared/types/tag';

interface ProfileInfo {
  bio?: string;
  location?: string;
}

interface FinishStepProps {
  profileInfo: ProfileInfo;
  selectedTags: Tag[];
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export function FinishStep({ profileInfo, selectedTags, onSubmit, onBack, isSubmitting = false }: FinishStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className='space-y-6'
    >
      <div className='text-center space-y-2'>
        <h2 className='text-2xl font-bold text-foreground'>You're All Set!</h2>
        <p className='text-muted-foreground'>Review your information and finish setup</p>
      </div>

      <div className='max-w-md mx-auto space-y-6'>
        {/* Profile Summary */}
        <div className='bg-surface border border-border rounded-lg p-6 space-y-4'>
          <h3 className='font-semibold text-foreground'>Profile Summary</h3>

          <div className='space-y-3'>
            {profileInfo.location && (
              <div>
                <p className='text-xs text-muted-foreground mb-1'>Location</p>
                <p className='font-medium text-foreground'>{profileInfo.location}</p>
              </div>
            )}

            {profileInfo.bio && (
              <div>
                <p className='text-xs text-muted-foreground mb-1'>Bio</p>
                <p className='text-sm text-foreground'>{profileInfo.bio}</p>
              </div>
            )}
          </div>
        </div>

        {/* Tags Summary */}
        <div className='bg-surface border border-border rounded-lg p-6 space-y-4'>
          <h3 className='font-semibold text-foreground'>Selected Tags ({selectedTags.length})</h3>
          <div className='flex flex-wrap gap-2'>
            {selectedTags.map(tag => (
              <span
                key={tag._id}
                className='px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-sm'
              >
                {tag.label}
              </span>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className='flex gap-3 pt-4'>
          <button
            onClick={onBack}
            disabled={isSubmitting}
            className='flex-1 px-6 py-3 border border-border hover:bg-gray-50 dark:hover:bg-gray-800 text-foreground font-semibold rounded-lg transition-colors disabled:opacity-50'
          >
            Back
          </button>
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className='flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isSubmitting ? 'Setting Up...' : "Let's Go!"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
