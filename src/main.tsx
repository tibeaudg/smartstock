// Initialize Sentry as early as possible
import * as Sentry from "@sentry/react";

// Prevent multiple Sentry initializations during HMR (Hot Module Reload)
if (!(window as any).__SENTRY_INITIALIZED__) {
  Sentry.init({
    dsn: "https://e491b26fa2d97550098be3eb6fb44715@o4510186798776320.ingest.us.sentry.io/4510186800283648",
    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: true,
    environment: process.env.NODE_ENV || 'development',
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    // Capture Replay for 10% of all sessions,
    // plus for 100% of sessions with an error
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
  });
  (window as any).__SENTRY_INITIALIZED__ = true;
}

import { createRoot, Root } from 'react-dom/client';
import App from './App';
import { UnreadMessagesProvider } from './hooks/UnreadMessagesContext';
import { AuthProvider } from './hooks/useAuth';
import './index.css';
import { checkSupabaseConnection } from './integrations/supabase/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupPersistedQueryClient } from './persistQueryClient';
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from './components/ErrorBoundary';
import { initializePerformanceOptimizations } from './utils/performanceOptimization';
import { initPerformanceMonitoring } from './utils/performanceMonitor';
import { initializeTrustedTypes, initializeDefaultPolicy } from './utils/trustedTypes';
import { Suspense } from 'react';

// Debug code for tracking React.createContext calls
// Disabled to avoid readonly property assignment
// If needed for debugging, temporarily enable this code



const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found in the document');
}

// Store root instance globally to prevent multiple createRoot() calls
let appRoot: Root | null = (window as any).__APP_ROOT__ || null;

// ErrorBoundary wordt nu geïmporteerd vanuit components/ErrorBoundary.tsx

// --- VERNIEUWDE LOADING FALLBACK UI ---
const LoadingFallback = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
      <p className="text-gray-600 text-lg">Loading application...</p>
    </div>
  </div>
);

// --- VERNIEUWDE CONNECTION ERROR UI ---
const ConnectionErrorUI = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
    <div className="bg-white p-8 rounded-xl shadow-md max-w-lg w-full text-center">
        <svg className="mx-auto h-12 w-12 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636a9 9 0 010 12.728m-12.728 0a9 9 0 010-12.728m12.728 0L5.636 18.364m0-12.728L18.364 5.636" />
        </svg>
        <h1 className="text-2xl font-bold text-gray-800 mt-4">Connection Error</h1>
        <p className="text-gray-600 mt-2">
          Cannot connect to the server. Check your internet connection and try again.
        </p>
        <div className="mt-6">
            <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
            >
                Try Again
            </button>
        </div>
    </div>
  </div>
);

// Initialiseer de React-app met een Supabase-verbindingscontrole
async function init() {
  try {
    // Safety check: Ensure React and its core APIs are loaded before proceeding
    // Skipping React.createContext check as it's handled by bundler
    
    // Initialize Trusted Types policies early
    initializeTrustedTypes();
    initializeDefaultPolicy();
    
    // Initialize performance optimizations
    initializePerformanceOptimizations();
    
    // Initialize performance monitoring in development
    if (process.env.NODE_ENV === 'development') {
      initPerformanceMonitoring();
    }
    
    // Add timeout to Supabase connection check to prevent infinite loading
    // In production, we'll be more lenient with connection failures
    let isConnected = false;
    
    if (process.env.NODE_ENV === 'production') {
      // In production, try connection check but don't fail if it times out
      try {
        const connectionTimeout = new Promise<boolean>((_, reject) => {
          setTimeout(() => reject(new Error('Supabase connection timeout')), 5000); // 5 second timeout in production
        });
        
        isConnected = await Promise.race([
          checkSupabaseConnection(),
          connectionTimeout
        ]) as boolean;
        
        if (!isConnected) {
          console.warn('Supabase connection failed, continuing with degraded functionality');
        }
      } catch (error: any) {
        console.warn('Supabase connection check failed, continuing with degraded functionality:', error.message);
        // Don't throw - continue with app initialization
      }
    } else {
      // In development, be stricter about connection requirements
      const connectionTimeout = new Promise<boolean>((_, reject) => {
        setTimeout(() => reject(new Error('Supabase connection timeout')), 10000); // 10 second timeout in dev
      });
      
      isConnected = await Promise.race([
        checkSupabaseConnection(),
        connectionTimeout
      ]) as boolean;

      if (!isConnected) {
        throw new Error('Could not connect to Supabase');
      }
    }

    // Create or reuse the root instance
    if (!appRoot) {
      appRoot = createRoot(rootElement);
      (window as any).__APP_ROOT__ = appRoot;
    }
    
    const AppTree = (
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <HelmetProvider>
            {/* AuthProvider must wrap UnreadMessagesProvider */}
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
    appRoot.render(AppTree);
  } catch (error: any) {
    console.error('App initialization failed:', error);

    // Create or reuse the root instance for error UI
    if (!appRoot) {
      appRoot = createRoot(rootElement);
      (window as any).__APP_ROOT__ = appRoot;
    }
    
    // Show connection error UI with retry option
    appRoot.render(
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-lg w-full text-center">
          <svg className="mx-auto h-12 w-12 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636a9 9 0 010 12.728m-12.728 0a9 9 0 010-12.728m12.728 0L5.636 18.364m0-12.728L18.364 5.636" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800 mt-4">Connection Error</h1>
          <p className="text-gray-600 mt-2 mb-4">
            {error.message?.includes('timeout') 
              ? 'Connection timed out. Please check your internet connection and try again.'
              : 'Cannot connect to the server. Check your internet connection and try again.'
            }
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => {
                // Try to load app without connection check as fallback
                try {
                  const AppTree = (
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
                  appRoot!.render(AppTree);
                } catch (fallbackError: any) {
                  console.error('Fallback initialization failed:', fallbackError);
                  window.location.reload();
                }
              }}
              className="bg-gray-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors"
            >
              Continue Offline
            </button>
          </div>
        </div>
      </div>
    );
  }
}

// Initialize QueryClient for React Query with optimized configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false, // Disabled for better tab switching performance
      refetchOnMount: false, // Use cached data when available
      refetchOnReconnect: 'always', // Always refetch when reconnecting
      retry: (failureCount, error) => {
        // Retry logic: try 3 times, except for 4xx errors
        if (failureCount < 3) {
          const status = (error as any)?.status || (error as any)?.response?.status;
          if (status >= 400 && status < 500) {
            return false; // No retry for client errors
          }
          return true;
        }
        return false;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});

// Make queryClient available globally for usePageRefresh
(window as any).queryClient = queryClient;

if (typeof window !== 'undefined') {
  setupPersistedQueryClient(queryClient);
}

// Onderdruk debug logs altijd
console.debug = () => {};

// Globale error handler voor onverwachte errors
window.addEventListener('error', (event) => {
  console.error('Global error caught:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error,
    timestamp: new Date().toISOString(),
  });
  
  // Send to Sentry
  Sentry.captureException(event.error || new Error(event.message), {
    contexts: {
      errorEvent: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      }
    }
  });
});

// Globale handler voor unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', {
    reason: event.reason,
    promise: event.promise,
    timestamp: new Date().toISOString(),
  });
  
  // Send to Sentry
  Sentry.captureException(event.reason);
});

// Start de applicatie
init();
