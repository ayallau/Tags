/**
 * Email/Password Signup Form
 */

import { useState } from 'react';
import { useSignup } from '../../shared/hooks/useAuth';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { LoginFormGoogle } from './LoginFormGoogle';

export function SignupForm() {
  const signupMutation = useSignup();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = () => {
    const newErrors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    signupMutation.mutate({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      {/* Email Input */}
      <div className='space-y-2'>
        <label htmlFor='signup-email' className='text-sm font-medium'>
          Email
        </label>
        <Input
          id='signup-email'
          type='email'
          placeholder='your@email.com'
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={signupMutation.isPending}
          className={errors.email ? 'border-destructive' : ''}
        />
        {errors.email && <p className='text-sm text-destructive'>{errors.email}</p>}
      </div>

      {/* Password Input */}
      <div className='space-y-2'>
        <label htmlFor='signup-password' className='text-sm font-medium'>
          Password
        </label>
        <Input
          id='signup-password'
          type='password'
          placeholder='••••••••'
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={signupMutation.isPending}
          className={errors.password ? 'border-destructive' : ''}
        />
        {errors.password && <p className='text-sm text-destructive'>{errors.password}</p>}
      </div>

      {/* Confirm Password Input */}
      <div className='space-y-2'>
        <label htmlFor='signup-confirm-password' className='text-sm font-medium'>
          Confirm Password
        </label>
        <Input
          id='signup-confirm-password'
          type='password'
          placeholder='••••••••'
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          disabled={signupMutation.isPending}
          className={errors.confirmPassword ? 'border-destructive' : ''}
        />
        {errors.confirmPassword && <p className='text-sm text-destructive'>{errors.confirmPassword}</p>}
      </div>

      {/* Submit Button */}
      <Button type='submit' className='w-full' disabled={signupMutation.isPending}>
        {signupMutation.isPending ? 'Creating account...' : 'Sign Up'}
      </Button>

      {/* Google Signup Button */}
      <LoginFormGoogle mode='signup' />
    </form>
  );
}
