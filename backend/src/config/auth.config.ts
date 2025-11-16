/**
 * Authentication Configuration
 *
 * Centralized configuration for JWT and OAuth providers
 */

export const authConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-key',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },

  oauth: {
    google: {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback',
    },
    discord: {
      clientID: process.env.DISCORD_CLIENT_ID || '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
      callbackURL: process.env.DISCORD_CALLBACK_URL || 'http://localhost:3000/api/auth/discord/callback',
      scope: ['identify', 'email'],
    },
    twitch: {
      clientID: process.env.TWITCH_CLIENT_ID || '',
      clientSecret: process.env.TWITCH_CLIENT_SECRET || '',
      callbackURL: process.env.TWITCH_CALLBACK_URL || 'http://localhost:3000/api/auth/twitch/callback',
      scope: 'user:read:email',
    },
  },

  // Frontend URL for redirects
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};
