/**
 * Authentication Configuration
 *
 * Centralized configuration for JWT and OAuth providers
 *
 * IMPORTANT: Uses a getter function to ensure environment variables
 * are read AFTER dotenv.config() has loaded them (not at module import time)
 */

let cachedConfig: ReturnType<typeof buildAuthConfig> | null = null;

function buildAuthConfig() {
  return {
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
}

/**
 * Get authentication configuration
 * Builds config on first call and caches it for subsequent calls
 */
export function getAuthConfig() {
  if (!cachedConfig) {
    cachedConfig = buildAuthConfig();
  }
  return cachedConfig;
}

/**
 * Legacy export for backward compatibility
 * @deprecated Use getAuthConfig() instead
 */
export const authConfig = new Proxy({} as ReturnType<typeof buildAuthConfig>, {
  get(_target, prop) {
    return getAuthConfig()[prop as keyof ReturnType<typeof buildAuthConfig>];
  }
});
