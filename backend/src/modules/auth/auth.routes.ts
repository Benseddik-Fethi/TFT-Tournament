/**
 * Authentication Routes
 *
 * OAuth and JWT authentication endpoints
 */

import { Router, type Router as IRouter, Request, Response, NextFunction } from 'express';
import passport from '@/shared/auth/passport.config';
import { AuthController } from './auth.controller';
import { authRequired } from '@/shared/middlewares/auth.middleware';
import { getAuthConfig } from '@/config/auth.config';

const router: IRouter = Router();
const authController = new AuthController();

/**
 * Custom OAuth callback handler with error handling
 */
function createOAuthCallback(strategy: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(strategy, { session: false }, (err: Error | null, user: Express.User | false, info?: { message?: string }) => {
      if (err) {
        // Redirect to frontend with error message
        const config = getAuthConfig();
        const redirectUrl = new URL(config.frontendUrl);
        redirectUrl.pathname = '/auth/callback';
        redirectUrl.searchParams.set('error', err.message || 'Authentication failed');
        return res.redirect(redirectUrl.toString());
      }

      if (!user) {
        // No user returned (authentication failed)
        const config = getAuthConfig();
        const redirectUrl = new URL(config.frontendUrl);
        redirectUrl.pathname = '/auth/callback';
        redirectUrl.searchParams.set('error', info?.message || 'Authentication failed');
        return res.redirect(redirectUrl.toString());
      }

      // Attach user to request and proceed to controller
      req.user = user;
      return authController.oauthCallback(req, res, next);
    })(req, res, next);
  };
}

/**
 * OAuth Routes
 */

// Google OAuth
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

router.get('/google/callback', createOAuthCallback('google'));

// Discord OAuth
router.get(
  '/discord',
  passport.authenticate('discord', {
    session: false,
  })
);

router.get('/discord/callback', createOAuthCallback('discord'));

// Twitch OAuth
router.get(
  '/twitch',
  passport.authenticate('twitch', {
    session: false,
  })
);

router.get('/twitch/callback', createOAuthCallback('twitch'));

/**
 * JWT Routes
 */

// Get current authenticated user
router.get('/me', authRequired, authController.getCurrentUser);

// Refresh access token
router.post('/refresh', authController.refreshToken);

// Logout
router.post('/logout', authRequired, authController.logout);

// Delete account
router.delete('/account', authRequired, authController.deleteAccount);

export default router;
