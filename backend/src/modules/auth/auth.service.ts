/**
 * Authentication Service
 *
 * Business logic for authentication operations
 */

import { prisma } from '@/shared/database/client';
import { generateTokenPair, verifyRefreshToken, TokenPair } from '@/shared/utils/jwt.util';
import { UnauthorizedError, NotFoundError } from '@/shared/utils/errors';
import { logger } from '@/shared/utils/logger';

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    username: string;
    avatarUrl: string | null;
    role: string;
    provider: string;
    riotId: string | null;
    createdAt: Date;
  };
  tokens: TokenPair;
}

export class AuthService {
  /**
   * Generate authentication response with tokens
   */
  async generateAuthResponse(userId: string): Promise<AuthResponse> {
    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Generate JWT tokens
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    logger.info('Auth response generated', { userId: user.id });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatarUrl: user.avatarUrl,
        role: user.role,
        provider: user.provider,
        riotId: user.riotId,
        createdAt: user.createdAt,
      },
      tokens,
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<TokenPair> {
    try {
      // Verify refresh token
      const payload = verifyRefreshToken(refreshToken);

      // Verify user still exists
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      // Generate new token pair
      const tokens = generateTokenPair({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      logger.info('Access token refreshed', { userId: user.id });

      return tokens;
    } catch (error) {
      logger.error('Refresh token error', { error });
      throw new UnauthorizedError('Invalid refresh token');
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true,
        role: true,
        provider: true,
        riotId: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  /**
   * Logout user (client-side token deletion, no server action needed with JWT)
   * This method exists for future blacklist implementation if needed
   */
  async logout(userId: string): Promise<void> {
    logger.info('User logged out', { userId });
    // In a JWT-based system, logout is handled client-side by deleting the token
    // If using Redis for token blacklist (V2), add token to blacklist here
  }

  /**
   * Delete user account
   */
  async deleteAccount(userId: string): Promise<void> {
    await prisma.user.delete({
      where: { id: userId },
    });

    logger.info('User account deleted', { userId });
  }
}
