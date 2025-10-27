import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../shared/lib/utils';

const navigationItems = [
  { name: 'Home', href: '/', icon: '🏠' },
  { name: 'Discover', href: '/discover', icon: '🔍' },
  { name: 'Matches', href: '/matches', icon: '💕' },
  // { name: 'Bookmarks', href: '/bookmarks', icon: '⭐' },
  { name: 'Friends', href: '/friends', icon: '👥' },
  { name: 'Chat', href: '/chat', icon: '💬' },
];

export function Navbar() {
  const location = useLocation();

  return (
    <nav
      className='border-b border-gray-200 dark:border-gray-700'
      style={{ backgroundColor: 'hsl(var(--background))' }}
    >
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-center gap-1'>
          {navigationItems.map(item => {
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors rounded-md',
                  'hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none',
                  isActive
                    ? 'text-primary font-semibold bg-gray-100 dark:bg-gray-800'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className='text-base' aria-hidden='true'>
                  {item.icon}
                </span>
                <span className='hidden sm:inline'>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
