import { Suspense } from 'react';
import { createRoot, Root } from 'react-dom/client';
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
  onlineManager,
} from '@tanstack/react-query';

import App from './App';
import './index.css';

import { HelmetProvider } from 'react-helmet-async';

import { AuthProvider } from './hooks/useAuth';
import { UnreadMessagesProvider } from './hooks/UnreadMessagesContext';

import { ErrorBoundary } from './components/ErrorBoundary';

import {
  initializeTrustedTypes,
  initializeDefaultPolicy,
} from './utils/trustedTypes';

import { initializePerformanceOptimizations } from './utils/performanceOptimization';
import { initPerformanceMonitoring } from './utils/performanceMonitor';

import { checkSupabaseConnection } from './integrations/supabase/client';

import { logError } from './lib/errorHandler';

// OPTIONAL — keep disabled until stability confirmed
// import { setupPersistedQueryClient } from './persistQueryClient';

//
// --------------------------------------------------
// TRUSTED TYPES
// --------------------------------------------------
//

if (typeof window !== 'undefined') {
  initializeTrustedTypes();
  initializeDefaultPolicy();
}

//
// --------------------------------------------------
// LOADING UI
// --------------------------------------------------
//

const LoadingFallback = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
      <p className="text-gray-600 text-lg">
        Loading application...
      </p>
    </div>
  </div>
);

//
// --------------------------------------------------
// QUERY CLIENT
// --------------------------------------------------
//

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      console.error(
        '[React Query] Query Error:',
        query.queryKey,
        error
      );

      logError(error as Error, {
        message: `Query error: ${JSON.stringify(query.queryKey)}`,
      }).catch(() => {});
    },
  }),

  mutationCache: new MutationCache({
    onError: (error) => {
      console.error('[React Query] Mutation Error:', error);

      logError(error as Error, {
        message: 'Mutation error',
      }).catch(() => {});
    },
  }),


  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      gcTime: 1000 * 60 * 60,
      refetchOnWindowFocus: true,
      refetchOnMount: false,
      refetchOnReconnect: true,
      retry: (failureCount, error: any) => {
        const status = error?.status || error?.response?.status;
        if (status === 401 || status === 403) return false;
        return failureCount < 3;
      },
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
    },
    mutations: {
      retry: 1,
    },
  },
});

//
// --------------------------------------------------
// ONLINE MANAGER
// --------------------------------------------------
//

onlineManager.setEventListener((setOnline) => {
  const updateOnlineStatus = () => {
    setOnline(navigator.onLine);
  };

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);

  return () => {
    window.removeEventListener('online', updateOnlineStatus);
    window.removeEventListener('offline', updateOnlineStatus);
  };
});

//
// --------------------------------------------------
// GLOBAL ERROR HANDLING
// --------------------------------------------------
//

window.addEventListener('error', (event) => {
  console.error('[Global Error]', event.error);

  if (event.error) {
    logError(event.error, {
      message: event.message,
    }).catch(() => {});
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('[Unhandled Rejection]', event.reason);

  const error =
    event.reason instanceof Error
      ? event.reason
      : new Error(String(event.reason));

  logError(error, {
    message: 'Unhandled promise rejection',
  }).catch(() => {});
});

//
// --------------------------------------------------
// APP TREE
// --------------------------------------------------
//

function AppTree() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <AuthProvider>
            <UnreadMessagesProvider>
              <Suspense fallback={<LoadingFallback />}>
                <App />
              </Suspense>
            </UnreadMessagesProvider>
          </AuthProvider>
        </HelmetProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

//
// --------------------------------------------------
// ROOT MANAGEMENT
// --------------------------------------------------
//

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

let appRoot: Root | null =
  (window as any).__APP_ROOT__ || null;

function renderApp() {
  if (!appRoot) {
    appRoot = createRoot(rootElement);
    (window as any).__APP_ROOT__ = appRoot;
  }

  appRoot.render(<AppTree />);
}

//
// --------------------------------------------------
// INIT
// --------------------------------------------------
//

async function init() {
  try {
    initializePerformanceOptimizations();

    if (process.env.NODE_ENV === 'development') {
      initPerformanceMonitoring();
    }

    //
    // Check Supabase connection
    //

    try {
      const connected = await Promise.race([
        checkSupabaseConnection(),
        new Promise<boolean>((_, reject) =>
          setTimeout(
            () => reject(new Error('timeout')),
            5000
          )
        ),
      ]);

      console.log(
        connected
          ? '[Supabase] Connected'
          : '[Supabase] Connection unavailable'
      );
    } catch (err) {
      console.warn(
        '[Supabase] Continuing despite failed connection check'
      );
    }




    // setupPersistedQueryClient(queryClient);

    //
    // Render app
    //

    renderApp();
  } catch (error) {
    console.error('[App Init Failed]', error);

    renderApp();
  }
}

//
// --------------------------------------------------
// START
// --------------------------------------------------
//

init();