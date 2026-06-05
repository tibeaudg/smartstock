import { analytics } from './index';
import type { OperationHandle, OperationStatus, TrackOptions } from './types';

const activeOperations = new Map<string, OperationHandle>();

/** Maps operation prefix + status → canonical event name */
const END_EVENT_NAMES: Record<string, Partial<Record<OperationStatus, string>>> = {
  import: {
    succeeded: 'import_succeeded',
    failed: 'import_failed',
    cancelled: 'import_cancelled',
  },
  product_create: {
    succeeded: 'product_created',
    failed: 'product_create_failed',
  },
  warehouse_create: {
    succeeded: 'warehouse_created',
    failed: 'warehouse_create_failed',
  },
};

function resolveEndEventName(prefix: string, status: OperationStatus): string {
  const mapped = END_EVENT_NAMES[prefix]?.[status];
  if (mapped) return mapped;
  if (status === 'started') return `${prefix}_started`;
  return `${prefix}_${status}`;
}

export function startOperation(
  eventPrefix: string,
  options: TrackOptions & { properties?: Record<string, unknown> } = {},
): string {
  const operationId = crypto.randomUUID();
  const startedAt = Date.now();

  activeOperations.set(operationId, {
    operationId,
    eventPrefix,
    startedAt,
    properties: options.properties ?? {},
  });

  analytics.track(resolveEndEventName(eventPrefix, 'started'), {
    ...options,
    idempotencyKey: `${options.idempotencyKey ?? operationId}:started`,
    properties: {
      operation_id: operationId,
      ...options.properties,
    },
  });

  return operationId;
}

export function endOperation(
  operationId: string,
  status: OperationStatus,
  options: TrackOptions & {
    properties?: Record<string, unknown>;
    error_code?: string;
  } = {},
): void {
  const handle = activeOperations.get(operationId);
  if (!handle) return;

  activeOperations.delete(operationId);
  const duration_ms = Date.now() - handle.startedAt;
  const eventName = resolveEndEventName(handle.eventPrefix, status);

  analytics.track(eventName, {
    ...options,
    idempotencyKey: `${operationId}:${status}`,
    properties: {
      operation_id: operationId,
      duration_ms,
      status,
      error_code: options.error_code,
      ...handle.properties,
      ...options.properties,
    },
  });
}
