import React, { useEffect, useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  clearImpersonationSession,
  getImpersonationSession,
  type ImpersonationSession,
} from '@/lib/admin/userAdminActions';

export function ImpersonationBanner() {
  const [session, setSession] = useState<ImpersonationSession | null>(() => getImpersonationSession());

  useEffect(() => {
    const interval = setInterval(() => {
      setSession(getImpersonationSession());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!session) return null;

  const minutesLeft = Math.max(0, Math.round((session.expiresAt - Date.now()) / 60000));

  return (
    <div
      role="alert"
      className="sticky top-0 z-[60] flex flex-wrap items-center justify-between gap-2 border-b border-amber-300 bg-amber-100 px-4 py-2 text-sm text-amber-950"
    >
      <div className="flex items-center gap-2">
        <ShieldAlert className="h-4 w-4 shrink-0" />
        <span>
          <strong>Admin impersonation active</strong> — login-as link issued for{' '}
          <strong>{session.targetEmail}</strong>
          {session.adminEmail ? ` (by ${session.adminEmail})` : ''}. Session log expires in{' '}
          {minutesLeft} min. Use a private window only.
        </span>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-7 border-amber-400 bg-white/80"
        onClick={() => {
          clearImpersonationSession();
          setSession(null);
        }}
      >
        <X className="h-3 w-3 mr-1" />
        Dismiss
      </Button>
    </div>
  );
}
