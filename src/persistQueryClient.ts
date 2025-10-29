import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient } from '@tanstack/react-query';

export function setupPersistedQueryClient(queryClient: QueryClient) {
  const persister = createSyncStoragePersister({
    storage: window.localStorage,
    // Persist all critical queries for instant app loading
    serialize: (data) => {
      // Filter to persist only important queries, exclude real-time temporary data
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([key]) => 
          key.includes('branches') || 
          key.includes('dashboardData') || 
          key.includes('products') || 
          key.includes('basicDashboardMetrics') ||
          key.includes('productCount') ||
          key.includes('user-subscription') ||
          key.includes('pricing-tiers') ||
          key.includes('stockTransactions') ||
          key.includes('delivery-notes')
        )
      );
      return JSON.stringify(filteredData);
    },
    deserialize: (data) => {
      try {
        return JSON.parse(data);
      } catch {
        return {};
      }
    }
  });

  persistQueryClient({
    queryClient,
    persister,
    maxAge: Infinity, // Never expire cache - persist indefinitely
    buster: 'v2', // Version busting for cache invalidation - increment when schema changes
  });
}
