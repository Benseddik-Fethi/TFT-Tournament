/**
 * Protected Route Component
 *
 * Redirects to login if user is not authenticated
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-gold-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role if required
  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-display text-slate-50">Access Denied</h1>
          <p className="mt-4 text-slate-400">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Required role: {requiredRole}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
