/**
 * Forgot/Reset Password Form
 */

import { useState } from 'react';
import { useForgotPassword, useResetPassword } from '../../shared/hooks/useAuth';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useSearchParams } from 'react-router-dom';

export function RestorePasswordForm() {
  const [searchParams] = useSearchParams();
  const isResetMode = searchParams.get('token');
  const forgotPasswordMutation = useForgotPassword();
  const resetPasswordMutation = useResetPassword();

  const [email, setEmail] = useState('');
  const [token, setToken] = useState(searchParams.get('token') || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    token?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const validateForgot = () => {
    const newErrors: { email?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateReset = () => {
    const newErrors: { token?: string; newPassword?: string; confirmPassword?: string } = {};

    if (!token) {
      newErrors.token = 'Reset token is required';
    }

    if (!newPassword) {
      newErrors.newPassword = 'Password is required';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForgot()) {
      return;
    }

    forgotPasswordMutation.mutate({ email });
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateReset()) {
      return;
    }

    resetPasswordMutation.mutate({ token, newPassword });
  };

  if (isResetMode) {
    return (
      <form onSubmit={handleResetSubmit} className='space-y-4'>
        {/* Reset Token Input (pre-filled from URL) */}
        <div className='space-y-2'>
          <label htmlFor='token' className='text-sm font-medium'>
            Reset Token
          </label>
          <Input
            id='token'
            type='text'
            placeholder='Enter reset token'
            value={token}
            onChange={e => setToken(e.target.value)}
            disabled={resetPasswordMutation.isPending}
            className={errors.token ? 'border-destructive' : ''}
          />
          {errors.token && <p className='text-sm text-destructive'>{errors.token}</p>}
        </div>

        {/* New Password Input */}
        <div className='space-y-2'>
          <label htmlFor='new-password' className='text-sm font-medium'>
            New Password
          </label>
          <Input
            id='new-password'
            type='password'
            placeholder='••••••••'
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            disabled={resetPasswordMutation.isPending}
            className={errors.newPassword ? 'border-destructive' : ''}
          />
          {errors.newPassword && <p className='text-sm text-destructive'>{errors.newPassword}</p>}
        </div>

        {/* Confirm Password Input */}
        <div className='space-y-2'>
          <label htmlFor='confirm-password' className='text-sm font-medium'>
            Confirm Password
          </label>
          <Input
            id='confirm-password'
            type='password'
            placeholder='••••••••'
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            disabled={resetPasswordMutation.isPending}
            className={errors.confirmPassword ? 'border-destructive' : ''}
          />
          {errors.confirmPassword && <p className='text-sm text-destructive'>{errors.confirmPassword}</p>}
        </div>

        {/* Submit Button */}
        <Button type='submit' className='w-full' disabled={resetPasswordMutation.isPending}>
          {resetPasswordMutation.isPending ? 'Resetting password...' : 'Reset Password'}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleForgotSubmit} className='space-y-4'>
      <p className='text-sm text-muted-foreground'>
        Enter your email address and we&apos;ll send you a link to reset your password.
      </p>

      {/* Email Input */}
      <div className='space-y-2'>
        <label htmlFor='forgot-email' className='text-sm font-medium'>
          Email
        </label>
        <Input
          id='forgot-email'
          type='email'
          placeholder='your@email.com'
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={forgotPasswordMutation.isPending}
          className={errors.email ? 'border-destructive' : ''}
        />
        {errors.email && <p className='text-sm text-destructive'>{errors.email}</p>}
      </div>

      {/* Submit Button */}
      <Button type='submit' className='w-full' disabled={forgotPasswordMutation.isPending}>
        {forgotPasswordMutation.isPending ? 'Sending...' : 'Send Reset Link'}
      </Button>
    </form>
  );
}
