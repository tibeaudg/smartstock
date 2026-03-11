import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

/**
 * Public route for Stripe Payment Link success redirect.
 * Stripe can redirect here when the success URL points to /billing-success.
 * Redirects to the billing page (or auth if not logged in).
 */
export const BillingSuccessRedirect = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const success = searchParams.get('success') === 'true';
    const canceled = searchParams.get('canceled') === 'true';
    const targetPath = '/dashboard/settings/billing';
    const targetSearch = success ? '?success=true' : canceled ? '?canceled=true' : '';
    const target = targetPath + targetSearch;

    if (user) {
      navigate(target, { replace: true });
    } else {
      navigate('/auth', { state: { from: { pathname: targetPath, search: targetSearch } }, replace: true });
    }
  }, [user, loading, navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-slate-600">Taking you to your account...</p>
      </div>
    </div>
  );
};
