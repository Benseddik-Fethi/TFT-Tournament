/**
 * Authentication Routes
 *
 * OAuth and JWT authentication endpoints
 */

import { Router } from 'express';
import passport from '@/shared/auth/passport.config';
import { AuthController } from './auth.controller';
import { authRequired } from '@/shared/middlewares/auth.middleware';

const router = Router();
const authController = new AuthController();

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

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/auth/failure',
  }),
  authController.oauthCallback
);

// Discord OAuth
router.get(
  '/discord',
  passport.authenticate('discord', {
    session: false,
  })
);

router.get(
  '/discord/callback',
  passport.authenticate('discord', {
    session: false,
    failureRedirect: '/auth/failure',
  }),
  authController.oauthCallback
);

// Twitch OAuth
router.get(
  '/twitch',
  passport.authenticate('twitch', {
    session: false,
  })
);

router.get(
  '/twitch/callback',
  passport.authenticate('twitch', {
    session: false,
    failureRedirect: '/auth/failure',
  }),
  authController.oauthCallback
);

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
