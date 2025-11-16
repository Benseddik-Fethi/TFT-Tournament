/**
 * Linked Accounts List - Organism Component
 *
 * Complete feature for managing linked OAuth accounts
 * Displays current accounts and allows linking new ones
 * Follows atomic design principles
 */

import { FC } from 'react';
import { OAuthProviderButton, OAuthProvider } from '@/components/atoms';
import { LinkedAccountCard } from '@/components/molecules';
import { useOAuthAccounts, useUnlinkOAuthAccount } from '@/hooks/useOAuthAccounts';
import { useOAuthLogin } from '@/hooks/useAuth';

const ALL_PROVIDERS: OAuthProvider[] = ['google', 'discord', 'twitch'];

export const LinkedAccountsList: FC = () => {
  const { data: accounts, isLoading, error } = useOAuthAccounts();
  const { mutateAsync: unlinkAccount, isPending: isUnlinking } =
    useUnlinkOAuthAccount();
  const { login } = useOAuthLogin();

  // Determine which providers are already linked
  const linkedProviders = new Set(accounts?.map((a) => a.provider) || []);
  const availableProviders = ALL_PROVIDERS.filter(
    (p) => !linkedProviders.has(p)
  );

  const handleUnlink = async (provider: string) => {
    try {
      await unlinkAccount(provider);
    } catch (err) {
      console.error('Failed to unlink account:', err);
      // TODO: Show error toast
    }
  };

  const handleLinkAccount = (provider: OAuthProvider) => {
    // Trigger OAuth flow - backend will automatically link
    login(provider);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-24 bg-slate-900 border border-slate-800 rounded-lg animate-pulse" />
        <div className="h-24 bg-slate-900 border border-slate-800 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
        <p className="text-red-400 text-sm">
          Failed to load linked accounts. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h3 className="text-lg font-display text-slate-50 mb-1">
          Linked Accounts
        </h3>
        <p className="text-sm text-slate-400">
          Manage your connected OAuth accounts. You can log in with any linked
          account.
        </p>
      </div>

      {/* Current Linked Accounts */}
      {accounts && accounts.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-300">
            Connected Accounts ({accounts.length})
          </h4>
          {accounts.map((account, index) => (
            <LinkedAccountCard
              key={account.id}
              provider={account.provider}
              email={account.email}
              createdAt={new Date(account.createdAt)}
              isPrimary={index === 0} // First account is primary
              onUnlink={() => handleUnlink(account.provider)}
              loading={isUnlinking}
            />
          ))}
        </div>
      )}

      {/* Available Providers to Link */}
      {availableProviders.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-300">
            Link Additional Accounts
          </h4>
          <p className="text-xs text-slate-500">
            Link more accounts to have multiple ways to sign in
          </p>

          <div className="space-y-2">
            {availableProviders.map((provider) => (
              <OAuthProviderButton
                key={provider}
                provider={provider}
                variant="outline"
                onClick={() => handleLinkAccount(provider)}
              >
                Link {provider.charAt(0).toUpperCase() + provider.slice(1)}
              </OAuthProviderButton>
            ))}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-brand-hextech-500/10 border border-brand-hextech-500/20 rounded-lg p-4">
        <div className="flex gap-3">
          <svg
            className="w-5 h-5 text-brand-hextech-500 flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="text-sm text-slate-300 space-y-1">
            <p className="font-medium">Account Linking</p>
            <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
              <li>You must keep at least one account linked to access TFT Arena</li>
              <li>
                Linking additional accounts is automatic - just sign in with a new
                provider
              </li>
              <li>Your profile and tournament data is shared across all linked accounts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
