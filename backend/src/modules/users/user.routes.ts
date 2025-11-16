/**
 * User Routes
 *
 * User profile and OAuth account management endpoints
 */

import { Router, type Router as IRouter } from 'express';
import { UserController } from './user.controller';
import { authRequired } from '@/shared/middlewares/auth.middleware';

const router: IRouter = Router();
const userController = new UserController();

/**
 * All user routes require authentication
 */

// Get current user profile with linked accounts
router.get('/me', authRequired, userController.getProfile);

// Update user profile
router.patch('/me', authRequired, userController.updateProfile);

// Get all OAuth accounts
router.get('/me/oauth-accounts', authRequired, userController.getOAuthAccounts);

// Unlink an OAuth account
router.delete('/me/oauth-accounts/:provider', authRequired, userController.unlinkOAuthAccount);

export default router;
