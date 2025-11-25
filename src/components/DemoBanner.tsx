import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, X, Clock } from 'lucide-react';
import { Button } from './ui/button';

interface DemoBannerProps {
  expiresAt?: Date;
  onDismiss?: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ expiresAt, onDismiss }) => {
  const [dismissed, setDismissed] = React.useState(false);

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  if (dismissed) return null;

  const daysRemaining = expiresAt
    ? Math.max(0, Math.ceil((expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 7;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-sm md:text-base">
                You're exploring a <strong>Demo Account</strong>
              </p>
              <p className="text-xs md:text-sm text-blue-100 mt-0.5">
                {daysRemaining > 0
                  ? `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining. `
                  : 'Expired. '}
                Changes won't be saved. Create a free account to start managing your inventory.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {expiresAt && (
              <div className="hidden md:flex items-center gap-1 text-blue-100 text-xs">
                <Clock className="h-4 w-4" />
                <span>Expires {expiresAt.toLocaleDateString()}</span>
              </div>
            )}
            <Button
              asChild
              size="sm"
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
            >
              <Link to="/auth?mode=register">Create Free Account</Link>
            </Button>
            {onDismiss && (
              <button
                onClick={handleDismiss}
                className="text-white hover:text-blue-100 transition-colors p-1"
                aria-label="Dismiss banner"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

