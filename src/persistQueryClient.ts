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
          // Exclude productCount - must always be fresh for checklist logic (0 products = show checklist)
          key.includes('user-subscription') ||
          key.includes('pricing-tiers') ||
          key.includes('stockTransactions') ||
          key.includes('delivery-notes') ||
          key.includes('categories') ||
          key.includes('suppliers') ||
          key.includes('scannerSettings')
        )
      );
      return JSON.stringify(filteredData);
    },
    deserialize: (data) => {
      try {
        const parsed = JSON.parse(data);
        // Strip productCount from restored cache - it must always be fetched fresh.
        // Otherwise: first paint shows checklist (no cache), then hydrate restores
        // stale productCount, and we incorrectly show full dashboard.
        if (parsed?.clientState?.queries) {
          parsed.clientState.queries = parsed.clientState.queries.filter(
            (q: { queryKey?: unknown[] }) =>
              q.queryKey?.[0] !== 'productCount'
          );
        }
        return parsed;
      } catch {
        return {};
      }
    }
  });

  persistQueryClient({
    queryClient,
    persister,
    maxAge: Infinity, // Never expire cache - persist indefinitely
    buster: 'v3', // Version busting - bumped to clear stale productCount from persist
  });
}
