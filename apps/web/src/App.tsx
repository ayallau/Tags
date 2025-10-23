import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import './App.css';

function HomePage() {
  return (
    <div className='space-y-6'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold text-foreground mb-4'>Welcome to Tags!</h1>
        <p className='text-lg text-muted-foreground'>Connect with people who share your interests</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <div className='bg-surface border border-border rounded-lg p-6'>
          <h3 className='text-lg font-semibold mb-2'>Discover</h3>
          <p className='text-muted-foreground'>Find new people and interests</p>
        </div>

        <div className='bg-surface border border-border rounded-lg p-6'>
          <h3 className='text-lg font-semibold mb-2'>Matches</h3>
          <p className='text-muted-foreground'>See your compatibility scores</p>
        </div>

        <div className='bg-surface border border-border rounded-lg p-6'>
          <h3 className='text-lg font-semibold mb-2'>Chat</h3>
          <p className='text-muted-foreground'>Connect with your matches</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route
            path='discover'
            element={
              <div className='text-center py-12'>
                <h2 className='text-2xl font-semibold'>Discover Page</h2>
                <p className='text-muted-foreground mt-2'>Coming soon...</p>
              </div>
            }
          />
          <Route
            path='matches'
            element={
              <div className='text-center py-12'>
                <h2 className='text-2xl font-semibold'>Matches Page</h2>
                <p className='text-muted-foreground mt-2'>Coming soon...</p>
              </div>
            }
          />
          <Route
            path='friends'
            element={
              <div className='text-center py-12'>
                <h2 className='text-2xl font-semibold'>Friends Page</h2>
                <p className='text-muted-foreground mt-2'>Coming soon...</p>
              </div>
            }
          />
          <Route
            path='chat'
            element={
              <div className='text-center py-12'>
                <h2 className='text-2xl font-semibold'>Chat Page</h2>
                <p className='text-muted-foreground mt-2'>Coming soon...</p>
              </div>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
