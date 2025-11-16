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
 * Find or create user from OAuth profile with automatic account linking
 */
async function findOrCreateUser(profile: OAuthProfile) {
  try {
    // Step 1: Check if this OAuth account already exists
    const oauthAccount = await prisma.oAuthAccount.findUnique({
      where: {
        provider_providerId: {
          provider: profile.provider,
          providerId: profile.providerId,
        },
      },
      include: {
        user: true,
      },
    });

    // OAuth account found - login with existing user
    if (oauthAccount) {
      const user = await prisma.user.update({
        where: { id: oauthAccount.userId },
        data: { lastLoginAt: new Date() },
      });

      logger.info('User logged in via OAuth', {
        userId: user.id,
        provider: profile.provider,
        linkedAccount: true,
      });

      return user;
    }

    // Step 2: Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: profile.email },
      include: {
        oauthAccounts: true,
      },
    });

    if (existingUser) {
      // Link this new OAuth account to existing user
      await prisma.oAuthAccount.create({
        data: {
          userId: existingUser.id,
          provider: profile.provider,
          providerId: profile.providerId,
          email: profile.email,
        },
      });

      // Update last login
      const user = await prisma.user.update({
        where: { id: existingUser.id },
        data: { lastLoginAt: new Date() },
      });

      logger.info('OAuth account linked to existing user', {
        userId: user.id,
        provider: profile.provider,
        existingProviders: existingUser.oauthAccounts.map(a => a.provider),
      });

      return user;
    }

    // Step 3: Create new user with first OAuth account
    const user = await prisma.user.create({
      data: {
        email: profile.email,
        username: profile.username,
        avatarUrl: profile.avatarUrl,
        role: 'player',
        lastLoginAt: new Date(),
        oauthAccounts: {
          create: {
            provider: profile.provider,
            providerId: profile.providerId,
            email: profile.email,
          },
        },
      },
      include: {
        oauthAccounts: true,
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
