import { lazy } from 'react';

// Lazy-loaded page components
export const WelcomePage = lazy(() => import('../pages/WelcomePage'));
export const ResetPasswordPage = lazy(() => import('../pages/ResetPasswordPage'));
export const OAuthCallbackPage = lazy(() => import('../pages/OAuthCallbackPage'));
export const HomePage = lazy(() => import('../pages/HomePage'));
export const DiscoverPage = lazy(() => import('../pages/DiscoverPage'));
export const MatchesPage = lazy(() => import('../pages/MatchesPage'));
export const BookmarksPage = lazy(() => import('../pages/BookmarksPage'));
export const FriendsPage = lazy(() => import('../pages/FriendsPage'));
export const ChatPage = lazy(() => import('../pages/ChatPage'));
export const ProfilePage = lazy(() => import('../pages/ProfilePage'));
export const SettingsPage = lazy(() => import('../pages/SettingsPage'));
export const OnboardingPage = lazy(() => import('../pages/OnboardingPage'));

// Route configuration type
export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  title: string;
}

// Route definitions
export const routes: RouteConfig[] = [
  {
    path: '/',
    component: HomePage,
    title: 'Home',
  },
  {
    path: '/onboarding',
    component: OnboardingPage,
    title: 'Onboarding',
  },
  {
    path: '/discover',
    component: DiscoverPage,
    title: 'Discover',
  },
  {
    path: '/matches',
    component: MatchesPage,
    title: 'Matches',
  },
  {
    path: '/bookmarks',
    component: BookmarksPage,
    title: 'Bookmarks',
  },
  {
    path: '/friends',
    component: FriendsPage,
    title: 'Friends',
  },
  {
    path: '/chat',
    component: ChatPage,
    title: 'Chat',
  },
  {
    path: '/profile',
    component: ProfilePage,
    title: 'Profile',
  },
  {
    path: '/settings',
    component: SettingsPage,
    title: 'Settings',
  },
];
