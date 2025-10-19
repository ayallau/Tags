import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export function AppLayout() {
  return (
    <div className='min-h-dvh flex flex-col'>
      <Header />

      <main className='flex-1 p-4'>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
