import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../state/authStore';

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();

  // Redirect guests to welcome
  if (!isAuthenticated()) {
    return <Navigate to='/welcome' replace />;
  }

  // Redirect authenticated users to discover
  return <Navigate to='/discover' replace />;
}
