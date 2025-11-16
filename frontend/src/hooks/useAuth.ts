/**
 * Authentication Hooks
 *
 * Custom React hooks for authentication
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/api/auth.service';

/**
 * Hook to get current authentication state
 */
export function useAuth() {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
  };
}

/**
 * Hook to get current user data from API
 */
export function useCurrentUser() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['auth', 'currentUser'],
    queryFn: authService.getCurrentUser,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to handle logout
 */
export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Clear auth store
      logout();

      // Clear all queries
      queryClient.clear();

      // Redirect to login
      navigate('/login');
    },
    onError: () => {
      // Even if API call fails, clear local state
      logout();
      queryClient.clear();
      navigate('/login');
    },
  });
}

/**
 * Hook to handle account deletion
 */
export function useDeleteAccount() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: authService.deleteAccount,
    onSuccess: () => {
      logout();
      queryClient.clear();
      navigate('/login');
    },
  });
}

/**
 * Hook to handle OAuth login
 */
export function useOAuthLogin() {
  const login = (provider: 'google' | 'discord' | 'twitch') => {
    const url = authService.getOAuthUrl(provider);
    window.location.href = url;
  };

  return { login };
}
