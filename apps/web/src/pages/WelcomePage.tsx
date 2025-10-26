/**
 * Welcome Page - Landing page with login/signup options
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LoginFormEmail } from '../features/auth/LoginFormEmail';
import { SignupForm } from '../features/auth/SignupForm';
import logo from '../assets/logo_128.png';
import { useAuthStore } from '../state/authStore';

type AuthMode = 'login' | 'signup';

export default function WelcomePage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const isAuthenticated = useAuthStore(state => state.isAuthenticated());

  // If already authenticated, redirect (handled by route guard)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className='min-h-dvh flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4'>
      <div className='w-full max-w-md space-y-8'>
        {/* Logo and Title */}
        <div className='text-center space-y-4'>
          <img src={logo} alt='Tags Logo' className='h-24 w-24 mx-auto' />
          <h1 className='text-4xl font-bold text-foreground'>Welcome to Tags</h1>
          <p className='text-muted-foreground'>Connect with people who share your interests</p>
        </div>

        {/* Tabs */}
        <div className='flex rounded-lg bg-muted p-1'>
          <button
            onClick={() => setMode('login')}
            className={`flex-1 rounded-md py-2 text-center font-medium transition-colors ${
              mode === 'login'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 rounded-md py-2 text-center font-medium transition-colors ${
              mode === 'signup'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Auth Forms */}
        <div className='bg-card rounded-lg border p-6 shadow-sm'>
          {mode === 'login' ? <LoginFormEmail /> : <SignupForm />}
        </div>

        {/* Footer Links */}
        <div className='text-center space-y-2 text-sm text-muted-foreground'>
          <p>
            By continuing, you agree to our{' '}
            <Link to='/terms' className='underline hover:text-foreground'>
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to='/privacy' className='underline hover:text-foreground'>
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
