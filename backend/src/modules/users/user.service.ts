/**
 * User Service
 *
 * Business logic for user operations
 */

import { prisma } from '@/shared/database/client';
import { NotFoundError, BadRequestError, ForbiddenError } from '@/shared/utils/errors';
import { logger } from '@/shared/utils/logger';

export interface OAuthAccountInfo {
  id: string;
  provider: string;
  providerId: string;
  email: string | null;
  createdAt: Date;
}

export interface UserWithAccounts {
  id: string;
  email: string;
  username: string;
  avatarUrl: string | null;
  role: string;
  riotId: string | null;
  riotPuuid: string | null;
  createdAt: Date;
  lastLoginAt: Date | null;
  oauthAccounts: OAuthAccountInfo[];
}

export class UserService {
  /**
   * Get user profile with all linked OAuth accounts
   */
  async getUserWithAccounts(userId: string): Promise<UserWithAccounts> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        oauthAccounts: {
          select: {
            id: true,
            provider: true,
            providerId: true,
            email: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  /**
   * Get all OAuth accounts for a user
   */
  async getOAuthAccounts(userId: string): Promise<OAuthAccountInfo[]> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        oauthAccounts: {
          select: {
            id: true,
            provider: true,
            providerId: true,
            email: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user.oauthAccounts;
  }

  /**
   * Unlink an OAuth account
   * Cannot unlink if it's the only account
   */
  async unlinkOAuthAccount(userId: string, provider: string): Promise<void> {
    // Check if user exists and get their OAuth accounts
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        oauthAccounts: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Prevent unlinking if it's the only account
    if (user.oauthAccounts.length <= 1) {
      throw new BadRequestError(
        'Cannot unlink the only OAuth account. You must have at least one way to log in.'
      );
    }

    // Find the OAuth account to unlink
    const oauthAccount = user.oauthAccounts.find(
      (account) => account.provider === provider
    );

    if (!oauthAccount) {
      throw new NotFoundError(`No ${provider} account linked to this user`);
    }

    // Delete the OAuth account
    await prisma.oAuthAccount.delete({
      where: { id: oauthAccount.id },
    });

    logger.info('OAuth account unlinked', {
      userId,
      provider,
      remainingAccounts: user.oauthAccounts.length - 1,
    });
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    data: {
      username?: string;
      riotId?: string;
      riotPuuid?: string;
    }
  ) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.username && { username: data.username }),
        ...(data.riotId !== undefined && { riotId: data.riotId }),
        ...(data.riotPuuid !== undefined && { riotPuuid: data.riotPuuid }),
        updatedAt: new Date(),
      },
      include: {
        oauthAccounts: {
          select: {
            id: true,
            provider: true,
            providerId: true,
            email: true,
            createdAt: true,
          },
        },
      },
    });

    logger.info('User profile updated', { userId });

    return user;
  }
}
