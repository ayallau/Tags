import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../shared/lib/utils';

const navigationItems = [
  { name: 'Home', href: '/', icon: '🏠' },
  { name: 'Discover', href: '/discover', icon: '🔍' },
  { name: 'Matches', href: '/matches', icon: '💕' },
  { name: 'Bookmarks', href: '/bookmarks', icon: '⭐' },
  { name: 'Friends', href: '/friends', icon: '👥' },
  { name: 'Chat', href: '/chat', icon: '💬' },
];

export function Navbar() {
  const location = useLocation();

  return (
    <nav className='border-b bg-background'>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-center gap-1'>
          {navigationItems.map(item => {
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors hover:text-primary',
                  'border-b-2 border-transparent hover:border-muted-foreground/20',
                  'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
                  isActive ? 'text-primary border-primary' : 'text-muted-foreground'
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
