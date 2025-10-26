import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function AppLayout() {
  return (
    <div className='min-h-dvh flex flex-col'>
      {/* Skip to content link */}
      <a
        href='#main-content'
        className='sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background'
      >
        Skip to main content
      </a>

      <Header />
      <Navbar />

      <main id='main-content' className='flex-1 container mx-auto px-4 py-6 max-w-7xl'>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
