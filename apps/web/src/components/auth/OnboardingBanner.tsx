/**
 * OnboardingBanner - Displays a banner for incomplete onboarding
 */

import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../state/authStore';
import { Button } from '../ui/button';

export function OnboardingBanner() {
  const navigate = useNavigate();
  const { isAuthenticated, isOnboardingComplete } = useAuthStore();

  // Only show banner if authenticated but onboarding incomplete
  if (!isAuthenticated() || isOnboardingComplete()) {
    return null;
  }

  const handleCompleteOnboarding = () => {
    navigate('/onboarding');
  };

  return (
    <div className='bg-primary text-primary-foreground py-3 px-4 shadow-sm' role='alert' aria-live='polite'>
      <div className='container mx-auto flex items-center justify-between gap-4 max-w-7xl'>
        <p className='text-sm font-medium'>
          You haven&apos;t completed your profile setup yet. Complete it to start matching with others.
        </p>
        <Button
          onClick={handleCompleteOnboarding}
          variant='outline'
          size='lg'
          className='border-primary-foreground/20 bg-background/10 text-primary-foreground hover:bg-background/20 hover:border-primary-foreground/40 transition-all hover:shadow-sm text-sm whitespace-nowrap'
        >
          Complete Setup
        </Button>
      </div>
    </div>
  );
}
