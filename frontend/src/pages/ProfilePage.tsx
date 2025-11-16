/**
 * Profile Page
 *
 * User profile with OAuth account management
 */

import { LinkedAccountsList } from '@/components/organisms';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useOAuthAccounts';

export function ProfilePage() {
  const { user: authUser } = useAuth();
  const { data: profile, isLoading } = useUserProfile();

  const displayUser = profile || authUser;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-gold-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-hextech-900 to-slate-900 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {displayUser?.avatarUrl ? (
                <img
                  src={displayUser.avatarUrl}
                  alt={displayUser.username}
                  className="w-24 h-24 rounded-full border-2 border-brand-gold-500"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center">
                  <span className="text-3xl font-display text-slate-400">
                    {displayUser?.username?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-display text-slate-50 mb-1">
                {displayUser?.username || 'User'}
              </h1>
              <p className="text-slate-400 mb-3">{displayUser?.email}</p>

              {/* Role Badge */}
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-gold-500/20 text-brand-gold-500 text-sm font-medium">
                {displayUser?.role?.toUpperCase() || 'PLAYER'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Info Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-display text-slate-50 mb-4">
                Profile Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-400 block mb-1">
                    Username
                  </label>
                  <p className="text-slate-50">{displayUser?.username}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-400 block mb-1">
                    Email
                  </label>
                  <p className="text-slate-50">{displayUser?.email}</p>
                </div>

                {displayUser?.riotId && (
                  <div>
                    <label className="text-sm font-medium text-slate-400 block mb-1">
                      Riot ID
                    </label>
                    <p className="text-slate-50">{displayUser.riotId}</p>
                  </div>
                )}

                {/* Edit Profile Button (V2) */}
                <button
                  disabled
                  className="mt-4 px-4 py-2 bg-brand-gold-500/20 text-brand-gold-500 rounded-lg text-sm font-medium cursor-not-allowed opacity-50"
                >
                  Edit Profile (Coming Soon)
                </button>
              </div>
            </div>

            {/* OAuth Accounts Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <LinkedAccountsList />
            </div>
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-6">
            {/* Stats Card (V2) */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-display text-slate-50 mb-4">Stats</h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Tournaments</span>
                  <span className="text-lg font-medium text-slate-50">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Best Placement</span>
                  <span className="text-lg font-medium text-slate-50">-</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Total Points</span>
                  <span className="text-lg font-medium text-slate-50">0</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-4 text-center">
                Join a tournament to start building your stats!
              </p>
            </div>

            {/* Account Info */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-display text-slate-50 mb-4">Account</h3>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-slate-400">Member since</span>
                  <p className="text-slate-50 mt-1">
                    {displayUser?.createdAt
                      ? new Date(displayUser.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : '-'}
                  </p>
                </div>

                {displayUser?.lastLoginAt && (
                  <div className="pt-2">
                    <span className="text-slate-400">Last login</span>
                    <p className="text-slate-50 mt-1">
                      {new Date(displayUser.lastLoginAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
