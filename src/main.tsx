import React, { Suspense, ReactNode, Component } from 'react';
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
import { initClarity } from './services/clarityService';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found in the document');
}

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
  let root: Root;
  try {
    // Initialize Microsoft Clarity
    initClarity();
    
    const isConnected = await checkSupabaseConnection();

    if (!isConnected) {
      throw new Error('Could not connect to Supabase');
    }

    // De root wordt hier aangemaakt en de app wordt gerenderd
    root = createRoot(rootElement);
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
    root.render(AppTree);
  } catch (error) {
    console.error('App initialization failed:', error);

    // Render de fout-UI bij een verbindingsfout
    root = createRoot(rootElement);
    root.render(<ConnectionErrorUI />);
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
});

// Globale handler voor unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', {
    reason: event.reason,
    promise: event.promise,
    timestamp: new Date().toISOString(),
  });
});

// Start de applicatie
init();
