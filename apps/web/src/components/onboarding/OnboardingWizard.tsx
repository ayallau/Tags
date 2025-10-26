/**
 * OnboardingWizard Component
 * Multi-step wizard for new user onboarding
 */

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { StepProgress } from './StepProgress';
import { WelcomeStep } from './steps/WelcomeStep';
import { ProfileInfoStep } from './steps/ProfileInfoStep';
import { SelectTagsStep } from './steps/SelectTagsStep';
import { FinishStep } from './steps/FinishStep';
import { useUpdateUser } from '../../shared/hooks/useUser';
import type { Tag } from '../../shared/types/tag';

interface ProfileInfo {
  bio?: string;
  location?: string;
}

type OnboardingStep = 'welcome' | 'profile' | 'tags' | 'finish';

const TOTAL_STEPS = 4;

export function OnboardingWizard() {
  const navigate = useNavigate();
  const updateUserMutation = useUpdateUser();

  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>({});
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stepIndex = {
    welcome: 1,
    profile: 2,
    tags: 3,
    finish: 4,
  }[currentStep];

  const handleNext = () => {
    switch (currentStep) {
      case 'welcome':
        setCurrentStep('profile');
        break;
      case 'profile':
        setCurrentStep('tags');
        break;
      case 'tags':
        setCurrentStep('finish');
        break;
      case 'finish':
        handleSubmit();
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'profile':
        setCurrentStep('welcome');
        break;
      case 'tags':
        setCurrentStep('profile');
        break;
      case 'finish':
        setCurrentStep('tags');
        break;
    }
  };

  const handleSelectTag = (tag: Tag) => {
    if (!selectedTags.some(t => t._id === tag._id)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter(t => t._id !== tagId));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Prepare user data (filter out undefined values)
      const updateData: Record<string, unknown> = {
        tags: selectedTags.map(t => t._id),
      };

      if (profileInfo.bio) updateData['bio'] = profileInfo.bio;
      if (profileInfo.location) updateData['location'] = profileInfo.location;

      await updateUserMutation.mutateAsync(updateData);

      // Navigate to discover page
      navigate('/discover');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to submit onboarding data:', error);
      // TODO: Show error toast
      setIsSubmitting(false);
    }
  };

  const handleContinueLater = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Prepare partial user data with only what we have so far
      const updateData: Record<string, unknown> = {};

      if (profileInfo.bio) updateData['bio'] = profileInfo.bio;
      if (profileInfo.location) updateData['location'] = profileInfo.location;
      if (selectedTags.length > 0) {
        updateData['tags'] = selectedTags.map(t => t._id);
      }

      // Only update if we have some data
      if (Object.keys(updateData).length > 0) {
        await updateUserMutation.mutateAsync(updateData);
      }

      setIsSubmitting(false);

      // Navigate to home page
      navigate('/discover');
    } catch (error) {
      // Log error but still navigate
      // eslint-disable-next-line no-console
      console.error('Failed to save partial onboarding data:', error);
      setIsSubmitting(false);

      // Even if save fails, navigate to home
      navigate('/discover');
    }
  };

  return (
    <div className='min-h-screen bg-background p-4'>
      <div className='max-w-2xl mx-auto space-y-8'>
        {/* Progress Indicator */}
        <StepProgress currentStep={stepIndex} totalSteps={TOTAL_STEPS} />

        {/* Step Content */}
        <div className='bg-surface border border-border rounded-lg p-8 min-h-[400px]'>
          <AnimatePresence mode='wait'>
            {currentStep === 'welcome' && <WelcomeStep key='welcome' onNext={handleNext} />}

            {currentStep === 'profile' && (
              <ProfileInfoStep
                key='profile'
                data={profileInfo}
                onChange={setProfileInfo}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {currentStep === 'tags' && (
              <SelectTagsStep
                key='tags'
                selectedTags={selectedTags}
                onSelectTag={handleSelectTag}
                onRemoveTag={handleRemoveTag}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {currentStep === 'finish' && (
              <FinishStep
                key='finish'
                profileInfo={profileInfo}
                selectedTags={selectedTags}
                onSubmit={handleSubmit}
                onBack={handleBack}
                isSubmitting={isSubmitting}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Continue Later Button - shown only in profile and tags steps */}
        {(currentStep === 'profile' || currentStep === 'tags') && (
          <div className='text-center'>
            <button
              onClick={handleContinueLater}
              disabled={isSubmitting}
              className='px-6 py-3 text-muted-foreground hover:text-foreground font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Continue Later
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
