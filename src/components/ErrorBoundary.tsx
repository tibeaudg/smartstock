import React, { Component, ReactNode } from 'react';
import { logError, ErrorInfo } from '@/lib/errorHandler';
import * as Sentry from '@sentry/react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  showDetails: boolean;
}

/**
 * Verbeterde ErrorBoundary component met betere logging en recovery
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    
    // Send to Sentry with component stack
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        }
      }
    });
    
    // Log de error met uitgebreide contextuele informatie (async, don't await)
    logError(error, {
      componentStack: errorInfo.componentStack,
      message: `ErrorBoundary caught error: ${error.message}`,
    }).catch(() => {
      // Silently fail if logging fails
    });

    // Extra debugging informatie voor productie
    console.group('🚨 React Error Boundary Details');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Component Stack:', errorInfo.componentStack);
    console.error('Current URL:', window.location.href);
    console.error('User Agent:', navigator.userAgent);
    console.error('Timestamp:', new Date().toISOString());
    console.groupEnd();

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
  };

  toggleDetails = () => {
    this.setState(prevState => ({ showDetails: !prevState.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
          <div className="bg-white p-8 rounded-xl shadow-md max-w-lg w-full">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h1 className="text-2xl font-bold text-gray-800 mt-4">Er is een onverwachte fout opgetreden</h1>
              <p className="text-gray-600 mt-2">
                Onze excuses voor het ongemak. We zijn op de hoogte van het probleem en werken aan een oplossing.
              </p>
            </div>

            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={this.handleRetry}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
              >
                Opnieuw proberen
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg font-semibold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-colors"
              >
                Pagina vernieuwen
              </button>
            </div>

            <div className="mt-6 border-t pt-4">
              <button
                onClick={this.toggleDetails}
                className="text-sm text-gray-500 hover:text-gray-700 w-full text-left"
              >
                {this.state.showDetails ? 'Verberg details' : 'Toon details'}
                <span className={`float-right transform transition-transform ${this.state.showDetails ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {this.state.showDetails && (
                <div className="mt-4 bg-gray-50 p-4 rounded-lg text-xs text-gray-700 overflow-auto max-h-40">
                  <h3 className="font-bold mb-2">Foutmelding:</h3>
                  <pre className="whitespace-pre-wrap break-words">
                    {this.state.error?.toString()}
                  </pre>
                  <h3 className="font-bold mt-4 mb-2">Component Stack:</h3>
                  <pre className="whitespace-pre-wrap break-words">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
