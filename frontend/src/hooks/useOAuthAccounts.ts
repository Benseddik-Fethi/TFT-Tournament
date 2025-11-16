/**
 * OAuth Accounts Hook
 *
 * React Query hooks for managing OAuth accounts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService, OAuthAccount } from '@/services/api/user.service';
import { useAuthStore } from '@/stores/authStore';

/**
 * Hook to fetch OAuth accounts
 */
export function useOAuthAccounts() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['oauth-accounts'],
    queryFn: () => userService.getOAuthAccounts(),
    enabled: isAuthenticated,
  });
}

/**
 * Hook to unlink an OAuth account
 */
export function useUnlinkOAuthAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (provider: string) => userService.unlinkOAuthAccount(provider),
    onSuccess: (_, provider) => {
      // Optimistically update the cache
      queryClient.setQueryData<OAuthAccount[]>(['oauth-accounts'], (old) => {
        if (!old) return old;
        return old.filter((account) => account.provider !== provider);
      });

      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['oauth-accounts'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}

/**
 * Hook to get user profile with OAuth accounts
 */
export function useUserProfile() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => userService.getProfile(),
    enabled: isAuthenticated,
  });
}
