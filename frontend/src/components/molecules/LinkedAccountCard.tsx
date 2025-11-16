/**
 * Linked Account Card - Molecule Component
 *
 * Card displaying a linked OAuth account with unlink option
 * Follows atomic design principles
 */

import { FC, useState } from 'react';
import { ProviderBadge, OAuthProvider } from '@/components/atoms';
import { cn } from '@/utils/cn';

interface LinkedAccountCardProps {
  provider: OAuthProvider;
  email: string | null;
  createdAt: Date;
  /**
   * Whether this is the primary (first) account
   * Primary accounts cannot be unlinked
   */
  isPrimary?: boolean;
  /**
   * Callback when unlink is requested
   */
  onUnlink?: () => void | Promise<void>;
  /**
   * Loading state during unlink
   */
  loading?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

export const LinkedAccountCard: FC<LinkedAccountCardProps> = ({
  provider,
  email,
  createdAt,
  isPrimary = false,
  onUnlink,
  loading = false,
  className,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleUnlink = async () => {
    if (onUnlink) {
      await onUnlink();
      setShowConfirm(false);
    }
  };

  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className={cn(
        'bg-slate-900 border border-slate-800 rounded-lg p-4 transition-all',
        !isPrimary && 'hover:border-slate-700',
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left Section - Provider Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <ProviderBadge provider={provider} size="md" />
            {isPrimary && (
              <span className="px-2 py-0.5 text-xs font-medium bg-brand-gold-500/20 text-brand-gold-500 rounded">
                Primary
              </span>
            )}
          </div>

          {/* Email */}
          {email && (
            <p className="text-sm text-slate-400 truncate" title={email}>
              {email}
            </p>
          )}

          {/* Linked Date */}
          <p className="text-xs text-slate-500 mt-1">
            Linked on {formattedDate}
          </p>
        </div>

        {/* Right Section - Actions */}
        {!isPrimary && !showConfirm && (
          <button
            onClick={() => setShowConfirm(true)}
            disabled={loading}
            className="text-sm text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50"
          >
            Unlink
          </button>
        )}

        {/* Confirmation Dialog */}
        {showConfirm && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleUnlink}
              disabled={loading}
              className="text-sm px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                'Confirm'
              )}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              disabled={loading}
              className="text-sm text-slate-400 hover:text-slate-300 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Warning for unlink */}
      {showConfirm && (
        <div className="mt-3 pt-3 border-t border-slate-800">
          <p className="text-xs text-slate-400">
            Are you sure? You won't be able to log in with {provider} anymore.
          </p>
        </div>
      )}
    </div>
  );
};
