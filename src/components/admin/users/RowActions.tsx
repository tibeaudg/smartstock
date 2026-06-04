import React, { useState } from 'react';
import { Calendar, Flag, Loader2, Mail, MoreHorizontal, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  addAdminNote,
  emailUser,
  extendTrial,
  impersonateUser,
} from '@/lib/admin/userAdminActions';
import type { UserPlanInfo } from '@/lib/admin/types';

interface RowActionsProps {
  userId: string;
  email: string;
  plan: UserPlanInfo;
  adminEmail?: string;
  onActionComplete?: () => void;
}

export function RowActions({ userId, email, plan, adminEmail, onActionComplete }: RowActionsProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const run = async (key: string, fn: () => Promise<boolean | void>) => {
    setLoading(key);
    try {
      await fn();
      onActionComplete?.();
    } finally {
      setLoading(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 focus:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <MoreHorizontal className="w-4 h-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem onClick={() => run('imp', () => impersonateUser(userId))}>
          <UserCog className="w-4 h-4 mr-2" />
          Impersonate
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => emailUser(email)}>
          <Mail className="w-4 h-4 mr-2" />
          Email
        </DropdownMenuItem>
        {plan.isActiveTrial && (
          <DropdownMenuItem onClick={() => run('trial', () => extendTrial(userId, adminEmail))}>
            <Calendar className="w-4 h-4 mr-2" />
            Extend trial +7d
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={() => {
            const note = window.prompt('Triage note for this account:');
            if (note) run('flag', () => addAdminNote(userId, note, adminEmail));
          }}
        >
          <Flag className="w-4 h-4 mr-2" />
          Flag / note
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
