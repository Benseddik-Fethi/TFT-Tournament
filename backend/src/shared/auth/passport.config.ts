/**
 * Passport.js Configuration
 *
 * OAuth strategies for Google, Discord, and Twitch
 */

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as DiscordStrategy } from 'passport-discord';
import { Strategy as TwitchStrategy } from 'passport-twitch-new';
import { getAuthConfig } from '@/config/auth.config';
import { prisma } from '@/shared/database/client';
import { logger } from '@/shared/utils/logger';

/**
 * Interface for OAuth profile data
 */
export interface OAuthProfile {
  provider: 'google' | 'discord' | 'twitch';
  providerId: string;
  email: string;
  username: string;
  avatarUrl?: string;
}

/**
 * Find or create user from OAuth profile
 */
async function findOrCreateUser(profile: OAuthProfile) {
  try {
    // Check if user already exists with this provider
    let user = await prisma.user.findUnique({
      where: {
        provider_providerId: {
          provider: profile.provider,
          providerId: profile.providerId,
        },
      },
    });

    // If user exists, update last login
    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      logger.info('User logged in via OAuth', {
        userId: user.id,
        provider: profile.provider,
      });

      return user;
    }

    // Check if user with this email already exists (with different provider)
    const existingUser = await prisma.user.findUnique({
      where: { email: profile.email },
    });

    if (existingUser) {
      // Email already exists with different provider
      logger.warn('User attempted login with different provider', {
        email: profile.email,
        existingProvider: existingUser.provider,
        attemptedProvider: profile.provider,
      });

      throw new Error(
        `Un compte existe déjà avec cet email (${profile.email}). ` +
        `Veuillez vous connecter avec ${existingUser.provider === 'google' ? 'Google' : existingUser.provider === 'discord' ? 'Discord' : 'Twitch'}.`
      );
    }

    // Create new user
    user = await prisma.user.create({
      data: {
        email: profile.email,
        username: profile.username,
        avatarUrl: profile.avatarUrl,
        provider: profile.provider,
        providerId: profile.providerId,
        role: 'player', // Default role
        lastLoginAt: new Date(),
      },
    });

    logger.info('New user created via OAuth', {
      userId: user.id,
      provider: profile.provider,
    });

    return user;
  } catch (error) {
    logger.error('Error in findOrCreateUser', { error, profile });
    throw error;
  }
}

/**
 * Initialize Passport strategies
 * MUST be called after environment variables are loaded
 */
export function initializePassportStrategies() {
  logger.info('🔐 Initializing Passport strategies...');

  // Get auth config (evaluated at runtime, not at import time)
  const authConfig = getAuthConfig();

  /**
   * Google OAuth Strategy
   */
  if (authConfig.oauth.google.clientID && authConfig.oauth.google.clientSecret) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: authConfig.oauth.google.clientID,
          clientSecret: authConfig.oauth.google.clientSecret,
          callbackURL: authConfig.oauth.google.callbackURL,
        },
        async (_accessToken, _refreshToken, profile, done) => {
          try {
            const oauthProfile: OAuthProfile = {
              provider: 'google',
              providerId: profile.id,
              email: profile.emails?.[0]?.value || '',
              username: profile.displayName || profile.emails?.[0]?.value.split('@')[0] || 'User',
              avatarUrl: profile.photos?.[0]?.value,
            };

            const user = await findOrCreateUser(oauthProfile);
            done(null, user);
          } catch (error) {
            done(error as Error);
          }
        }
      )
    );
    logger.info('  ✅ Google strategy registered');
  } else {
    logger.warn('  ⚠️  Google OAuth not configured (missing CLIENT_ID or CLIENT_SECRET)');
  }

  /**
   * Discord OAuth Strategy
   */
  if (authConfig.oauth.discord.clientID && authConfig.oauth.discord.clientSecret) {
    passport.use(
      new DiscordStrategy(
        {
          clientID: authConfig.oauth.discord.clientID,
          clientSecret: authConfig.oauth.discord.clientSecret,
          callbackURL: authConfig.oauth.discord.callbackURL,
          scope: authConfig.oauth.discord.scope,
        },
        async (_accessToken, _refreshToken, profile, done) => {
          try {
            const oauthProfile: OAuthProfile = {
              provider: 'discord',
              providerId: profile.id,
              email: profile.email || '',
              username: profile.username || 'User',
              avatarUrl: profile.avatar
                ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
                : undefined,
            };

            const user = await findOrCreateUser(oauthProfile);
            done(null, user);
          } catch (error) {
            done(error as Error);
          }
        }
      )
    );
    logger.info('  ✅ Discord strategy registered');
  } else {
    logger.warn('  ⚠️  Discord OAuth not configured (missing CLIENT_ID or CLIENT_SECRET)');
  }

  /**
   * Twitch OAuth Strategy
   */
  if (authConfig.oauth.twitch.clientID && authConfig.oauth.twitch.clientSecret) {
    passport.use(
      new TwitchStrategy(
        {
          clientID: authConfig.oauth.twitch.clientID,
          clientSecret: authConfig.oauth.twitch.clientSecret,
          callbackURL: authConfig.oauth.twitch.callbackURL,
          scope: authConfig.oauth.twitch.scope,
        },
        async (_accessToken, _refreshToken, profile, done) => {
          try {
            const oauthProfile: OAuthProfile = {
              provider: 'twitch',
              providerId: profile.id,
              email: profile.email || '',
              username: profile.display_name || profile.login || 'User',
              avatarUrl: profile.profile_image_url,
            };

            const user = await findOrCreateUser(oauthProfile);
            done(null, user);
          } catch (error) {
            done(error as Error);
          }
        }
      )
    );
    logger.info('  ✅ Twitch strategy registered');
  } else {
    logger.warn('  ⚠️  Twitch OAuth not configured (missing CLIENT_ID or CLIENT_SECRET)');
  }

  /**
   * Serialize user for session (not used with JWT, but required by Passport)
   */
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  /**
   * Deserialize user from session (not used with JWT, but required by Passport)
   */
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  logger.info('✅ Passport strategies initialized');
}

export default passport;
