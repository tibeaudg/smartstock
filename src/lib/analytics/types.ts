export type AnalyticsCategory =
  | 'lifecycle'
  | 'navigation'
  | 'interaction'
  | 'operation'
  | 'error'
  | 'performance';

export type AnalyticsSource = 'web' | 'server' | 'webhook';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface AnalyticsContext {
  route: string;
  referrer?: string;
  device: DeviceType;
  viewport?: { w: number; h: number };
  locale?: string;
}

export interface AnalyticsEnvelope {
  event: string;
  category: AnalyticsCategory;
  timestamp: string;
  anonymous_id: string;
  user_id?: string | null;
  session_id: string;
  org_id: string;
  branch_id?: string | null;
  source: AnalyticsSource;
  app_version: string;
  request_id?: string;
  idempotency_key: string;
  context: AnalyticsContext;
  properties: Record<string, unknown>;
}

export interface TrackOptions {
  userId?: string | null;
  branchId?: string | null;
  orgId?: string | null;
  sessionId?: string;
  requestId?: string;
  idempotencyKey?: string;
  properties?: Record<string, unknown>;
  /** Skip dedup check (use sparingly) */
  force?: boolean;
}

export type OperationStatus = 'started' | 'succeeded' | 'failed' | 'cancelled';

export interface OperationHandle {
  operationId: string;
  eventPrefix: string;
  startedAt: number;
  properties: Record<string, unknown>;
}
