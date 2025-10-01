import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient } from '@tanstack/react-query';

export function setupPersistedQueryClient(queryClient: QueryClient) {
  const persister = createSyncStoragePersister({
    storage: window.localStorage,
    // Only persist essential queries to reduce localStorage usage
    serialize: (data) => {
      // Filter out real-time subscriptions and temporary data
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([key]) => 
          key.includes('dashboardData') || 
          key.includes('products') || 
          key.includes('basicDashboardMetrics') ||
          key.includes('productCount')
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
    maxAge: 1000 * 60 * 60 * 12, // 12 hours - shorter for better performance
    buster: 'v1', // Version busting for cache invalidation
  });
}
