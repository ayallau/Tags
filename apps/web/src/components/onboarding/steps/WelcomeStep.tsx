/**
 * WelcomeStep Component
 * First step of onboarding wizard
 */

import { motion } from 'framer-motion';

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className='space-y-8'
    >
      <div className='text-center space-y-4'>
        <h2 className='text-3xl font-bold text-foreground'>Welcome to Tags!</h2>
        <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
          Let's set up your profile. This will help us connect you with people who share your interests.
        </p>
      </div>

      <div className='max-w-md mx-auto space-y-6'>
        <div className='bg-surface border border-border rounded-lg p-6 space-y-4'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold'>
              1
            </div>
            <div>
              <h3 className='font-semibold text-foreground'>Profile Info</h3>
              <p className='text-sm text-muted-foreground'>Tell us a bit about yourself</p>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold'>
              2
            </div>
            <div>
              <h3 className='font-semibold text-foreground'>Select Tags</h3>
              <p className='text-sm text-muted-foreground'>Choose your interests</p>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold'>
              3
            </div>
            <div>
              <h3 className='font-semibold text-foreground'>You're Done!</h3>
              <p className='text-sm text-muted-foreground'>Start discovering people</p>
            </div>
          </div>
        </div>

        <button
          onClick={onNext}
          className='w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
        >
          Let's Get Started
        </button>
      </div>
    </motion.div>
  );
}
