/**
 * Authentication Controller
 *
 * HTTP request handlers for authentication routes
 */

/// <reference path="../../types/express.d.ts" />

import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { getAuthConfig } from '@/config/auth.config';
import { BadRequestError } from '@/shared/utils/errors';
import { logger } from '@/shared/utils/logger';

type User = any; // Prisma client not available in this environment

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * OAuth callback handler
   * Called after successful OAuth authentication
   */
  oauthCallback = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // User is attached to req.user by Passport
      if (!req.user || !('id' in req.user)) {
        throw new BadRequestError('OAuth authentication failed');
      }

      // Generate auth response with tokens
      const user = req.user as User;
      const authResponse = await this.authService.generateAuthResponse(user.id);

      // Redirect to frontend with tokens in URL (or use a different method)
      const config = getAuthConfig();
      const redirectUrl = new URL(config.frontendUrl);
      redirectUrl.pathname = '/auth/callback';
      redirectUrl.searchParams.set('accessToken', authResponse.tokens.accessToken);
      redirectUrl.searchParams.set('refreshToken', authResponse.tokens.refreshToken);

      logger.info('OAuth callback successful', { userId: user.id });

      res.redirect(redirectUrl.toString());
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get current authenticated user
   * GET /api/auth/me
   */
  getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new BadRequestError('User not authenticated');
      }

      const authenticatedUser = req.user as User;
      const user = await this.authService.getCurrentUser(authenticatedUser.id);

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Refresh access token
   * POST /api/auth/refresh
   * Body: { refreshToken: string }
   */
  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new BadRequestError('Refresh token is required');
      }

      const tokens = await this.authService.refreshAccessToken(refreshToken);

      res.json({
        success: true,
        data: tokens,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Logout user
   * POST /api/auth/logout
   */
  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new BadRequestError('User not authenticated');
      }

      const user = req.user as User;
      await this.authService.logout(user.id);

      res.json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete user account
   * DELETE /api/auth/account
   */
  deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new BadRequestError('User not authenticated');
      }

      const user = req.user as User;
      await this.authService.deleteAccount(user.id);

      res.json({
        success: true,
        message: 'Account deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
