/**
 * Authentication Middleware
 *
 * Protect routes and extract authenticated user information
 */

/// <reference path="../../types/express.d.ts" />

import { Request, Response, NextFunction } from 'express';
import { prisma } from '@/shared/database/client';
import { UnauthorizedError, ForbiddenError } from '@/shared/utils/errors';
import { verifyAccessToken, extractTokenFromHeader } from '@/shared/utils/jwt.util';
import { logger } from '@/shared/utils/logger';

type User = any; // Prisma client not available in this environment

/**
 * Authentication middleware - requires valid JWT token
 * Extracts user from token and attaches to req.user
 */
export async function authRequired(req: Request, _res: Response, next: NextFunction) {
  try {
    // Extract token from Authorization header
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      throw new UnauthorizedError('No authentication token provided');
    }

    // Verify token
    const payload = verifyAccessToken(token);

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      next(error);
    } else {
      logger.error('Authentication error', { error });
      next(new UnauthorizedError('Authentication failed'));
    }
  }
}

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't require it
 */
export async function authOptional(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      // No token provided, continue without user
      return next();
    }

    const payload = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (user) {
      req.user = user;
    }

    next();
  } catch (error) {
    // If token is invalid, just continue without user
    // Don't throw error for optional auth
    next();
  }
}

/**
 * Role-based authorization middleware
 * Requires user to have specific role(s)
 */
export function requireRole(...allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    const user = req.user as User;
    if (!allowedRoles.includes(user.role)) {
      return next(
        new ForbiddenError(
          `Access denied. Required role: ${allowedRoles.join(' or ')}`
        )
      );
    }

    next();
  };
}

/**
 * Check if authenticated user is the owner of a resource
 * Usage: requireOwnership('ownerId') where ownerId is a param or body field
 */
export function requireOwnership(ownerIdField: string = 'ownerId') {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(new UnauthorizedError('Authentication required'));
      }

      const user = req.user as User;

      // Check in params first, then body
      const resourceOwnerId = req.params[ownerIdField] || req.body[ownerIdField];

      if (!resourceOwnerId) {
        return next(new ForbiddenError('Owner verification failed'));
      }

      // Admin can access everything
      if (user.role === 'admin') {
        return next();
      }

      // Check if user is the owner
      if (user.id !== resourceOwnerId) {
        return next(new ForbiddenError('You do not own this resource'));
      }

      next();
    } catch (error) {
      logger.error('Ownership check error', { error });
      next(new ForbiddenError('Ownership verification failed'));
    }
  };
}

/**
 * Check if user is admin
 */
export const requireAdmin = requireRole('admin');

/**
 * Check if user is organizer or admin
 */
export const requireOrganizer = requireRole('organizer', 'admin');
