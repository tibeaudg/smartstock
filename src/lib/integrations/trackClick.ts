import { trackEvent } from '@/lib/events/trackEvent';
import type { IntegrationDefinition } from './catalog';

export function trackIntegrationClick(
  integration: IntegrationDefinition,
  userId: string,
  branchId?: string | null,
): void {
  trackEvent('integration_clicked', {
    userId,
    branchId: branchId ?? null,
    properties: {
      integration_id: integration.id,
      integration_name: integration.name,
      integration_category: integration.category,
    },
  });
}
