import React, { useMemo, useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserActivityEvents } from '@/hooks/useUserActivityEvents';
import {
  buildTimelineItems,
  countByCategory,
  deriveActivationStatus,
} from '@/lib/analytics/timeline';
import { ActivityLogHeader } from './ActivityLogHeader';
import { ActivityTimeline } from './ActivityTimeline';

interface UserActivityLogTabProps {
  userId: string;
  userCreatedAt: string;
  auditLogs: Array<{
    id: string;
    action: string;
    table_name?: string;
    created_at: string;
  }>;
  loadingAuditLogs: boolean;
  onExport: (rows: Record<string, unknown>[], filename: string) => void;
}

export function UserActivityLogTab({
  userId,
  userCreatedAt,
  auditLogs,
  loadingAuditLogs,
  onExport,
}: UserActivityLogTabProps) {
  const [showAdminOnly, setShowAdminOnly] = useState(false);
  const { events, analyticsConsent, isLoading, isError, error } = useUserActivityEvents(
    userId,
    true,
  );

  const auditEntries = useMemo(() => {
    return auditLogs
      .filter((log) => !(typeof log.action === 'string' && log.action.startsWith('ADMIN_NOTE:')))
      .map((log) => {
        const isAdmin = typeof log.action === 'string' && log.action.startsWith('ADMIN:');
        return isAdmin
          ? { kind: 'admin' as const, id: log.id, action: log.action.replace('ADMIN: ', ''), created_at: log.created_at }
          : {
              kind: 'mutation' as const,
              id: log.id,
              action: log.action,
              table_name: log.table_name ?? 'unknown',
              created_at: log.created_at,
            };
      });
  }, [auditLogs]);

  const timelineItems = useMemo(() => buildTimelineItems(events), [events]);
  const categoryCounts = useMemo(() => countByCategory(events), [events]);
  const badge = useMemo(
    () => deriveActivationStatus(events, userCreatedAt, analyticsConsent),
    [events, userCreatedAt, analyticsConsent],
  );

  const adminActionCount = auditEntries.filter((e) => e.kind === 'admin').length;
  const mutationCount = auditEntries.filter((e) => e.kind === 'mutation').length;

  const handleExport = () => {
    const rows = [
      ...events.map((e) => ({
        type: 'event',
        category: e.category,
        event_name: e.event_name,
        surface: (e.properties as Record<string, unknown>)?.surface,
        route: (e.properties as Record<string, unknown>)?.route,
        request_id: e.request_id,
        timestamp: e.timestamp,
      })),
      ...auditEntries.map((e) => ({
        type: e.kind,
        label: e.kind === 'admin' ? e.action : `${e.action} on ${e.table_name}`,
        timestamp: e.created_at,
      })),
    ];
    onExport(rows, `user_${userId}_activity`);
  };

  const loading = loadingAuditLogs || isLoading;

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-red-600">
        <AlertCircle className="w-8 h-8" />
        <p className="text-sm">Failed to load activity: {(error as Error)?.message ?? 'Unknown error'}</p>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  const visibleTimeline = showAdminOnly || analyticsConsent === false ? [] : timelineItems;
  const visibleAudit = showAdminOnly
    ? auditEntries.filter((e) => e.kind === 'admin')
    : auditEntries;

  const emptyMessage =
    visibleTimeline.length === 0 && visibleAudit.length === 0
      ? analyticsConsent === false
        ? {
            title: 'Analytics consent declined',
            body: 'This user opted out of product analytics. Turn on "Admin actions only" to see support actions.',
          }
        : {
            title: 'No activity recorded',
            body: 'This account has no product events or admin actions in the log yet.',
          }
      : null;

  return (
    <>
      <ActivityLogHeader
        badge={badge}
        categoryCounts={categoryCounts}
        adminActionCount={adminActionCount + mutationCount}
        showAdminOnly={showAdminOnly}
        onToggleAdminOnly={() => setShowAdminOnly((v) => !v)}
        onExport={handleExport}
        exportDisabled={events.length === 0 && auditEntries.length === 0}
      />
      {emptyMessage ? (
        <div className="py-8 text-center text-slate-500">
          <p className="font-medium text-slate-700">{emptyMessage.title}</p>
          <p className="text-sm mt-1 max-w-md mx-auto">{emptyMessage.body}</p>
        </div>
      ) : (
        <ActivityTimeline
          items={visibleTimeline}
          auditEntries={visibleAudit}
          showAdminOnly={showAdminOnly}
        />
      )}
    </>
  );
}
