import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function AppLayout() {
  return (
    <div className="min-h-dvh flex flex-col" dir="rtl">
      <Header />
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
}
