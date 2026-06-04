import type { AdminAlert, PulseMetricValues, QuickFilter } from './types';

const IMPORT_FAILURE_THRESHOLD = 10;
const ERROR_EVENTS_THRESHOLD = 5;

export function deriveAdminAlerts(params: {
  metrics: PulseMetricValues;
  churnRiskCount: number;
  stuckOnboardingCount: number;
  importFailureRate7d?: number;
  errorEvents7d?: number;
  dismissedIds: Set<string>;
}): AdminAlert[] {
  const alerts: AdminAlert[] = [];

  if (
    params.metrics.activePayingCustomersMissingInfo > 0 &&
    !params.dismissedIds.has('missing-payment')
  ) {
    alerts.push({
      id: 'missing-payment',
      severity: 'critical',
      title: 'Missing payment method',
      message: `${params.metrics.activePayingCustomersMissingInfo} paying customer(s) have no payment method on file.`,
      count: params.metrics.activePayingCustomersMissingInfo,
      filter: 'payment-issues' as QuickFilter,
      actionLabel: 'View accounts',
    });
  }

  if (params.metrics.trialsExpiringSoon > 0 && !params.dismissedIds.has('trials-expiring')) {
    alerts.push({
      id: 'trials-expiring',
      severity: 'warning',
      title: 'Trials expiring soon',
      message: `${params.metrics.trialsExpiringSoon} trial(s) end within 48 hours.`,
      count: params.metrics.trialsExpiringSoon,
      filter: 'trialing',
      actionLabel: 'View trials',
    });
  }

  if (params.churnRiskCount > 0 && !params.dismissedIds.has('churn-risk')) {
    alerts.push({
      id: 'churn-risk',
      severity: 'warning',
      title: 'Churn risk',
      message: `${params.churnRiskCount} active paying user(s) inactive 3+ days.`,
      count: params.churnRiskCount,
      filter: 'at-risk',
      actionLabel: 'View at-risk',
    });
  }

  if (params.stuckOnboardingCount > 0 && !params.dismissedIds.has('stuck-onboarding')) {
    alerts.push({
      id: 'stuck-onboarding',
      severity: 'info',
      title: 'Stuck in onboarding',
      message: `${params.stuckOnboardingCount} user(s) signed up but have not completed a core action.`,
      count: params.stuckOnboardingCount,
      filter: 'stuck-onboarding',
      actionLabel: 'View stuck',
    });
  }

  const importRate = params.importFailureRate7d ?? 0;
  if (importRate >= IMPORT_FAILURE_THRESHOLD && !params.dismissedIds.has('import-failures')) {
    alerts.push({
      id: 'import-failures',
      severity: 'warning',
      title: 'Import failures elevated',
      message: `Import failure rate is ${importRate}% over the last 7 days.`,
      count: Math.round(importRate),
      filter: 'failed-import',
      actionLabel: 'View failed imports',
    });
  }

  const errors = params.errorEvents7d ?? 0;
  if (errors >= ERROR_EVENTS_THRESHOLD && !params.dismissedIds.has('error-spike')) {
    alerts.push({
      id: 'error-spike',
      severity: 'warning',
      title: 'Client errors elevated',
      message: `${errors} client error event(s) in the last 7 days.`,
      count: errors,
      filter: 'hit-errors',
      actionLabel: 'View errors',
    });
  }

  const severityOrder = { critical: 0, warning: 1, info: 2 };
  return alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
}

export function loadDismissedAlertIds(): Set<string> {
  try {
    const raw = sessionStorage.getItem('admin_alerts_dismissed');
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

export function dismissAlertId(id: string): void {
  const ids = loadDismissedAlertIds();
  ids.add(id);
  sessionStorage.setItem('admin_alerts_dismissed', JSON.stringify([...ids]));
}
