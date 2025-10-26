/**
 * Reset Password Page - Shows forgot password form or reset form based on token
 */

import { RestorePasswordForm } from '../features/auth/RestorePasswordForm';
import { useSearchParams } from 'react-router-dom';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const isResetMode = Boolean(token);

  return (
    <div className='min-h-dvh flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4'>
      <div className='w-full max-w-md space-y-8'>
        <div className='text-center space-y-4'>
          <h1 className='text-4xl font-bold text-foreground'>{isResetMode ? 'Reset Password' : 'Forgot Password'}</h1>
          <p className='text-muted-foreground'>
            {isResetMode ? 'Enter your new password below' : 'Enter your email and we&apos;ll send you a reset link'}
          </p>
        </div>

        <div className='bg-card rounded-lg border p-6 shadow-sm'>
          <RestorePasswordForm />
        </div>
      </div>
    </div>
  );
}

