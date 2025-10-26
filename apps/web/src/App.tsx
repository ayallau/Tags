import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { PageSkeleton } from './components/skeletons';
import {
  HomePage,
  DiscoverPage,
  MatchesPage,
  BookmarksPage,
  FriendsPage,
  ChatPage,
  ProfilePage,
  SettingsPage,
  OnboardingPage,
} from './routes';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<AppLayout />}>
          <Route
            index
            element={
              <Suspense fallback={<PageSkeleton />}>
                <HomePage />
              </Suspense>
            }
          />
          <Route
            path='onboarding'
            element={
              <Suspense fallback={<PageSkeleton />}>
                <OnboardingPage />
              </Suspense>
            }
          />
          <Route
            path='discover'
            element={
              <Suspense fallback={<PageSkeleton />}>
                <DiscoverPage />
              </Suspense>
            }
          />
          <Route
            path='matches'
            element={
              <Suspense fallback={<PageSkeleton />}>
                <MatchesPage />
              </Suspense>
            }
          />
          <Route
            path='bookmarks'
            element={
              <Suspense fallback={<PageSkeleton />}>
                <BookmarksPage />
              </Suspense>
            }
          />
          <Route
            path='friends'
            element={
              <Suspense fallback={<PageSkeleton />}>
                <FriendsPage />
              </Suspense>
            }
          />
          <Route
            path='chat'
            element={
              <Suspense fallback={<PageSkeleton />}>
                <ChatPage />
              </Suspense>
            }
          />
          <Route
            path='profile'
            element={
              <Suspense fallback={<PageSkeleton />}>
                <ProfilePage />
              </Suspense>
            }
          />
          <Route
            path='settings'
            element={
              <Suspense fallback={<PageSkeleton />}>
                <SettingsPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
