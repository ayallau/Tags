import { ThemeToggle } from '../ui/ThemeToggle';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60'>
      <div className='container mx-auto px-4'>
        <div className='flex h-16 items-center justify-between'>
          {/* Left side - Logo and App Name */}
          <Link
            to='/'
            className='flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-md'
          >
            <img src={logo} alt='Tags Logo' className='h-16 w-16' loading='lazy' />
            <h1 className='text-xl font-bold text-foreground'>Tags for Dating</h1>
          </Link>

          {/* Right side - Theme Toggle and User Menu */}
          <div className='flex items-center gap-2'>
            <ThemeToggle />

            {/* User Menu with Profile/Settings Links */}
            <div className='flex items-center gap-1'>
              <Link
                to='/profile'
                className='flex h-8 w-8 items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background'
                aria-label='Go to profile'
              >
                <span className='text-muted-foreground text-sm' aria-hidden='true'>U</span>
              </Link>
              <Link
                to='/settings'
                className='flex h-8 w-8 items-center justify-center rounded-md bg-muted hover:bg-muted/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background'
                aria-label='Go to settings'
              >
                <span className='text-muted-foreground text-sm' aria-hidden='true'>⚙</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
