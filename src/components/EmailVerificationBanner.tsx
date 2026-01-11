import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { AlertCircle, X, Mail } from 'lucide-react';

export const EmailVerificationBanner = () => {
  const { user, emailVerified, resendVerificationEmail } = useAuth();
  const [isDismissed, setIsDismissed] = useState(() => {
    // Check localStorage on initial mount
    if (typeof window !== 'undefined') {
      return localStorage.getItem('email-verification-banner-dismissed') === 'true';
    }
    return false;
  });
  const [isResending, setIsResending] = useState(false);

  // Reset dismissed state if email gets verified
  useEffect(() => {
    if (emailVerified && isDismissed) {
      setIsDismissed(false);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('email-verification-banner-dismissed');
      }
    }
  }, [emailVerified, isDismissed]);

  // Don't show if user is not logged in, email is verified, or banner is dismissed
  if (!user || emailVerified || isDismissed) {
    return null;
  }

  const handleResend = async () => {
    setIsResending(true);
    try {
      const { error } = await resendVerificationEmail();
      if (error) {
        toast.error('Failed to resend verification email', {
          description: error.message || 'Please try again later.',
        });
      } 
    } catch (error: any) {
      toast.error('An error occurred', {
        description: error.message || 'Please try again later.',
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    // Store dismissal in localStorage (will reappear on next session if still unverified)
    if (typeof window !== 'undefined') {
      localStorage.setItem('email-verification-banner-dismissed', 'true');
    }
  };

  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-amber-600" />
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-amber-800">
                Please verify your email address
              </h3>
              <div className="mt-2 text-sm text-amber-700">
                <p>
                  We've sent a verification email to <strong>{user.email}</strong>. 
                  Please click the link in the email to verify your account.
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="ml-4 flex-shrink-0 text-amber-600 hover:text-amber-800"
              aria-label="Dismiss banner"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-4">
            <Button
              onClick={handleResend}
              disabled={isResending}
              variant="outline"
              size="sm"
              className="bg-white text-amber-800 border-amber-300 hover:bg-amber-100 hover:text-amber-900"
            >
              <Mail className="h-4 w-4 mr-2" />
              {isResending ? 'Sending...' : 'Resend verification email'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

