import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { PageSkeleton } from './components/skeletons';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { PublicOnlyRoute } from './components/auth/PublicOnlyRoute';
import { ToastContainer } from './components/ui/toast';
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
  WelcomePage,
  ResetPasswordPage,
} from './routes';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<AppLayout />}>
          {/* Public routes */}
          <Route
            path='welcome'
            element={
              <PublicOnlyRoute>
                <Suspense fallback={<PageSkeleton />}>
                  <WelcomePage />
                </Suspense>
              </PublicOnlyRoute>
            }
          />
          <Route
            path='reset'
            element={
              <PublicOnlyRoute>
                <Suspense fallback={<PageSkeleton />}>
                  <ResetPasswordPage />
                </Suspense>
              </PublicOnlyRoute>
            }
          />

          {/* Root - Home page for authenticated users */}
          <Route
            index
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageSkeleton />}>
                  <HomePage />
                </Suspense>
              </ProtectedRoute>
            }
          />

          {/* Protected onboarding */}
          <Route
            path='onboarding'
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageSkeleton />}>
                  <OnboardingPage />
                </Suspense>
              </ProtectedRoute>
            }
          />

          {/* Protected pages */}
          <Route
            path='discover'
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageSkeleton />}>
                  <DiscoverPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path='matches'
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageSkeleton />}>
                  <MatchesPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path='bookmarks'
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageSkeleton />}>
                  <BookmarksPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path='friends'
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageSkeleton />}>
                  <FriendsPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path='chat'
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageSkeleton />}>
                  <ChatPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path='profile'
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageSkeleton />}>
                  <ProfilePage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path='settings'
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageSkeleton />}>
                  <SettingsPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
