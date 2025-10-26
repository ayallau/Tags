/**
 * Google OAuth Login Button
 */

import { Button } from '../../components/ui/button';
import { getApiEndpoint } from '../../config';

interface LoginFormGoogleProps {
  mode?: 'login' | 'signup';
}

export function LoginFormGoogle({ mode: _mode = 'login' }: LoginFormGoogleProps) {
  const handleGoogleLogin = () => {
    // Redirect to Google OAuth endpoint
    window.location.href = getApiEndpoint('/auth/google');
  };

  return (
    <Button type='button' variant='outline' className='w-full' onClick={handleGoogleLogin}>
      Continue with Google
    </Button>
  );
}
