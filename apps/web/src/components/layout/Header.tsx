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
    <header
      className='sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700'
      style={{ backgroundColor: 'hsl(var(--background))' }}
    >
      <div className='container mx-auto px-4'>
        <div className='flex h-16 items-center justify-between'>
          {/* Left side - Logo and App Name */}
          <Link
            to='/'
            className='flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none rounded-md'
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
                  <DropdownMenuTrigger className='flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none cursor-pointer'>
                    {user.avatarUrl && (
                      <img src={user.avatarUrl} alt={user.username || 'User'} className='h-6 w-6 rounded-full' />
                    )}
                    <span>{user.username || user.email || 'User'}</span>
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
                      <Link to='/profile' className='flex items-center'>
                        <span aria-hidden='true'>👤</span>
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to='/settings' className='flex items-center'>
                        <span aria-hidden='true'>⚙️</span>
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to='/bookmarks' className='flex items-center'>
                        <span aria-hidden='true'>⭐</span>
                        <span>Bookmarks</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                      className='text-red-600 dark:text-red-500'
                    >
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
