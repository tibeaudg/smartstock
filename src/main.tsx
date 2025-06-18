import React, { Suspense, ReactNode, Component } from 'react';
import { createRoot, Root } from 'react-dom/client';
import App from './App';
import './index.css';
import { checkSupabaseConnection } from './integrations/supabase/client';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

// Error Boundary class to catch runtime React errors
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
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
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-6">
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

// Loading fallback UI
const LoadingFallback = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
      <p className="text-gray-600">Loading application...</p>
    </div>
  </div>
);

// Connection error UI shown if Supabase check fails
const ConnectionErrorUI = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Connection Error</h1>
      <p className="text-gray-600 mb-6">
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

// Initialize the React app with Supabase connection check
async function init() {
  let root: Root;
  try {
    console.log('Starting app initialization...');
    const isConnected = await checkSupabaseConnection();

    if (!isConnected) {
      throw new Error('Could not connect to Supabase');
    }

    root = createRoot(rootElement);
    root.render(
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <App />
        </Suspense>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('Failed to initialize app:', error);

    // Render error UI on connection failure
    root = createRoot(rootElement);
    root.render(<ConnectionErrorUI />);
  }
}

init();
