import { ThemeToggle } from '../ui/ThemeToggle';
import { useAuthStore } from '../../state/authStore';
import { useLogout } from '../../shared/hooks/useAuth';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export function Header() {
  const { user, isAuthenticated } = useAuthStore();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60'>
      <div className='container mx-auto px-4'>
        <div className='flex h-16 items-center justify-between'>
          {/* Left side - Logo and App Name */}
          <Link
            to={isAuthenticated() ? '/discover' : '/'}
            className='flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-md'
          >
            <img src={logo} alt='Tags Logo' className='h-16 w-16' loading='lazy' />
            <h1 className='text-xl font-bold text-foreground'>Tags for Dating</h1>
          </Link>

          {/* Right side - Theme Toggle and User Menu */}
          <div className='flex items-center gap-2'>
            <ThemeToggle />

            {/* User Menu - Show different UI based on auth state */}
            {isAuthenticated() && user && (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger className='flex h-8 w-8 items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background'>
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.username || 'User'} className='h-8 w-8 rounded-full' />
                    ) : (
                      <span className='text-muted-foreground text-sm' aria-hidden='true'>
                        {(user.username || '').charAt(0).toUpperCase() || 'U'}
                      </span>
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end' className='w-56'>
                    {user.username && (
                      <div className='px-2 py-1.5 text-sm'>
                        <div className='font-medium'>{user.username}</div>
                        {user.email && <div className='text-xs text-muted-foreground'>{user.email}</div>}
                      </div>
                    )}
                    {!user.username && user.email && (
                      <div className='px-2 py-1.5 text-sm'>
                        <div className='font-medium'>{user.email}</div>
                      </div>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to='/profile'>Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to='/settings'>Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} disabled={logoutMutation.isPending}>
                      {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
            {!isAuthenticated() && (
              <div className='flex items-center gap-2'>
                <Link to='/welcome'>
                  <button className='text-sm font-medium text-foreground hover:text-primary transition-colors'>
                    Login
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
