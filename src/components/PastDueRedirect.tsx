import { Navigate, useLocation } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';

export const PAST_DUE_BILLING_PATH = '/dashboard/settings/billing';

export function isPastDueAllowedPath(pathname: string, isOwner = false): boolean {
  if (pathname.startsWith(PAST_DUE_BILLING_PATH)) return true;
  if (isOwner && pathname.startsWith('/admin')) return true;
  return false;
}

/** Sends past-due users to billing — owners may still access /admin. */
export const PastDueRedirect = () => {
  const { isPastDue, isLoading } = useSubscription();
  const { userProfile } = useAuth();
  const location = useLocation();
  const isOwner = userProfile?.is_owner === true;

  if (isLoading || !isPastDue) return null;
  if (isPastDueAllowedPath(location.pathname, isOwner)) return null;

  return <Navigate to={PAST_DUE_BILLING_PATH} replace />;
};
