import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import { initializeTheme } from './lib/theme';
import { QueryProvider } from './lib/query';
import { AuthInitializer } from './components/auth/AuthInitializer';

// Initialize theme before React renders to prevent flash
initializeTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryProvider>
      <AuthInitializer>
        <App />
      </AuthInitializer>
    </QueryProvider>
  </React.StrictMode>
);
