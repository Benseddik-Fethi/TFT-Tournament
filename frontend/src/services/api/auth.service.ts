/**
 * Authentication API Service
 *
 * API calls for authentication endpoints
 */

import apiClient from './client';

export interface User {
  id: string;
  email: string;
  username: string;
  avatarUrl: string | null;
  role: string;
  provider: string;
  riotId: string | null;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    tokens: AuthTokens;
  };
}

export interface RefreshTokenResponse {
  success: boolean;
  data: AuthTokens;
}

export const authService = {
  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<{ success: boolean; data: User }>('/auth/me');
    return response.data.data;
  },

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', {
      refreshToken,
    });
    return response.data.data;
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  /**
   * Delete user account
   */
  async deleteAccount(): Promise<void> {
    await apiClient.delete('/auth/account');
  },

  /**
   * Get OAuth login URL
   */
  getOAuthUrl(provider: 'google' | 'discord' | 'twitch'): string {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    return `${baseUrl}/auth/${provider}`;
  },
};
