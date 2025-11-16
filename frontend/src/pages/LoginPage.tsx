/**
 * Login Page
 *
 * OAuth login with Google, Discord, and Twitch
 * Now using reusable OAuthProviderButton components
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useOAuthLogin } from '@/hooks/useAuth';
import { OAuthProviderButton } from '@/components/atoms';

export function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { login } = useOAuthLogin();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="max-w-md w-full px-6">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display text-slate-50 mb-2">TFT Arena</h1>
          <p className="text-slate-400">
            Connect with your favorite platform to get started
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-8">
          <h2 className="text-2xl font-display text-slate-50 mb-6">Sign In</h2>

          <div className="space-y-3">
            <OAuthProviderButton provider="google" onClick={() => login('google')} />
            <OAuthProviderButton provider="discord" onClick={() => login('discord')} />
            <OAuthProviderButton provider="twitch" onClick={() => login('twitch')} />
          </div>

          {/* Privacy Notice */}
          <p className="text-xs text-slate-500 text-center mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            New to TFT Arena?{' '}
            <span className="text-brand-gold-500">
              Just sign in to create your account automatically
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
