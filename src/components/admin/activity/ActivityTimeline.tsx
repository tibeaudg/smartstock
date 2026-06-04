import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { Navigation, Shield, Database, Zap, AlertTriangle, Activity } from 'lucide-react';
import {
  buildSentryIssueUrl,
  CATEGORY_STYLES,
  formatEventName,
  formatSurface,
} from '@/lib/analytics/display';
import type { TimelineItem } from '@/lib/analytics/timeline';
import type { NormalizedActivityEvent } from '@/lib/analytics/timeline';

interface ActivityTimelineProps {
  items: TimelineItem[];
  auditEntries: Array<
    | { kind: 'admin'; id: string; action: string; created_at: string }
    | { kind: 'mutation'; id: string; action: string; table_name: string; created_at: string }
  >;
  showAdminOnly: boolean;
}

function formatEventTime(iso: string, rangeEnd?: string): string {
  const start = new Date(iso);
  if (rangeEnd && rangeEnd !== iso) {
    const end = new Date(rangeEnd);
    return `${format(start, 'PPpp')} – ${format(end, 'PPpp')}`;
  }
  const relative = formatDistanceToNow(start, { addSuffix: true });
  const exact = format(start, 'PPpp.SSS');
  return `${relative} · ${exact}`;
}

function EventRow({ event }: { event: NormalizedActivityEvent }) {
  const style = CATEGORY_STYLES[event.category];
  const Icon =
    event.category === 'error'
      ? AlertTriangle
      : event.category === 'lifecycle'
        ? Activity
        : event.category === 'operation'
          ? Zap
          : Navigation;

  return (
    <div className="relative py-2">
      <div
        className={`absolute -left-[26px] top-3 w-4 h-4 rounded-full border-2 flex items-center justify-center ${style.bg} border-current`}
      >
        <Icon className={`w-2 h-2 ${style.text}`} />
      </div>
      <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: 'inherit' }}>
        <span className={style.text}>{style.label}</span>
      </p>
      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
        {formatEventName(String(event.normalized_name))}
        {event.surface ? ` · ${formatSurface(event.surface)}` : ''}
      </p>
      {event.route && <p className="text-xs text-gray-400 font-mono">{event.route}</p>}
      <p className="text-xs text-gray-400" title={event.timestamp}>
        {formatEventTime(event.timestamp)}
      </p>
    </div>
  );
}

function RouteGroupRow({
  surface,
  route,
  count,
  last_at,
}: {
  surface: string;
  route: string;
  count: number;
  last_at: string;
}) {
  const style = CATEGORY_STYLES.navigation;
  return (
    <div className="relative py-2">
      <div className="absolute -left-[26px] top-3 w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-400 flex items-center justify-center">
        <Navigation className="w-2 h-2 text-blue-600" />
      </div>
      <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-0.5">Navigation</p>
      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
        Route viewed · {formatSurface(surface)}
        {count > 1 && (
          <span className="ml-2 text-xs font-normal text-gray-500">×{count}</span>
        )}
      </p>
      <p className="text-xs text-gray-400 font-mono">{route}</p>
      <p className="text-xs text-gray-400" title={last_at}>
        {formatEventTime(last_at)}
      </p>
    </div>
  );
}

function OperationRow({
  prefix,
  status,
  duration_ms,
  started_at,
  ended_at,
  properties,
}: {
  prefix: string;
  status: string;
  duration_ms: number | null;
  started_at: string;
  ended_at: string | null;
  properties: Record<string, unknown>;
}) {
  const style = CATEGORY_STYLES.operation;
  const statusColor =
    status === 'failed' ? 'text-red-600' : status === 'succeeded' ? 'text-green-600' : 'text-amber-600';

  return (
    <div className="relative py-2">
      <div className="absolute -left-[26px] top-3 w-4 h-4 rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center">
        <Zap className="w-2 h-2 text-emerald-600" />
      </div>
      <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-0.5">Operation</p>
      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
        {formatEventName(prefix)}{' '}
        <span className={`text-xs font-semibold ${statusColor}`}>· {status}</span>
        {duration_ms != null && (
          <span className="text-xs text-gray-500 ml-1">({(duration_ms / 1000).toFixed(1)}s)</span>
        )}
      </p>
      {(properties.error_code as string) && (
        <p className="text-xs text-red-500 font-mono">{String(properties.error_code)}</p>
      )}
      <p className="text-xs text-gray-400" title={ended_at ?? started_at}>
        {formatEventTime(started_at, ended_at ?? undefined)}
      </p>
    </div>
  );
}

