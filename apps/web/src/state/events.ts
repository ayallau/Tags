// Global app events constants
export const APP_EVENTS = {
  // Tag events
  TAG_ADDED: 'tag:added',
  TAG_REMOVED: 'tag:removed',
  TAG_UPDATED: 'tag:updated',
  
  // User events
  USER_BLOCKED: 'user:blocked',
  USER_UNBLOCKED: 'user:unblocked',
  USER_HIDDEN: 'user:hidden',
  USER_UNHIDDEN: 'user:unhidden',
  
  // Bookmark events
  BOOKMARK_ADDED: 'bookmark:added',
  BOOKMARK_REMOVED: 'bookmark:removed',
  BOOKMARK_UPDATED: 'bookmark:updated',
  
  // Message events
  MESSAGE_SENT: 'message:sent',
  MESSAGE_RECEIVED: 'message:received',
  MESSAGE_READ: 'message:read',
  
  // Friendship events
  FRIENDSHIP_REQUESTED: 'friendship:requested',
  FRIENDSHIP_ACCEPTED: 'friendship:accepted',
  FRIENDSHIP_REJECTED: 'friendship:rejected',
  
  // Profile events
  PROFILE_UPDATED: 'profile:updated',
  PHOTO_ADDED: 'photo:added',
  PHOTO_REMOVED: 'photo:removed',
  
  // Settings events
  SETTINGS_UPDATED: 'settings:updated',
  THEME_CHANGED: 'theme:changed',
  
  // Auth events
  USER_LOGIN: 'user:login',
  USER_LOGOUT: 'user:logout',
  USER_REGISTERED: 'user:registered',
} as const;

// Type for event names
export type AppEventName = typeof APP_EVENTS[keyof typeof APP_EVENTS];

// Custom event interface
export interface AppEvent<T = unknown> extends CustomEvent<T> {
  detail: T;
}

// Event listener type
export type AppEventListener<T = unknown> = (event: AppEvent<T>) => void;

// Dispatch app event helper with SSR safety
export function dispatchAppEvent<T = unknown>(
  eventName: AppEventName,
  payload?: T
): void {
  // Guard for SSR - only dispatch if window is available
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const event = new CustomEvent(eventName, {
      detail: payload,
      bubbles: true,
      cancelable: true,
    });

    window.dispatchEvent(event);
  } catch (error) {
    console.warn(`Failed to dispatch event ${eventName}:`, error);
  }
}

// Listen to app event helper with SSR safety
export function listenToAppEvent<T = unknown>(
  eventName: AppEventName,
  listener: AppEventListener<T>
): () => void {
  // Guard for SSR - return no-op cleanup if window is not available
  if (typeof window === 'undefined') {
    return () => {};
  }

  try {
    window.addEventListener(eventName, listener as EventListener);
    
    // Return cleanup function
    return () => {
      window.removeEventListener(eventName, listener as EventListener);
    };
  } catch (error) {
    console.warn(`Failed to listen to event ${eventName}:`, error);
    return () => {};
  }
}

// React hook for listening to app events
export function useAppEvent<T = unknown>(
  eventName: AppEventName,
  listener: AppEventListener<T>,
  deps: React.DependencyList = []
): void {
  React.useEffect(() => {
    return listenToAppEvent(eventName, listener);
  }, [eventName, ...deps]);
}

// Import React for the hook
import React from 'react';
