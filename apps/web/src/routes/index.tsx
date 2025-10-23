import { lazy } from 'react';

// Lazy-loaded page components
export const HomePage = lazy(() => import('../pages/HomePage'));
export const DiscoverPage = lazy(() => import('../pages/DiscoverPage'));
export const MatchesPage = lazy(() => import('../pages/MatchesPage'));
export const FriendsPage = lazy(() => import('../pages/FriendsPage'));
export const ChatPage = lazy(() => import('../pages/ChatPage'));
export const ProfilePage = lazy(() => import('../pages/ProfilePage'));
export const SettingsPage = lazy(() => import('../pages/SettingsPage'));

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
    title: 'Home'
  },
  {
    path: '/discover',
    component: DiscoverPage,
    title: 'Discover'
  },
  {
    path: '/matches',
    component: MatchesPage,
    title: 'Matches'
  },
  {
    path: '/friends',
    component: FriendsPage,
    title: 'Friends'
  },
  {
    path: '/chat',
    component: ChatPage,
    title: 'Chat'
  },
  {
    path: '/profile',
    component: ProfilePage,
    title: 'Profile'
  },
  {
    path: '/settings',
    component: SettingsPage,
    title: 'Settings'
  }
];
