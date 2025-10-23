import { ThemeToggle } from '../ui/ThemeToggle';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto px-4'>
        <div className='flex h-16 items-center justify-between'>
          {/* Left side - Logo and App Name */}
          <Link to='/' className='flex items-center gap-3 hover:opacity-80 transition-opacity'>
            <img src={logo} alt='Tags Logo' className='h-16 w-16' />
            <h1 className='text-xl font-bold text-foreground'>Tags for Dating</h1>
          </Link>

          {/* Right side - Theme Toggle and User Menu */}
          <div className='flex items-center gap-2'>
            <ThemeToggle />

            {/* User Menu Placeholder */}
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-muted'>
              <span className='text-muted-foreground text-sm'>U</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
