/**
 * OAuth Callback Page
 *
 * Handles OAuth redirect and extracts tokens from URL
 */

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/api/auth.service';

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check for error parameter first
        const errorParam = searchParams.get('error');
        if (errorParam) {
          setError(decodeURIComponent(errorParam));
          return;
        }

        // Extract tokens from URL
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');

        if (!accessToken || !refreshToken) {
          setError('Missing authentication tokens');
          return;
        }

        // Store tokens temporarily
        const tokens = { accessToken, refreshToken };
        useAuthStore.getState().setTokens(tokens);

        // Fetch user data
        const user = await authService.getCurrentUser();

        // Login with user and tokens
        login(user, tokens);

        // Redirect to home or previous page
        const from = (history.state as { from?: string })?.from || '/';
        navigate(from, { replace: true });
      } catch (err) {
        console.error('Auth callback error:', err);
        setError('Authentication failed. Please try again.');
      }
    };

    handleCallback();
  }, [searchParams, login, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-display text-slate-50 mb-2">
            Authentication Failed
          </h1>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-brand-gold-500 hover:bg-brand-gold-600 text-slate-950 font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-gold-500 border-t-transparent mx-auto"></div>
        <p className="mt-4 text-slate-400">Completing authentication...</p>
      </div>
    </div>
  );
}
