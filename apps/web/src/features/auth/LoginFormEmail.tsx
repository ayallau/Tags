/**
 * Email/Password Login Form
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../../shared/hooks/useAuth';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { LoginFormGoogle } from './LoginFormGoogle';

export function LoginFormEmail() {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    loginMutation.mutate({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      {/* Email Input */}
      <div className='space-y-2'>
        <label htmlFor='email' className='text-sm font-medium'>
          Email
        </label>
        <Input
          id='email'
          type='email'
          placeholder='your@email.com'
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={loginMutation.isPending}
          className={errors.email ? 'border-destructive' : ''}
        />
        {errors.email && <p className='text-sm text-destructive'>{errors.email}</p>}
      </div>

      {/* Password Input */}
      <div className='space-y-2'>
        <label htmlFor='password' className='text-sm font-medium'>
          Password
        </label>
        <Input
          id='password'
          type='password'
          placeholder='••••••••'
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={loginMutation.isPending}
          className={errors.password ? 'border-destructive' : ''}
        />
        {errors.password && <p className='text-sm text-destructive'>{errors.password}</p>}
      </div>

      {/* Forgot Password Link */}
      <div className='text-right'>
        <button
          type='button'
          onClick={() => navigate('/welcome?reset=true')}
          className='text-sm text-primary hover:underline'
        >
          Forgot password?
        </button>
      </div>

      {/* Submit Button */}
      <Button type='submit' className='w-full' disabled={loginMutation.isPending}>
        {loginMutation.isPending ? 'Logging in...' : 'Login'}
      </Button>

      {/* Google Login Button */}
      <LoginFormGoogle mode='login' />
    </form>
  );
}
