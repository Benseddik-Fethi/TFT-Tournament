/**
 * Authentication Provider
 *
 * Wraps the app and initializes authentication state
 */

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useCurrentUser } from '@/hooks/useAuth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, setLoading, setUser } = useAuthStore();
  const { data: user, isLoading, error } = useCurrentUser();

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  useEffect(() => {
    if (error && isAuthenticated) {
      // If user query fails but we think we're authenticated,
      // it means the token is invalid
      useAuthStore.getState().logout();
    }
  }, [error, isAuthenticated]);

  return <>{children}</>;
}
