/**
 * User Controller
 *
 * HTTP request handlers for user routes
 */

/// <reference path="../../types/express.d.ts" />

import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { BadRequestError } from '@/shared/utils/errors';

type User = any; // Prisma client not available in this environment

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Get current user profile with all linked OAuth accounts
   * GET /api/users/me
   */
  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new BadRequestError('User not authenticated');
      }

      const authenticatedUser = req.user as User;
      const user = await this.userService.getUserWithAccounts(authenticatedUser.id);

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all OAuth accounts for current user
   * GET /api/users/me/oauth-accounts
   */
  getOAuthAccounts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new BadRequestError('User not authenticated');
      }

      const authenticatedUser = req.user as User;
      const accounts = await this.userService.getOAuthAccounts(authenticatedUser.id);

      res.json({
        success: true,
        data: accounts,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Unlink an OAuth account
   * DELETE /api/users/me/oauth-accounts/:provider
   */
  unlinkOAuthAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new BadRequestError('User not authenticated');
      }

      const { provider } = req.params;

      if (!provider) {
        throw new BadRequestError('Provider is required');
      }

      // Validate provider
      const validProviders = ['google', 'discord', 'twitch'];
      if (!validProviders.includes(provider.toLowerCase())) {
        throw new BadRequestError(
          `Invalid provider. Must be one of: ${validProviders.join(', ')}`
        );
      }

      const authenticatedUser = req.user as User;
      await this.userService.unlinkOAuthAccount(authenticatedUser.id, provider.toLowerCase());

      res.json({
        success: true,
        message: `${provider} account unlinked successfully`,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update user profile
   * PATCH /api/users/me
   */
  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new BadRequestError('User not authenticated');
      }

      const { username, riotId, riotPuuid } = req.body;

      const authenticatedUser = req.user as User;
      const user = await this.userService.updateProfile(authenticatedUser.id, {
        username,
        riotId,
        riotPuuid,
      });

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };
}
