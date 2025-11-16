/**
 * User API Service
 *
 * API calls for user profile and OAuth account management
 */

import { api } from './api.client';

export interface OAuthAccount {
  id: string;
  provider: 'google' | 'discord' | 'twitch';
  providerId: string;
  email: string | null;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  avatarUrl: string | null;
  role: string;
  riotId: string | null;
  riotPuuid: string | null;
  createdAt: string;
  lastLoginAt: string | null;
  oauthAccounts: OAuthAccount[];
}

export const userService = {
  /**
   * Get current user profile with linked OAuth accounts
   */
  async getProfile(): Promise<UserProfile> {
    const response = await api.get<{ success: boolean; data: UserProfile }>(
      '/users/me'
    );
    return response.data.data;
  },

  /**
   * Get all OAuth accounts for current user
   */
  async getOAuthAccounts(): Promise<OAuthAccount[]> {
    const response = await api.get<{ success: boolean; data: OAuthAccount[] }>(
      '/users/me/oauth-accounts'
    );
    return response.data.data;
  },

  /**
   * Unlink an OAuth account
   */
  async unlinkOAuthAccount(provider: string): Promise<void> {
    await api.delete(`/users/me/oauth-accounts/${provider}`);
  },

  /**
   * Update user profile
   */
  async updateProfile(data: {
    username?: string;
    riotId?: string;
    riotPuuid?: string;
  }): Promise<UserProfile> {
    const response = await api.patch<{ success: boolean; data: UserProfile }>(
      '/users/me',
      data
    );
    return response.data.data;
  },
};