function ErrorRow({ event }: { event: NormalizedActivityEvent }) {
  const sentryUrl = buildSentryIssueUrl(event.request_id);
  return (
    <div className="relative py-2">
      <div className="absolute -left-[26px] top-3 w-4 h-4 rounded-full bg-red-100 border-2 border-red-400 flex items-center justify-center">
        <AlertTriangle className="w-2 h-2 text-red-600" />
      </div>
      <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-0.5">Error</p>
      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
        {formatEventName(String(event.normalized_name))}
      </p>
      {(event.properties?.message as string) && (
        <p className="text-xs text-gray-600 truncate max-w-md">{String(event.properties?.message)}</p>
      )}
      {event.request_id && (
        <p className="text-xs text-gray-400 font-mono">
          request_id: {event.request_id}
          {sentryUrl && (
            <a
              href={sentryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-blue-600 hover:underline"
            >
              Sentry
            </a>
          )}
        </p>
      )}
      <p className="text-xs text-gray-400" title={event.timestamp}>
        {formatEventTime(event.timestamp)}
      </p>
    </div>
  );
}

export function ActivityTimeline({ items, auditEntries, showAdminOnly }: ActivityTimelineProps) {
  type Row =
    | { sortAt: number; node: React.ReactNode };

  const rows: Row[] = [];

  if (!showAdminOnly) {
    for (const item of items) {
      if (item.kind === 'route_group') {
        rows.push({
          sortAt: new Date(item.last_at).getTime(),
          node: (
            <RouteGroupRow
              key={item.id}
              surface={item.surface}
              route={item.route}
              count={item.count}
              last_at={item.last_at}
            />
          ),
        });
      } else if (item.kind === 'operation') {
        rows.push({
          sortAt: new Date(item.ended_at ?? item.started_at).getTime(),
          node: (
            <OperationRow
              key={item.id}
              prefix={item.prefix}
              status={item.status}
              duration_ms={item.duration_ms}
              started_at={item.started_at}
              ended_at={item.ended_at}
              properties={item.properties}
            />
          ),
        });
      } else if (item.event.category === 'error') {
        rows.push({
          sortAt: new Date(item.event.timestamp).getTime(),
          node: <ErrorRow key={item.id} event={item.event} />,
        });
      } else {
        rows.push({
          sortAt: new Date(item.event.timestamp).getTime(),
          node: <EventRow key={item.id} event={item.event} />,
        });
      }
    }
  }

  for (const entry of auditEntries) {
    if (entry.kind === 'admin') {
      rows.push({
        sortAt: new Date(entry.created_at).getTime(),
        node: (
          <div key={entry.id} className="relative py-2">
            <div className="absolute -left-[26px] top-3 w-4 h-4 rounded-full bg-purple-100 border-2 border-purple-400 flex items-center justify-center">
              <Shield className="w-2 h-2 text-purple-600" />
            </div>
            <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-0.5">Admin Action</p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{entry.action}</p>
            <p className="text-xs text-gray-400" title={entry.created_at}>
              {formatEventTime(entry.created_at)}
            </p>
          </div>
        ),
      });
    } else {
      rows.push({
        sortAt: new Date(entry.created_at).getTime(),
        node: (
          <div key={entry.id} className="relative py-2">
            <div className="absolute -left-[26px] top-3 w-4 h-4 rounded-full bg-green-100 border-2 border-green-400 flex items-center justify-center">
              <Database className="w-2 h-2 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {entry.action} on{' '}
              <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">{entry.table_name}</span>
            </p>
            <p className="text-xs text-gray-400" title={entry.created_at}>
              {formatEventTime(entry.created_at)}
            </p>
          </div>
        ),
      });
    }
  }

  rows.sort((a, b) => b.sortAt - a.sortAt);

  if (rows.length === 0) {
    return <div className="text-center py-8 text-gray-500">No activity logs found</div>;
  }

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
      <div className="space-y-1 pl-10">{rows.map((r) => r.node)}</div>
    </div>
  );
}
