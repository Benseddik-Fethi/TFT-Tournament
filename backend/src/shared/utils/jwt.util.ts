/**
 * JWT Utility Functions
 *
 * Handles JWT token generation, verification, and decoding
 */

import jwt from 'jsonwebtoken';
import { getAuthConfig } from '@/config/auth.config';
import { UnauthorizedError } from './errors';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Generate access token
 */
export function generateAccessToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  const config = getAuthConfig();
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
}

/**
 * Generate refresh token
 */
export function generateRefreshToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  const config = getAuthConfig();
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
}

/**
 * Generate both access and refresh tokens
 */
export function generateTokenPair(payload: Omit<JwtPayload, 'iat' | 'exp'>): TokenPair {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}

/**
 * Verify access token
 */
export function verifyAccessToken(token: string): JwtPayload {
  try {
    const config = getAuthConfig();
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid token');
    }
    throw new UnauthorizedError('Token verification failed');
  }
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): JwtPayload {
  try {
    const config = getAuthConfig();
    const decoded = jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Refresh token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid refresh token');
    }
    throw new UnauthorizedError('Refresh token verification failed');
  }
}

/**
 * Decode token without verification (useful for debugging)
 */
export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
}
