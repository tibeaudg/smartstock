import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { checkSupabaseConnection } from './integrations/supabase/client';
import { Suspense } from 'react';
import React from 'react';

const root = document.getElementById("root");

if (!root) {
  throw new Error('Root element not found');
}

// Create error boundary component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">
              We're sorry, but something went wrong. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Initialize the app with connection check
const init = async () => {
  try {
    console.log('Starting app initialization...');
    const isConnected = await checkSupabaseConnection();
    
    if (!isConnected) {
      throw new Error('Could not connect to Supabase');
    }

    createRoot(root).render(
      <ErrorBoundary>
        <Suspense fallback={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading application...</p>
            </div>
          </div>
        }>
          <App />
        </Suspense>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('Failed to initialize app:', error);
    createRoot(root).render(
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Connection Error</h1>
          <p className="text-gray-600 mb-4">
            Could not connect to the server. Please check your internet connection and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }
};

init();
