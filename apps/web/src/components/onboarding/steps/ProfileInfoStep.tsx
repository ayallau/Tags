/**
 * ProfileInfoStep Component
 * Second step of onboarding wizard - collect basic profile info
 */

import { useState } from 'react';
import { motion } from 'framer-motion';

interface ProfileInfo {
  bio?: string;
  location?: string;
}

interface ProfileInfoStepProps {
  data: ProfileInfo;
  onChange: (data: ProfileInfo) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ProfileInfoStep({ data, onChange, onNext, onBack }: ProfileInfoStepProps) {
  const [errors, setErrors] = useState<Partial<ProfileInfo>>({});

  const validate = (): boolean => {
    const newErrors: Partial<ProfileInfo> = {};

    if (data.bio && data.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className='space-y-6'
    >
      <div className='text-center space-y-2'>
        <h2 className='text-2xl font-bold text-foreground'>Profile Information</h2>
        <p className='text-muted-foreground'>Let's personalize your profile</p>
      </div>

      <div className='max-w-md mx-auto space-y-4'>
        {/* Location */}
        <div>
          <label htmlFor='location' className='block text-sm font-medium mb-2'>
            Location
          </label>
          <input
            id='location'
            type='text'
            value={data.location || ''}
            onChange={e => onChange({ ...data, location: e.target.value })}
            className='w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white'
            placeholder='e.g., Tel Aviv, Israel'
          />
        </div>

        {/* Bio */}
        <div>
          <label htmlFor='bio' className='block text-sm font-medium mb-2'>
            Bio
          </label>
          <textarea
            id='bio'
            value={data.bio || ''}
            onChange={e => onChange({ ...data, bio: e.target.value })}
            rows={4}
            maxLength={500}
            className='w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white resize-none'
            placeholder='Tell us about yourself...'
          />
          {data.bio && <p className='text-xs text-muted-foreground mt-1'>{data.bio.length}/500 characters</p>}
          {errors.bio && <p className='text-sm text-red-500 mt-1'>{errors.bio}</p>}
        </div>

        {/* Navigation Buttons */}
        <div className='flex gap-3 pt-4'>
          <button
            onClick={onBack}
            className='flex-1 px-6 py-3 border border-border hover:bg-gray-50 dark:hover:bg-gray-800 text-foreground font-semibold rounded-lg transition-colors'
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className='flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          >
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
}
