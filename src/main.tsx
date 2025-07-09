import React, { Suspense, ReactNode, Component } from 'react';
import { createRoot, Root } from 'react-dom/client';
import App from './App';
import './index.css';
import { checkSupabaseConnection } from './integrations/supabase/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupPersistedQueryClient } from './persistQueryClient';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found in the document');
}

// --- NIEUWE, VERBETERDE ERROR BOUNDARY COMPONENT ---
// Deze component vangt JavaScript-fouten overal in de onderliggende componentenboom op,
// logt deze fouten en toont een gebruiksvriendelijke fallback UI.
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  showDetails: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
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
    // Werk de state bij zodat de volgende render de fallback UI toont.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Vang de fout en de component stack op.
    this.setState({ errorInfo });
    // Log de fout naar de console of een externe logging service.
    console.error('React Error Boundary heeft een fout opgevangen:', error, errorInfo);
  }

  toggleDetails = () => {
    this.setState(prevState => ({ showDetails: !prevState.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI die wordt getoond wanneer een fout is opgetreden.
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
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
              >
                Pagina vernieuwen
              </button>
              <a
                href="/dashboard"
                className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg font-semibold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-colors"
              >
                Naar startpagina
              </a>
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

// --- VERNIEUWDE LOADING FALLBACK UI ---
const LoadingFallback = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
      <p className="text-gray-600 text-lg">Applicatie laden...</p>
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
        <h1 className="text-2xl font-bold text-gray-800 mt-4">Verbindingsfout</h1>
        <p className="text-gray-600 mt-2">
          Kan geen verbinding maken met de server. Controleer je internetverbinding en probeer het opnieuw.
        </p>
        <div className="mt-6">
            <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
            >
                Opnieuw proberen
            </button>
        </div>
    </div>
  </div>
);

// Initialiseer de React-app met een Supabase-verbindingscontrole
async function init() {
  let root: Root;
  try {
    const isConnected = await checkSupabaseConnection();

    if (!isConnected) {
      throw new Error('Kon geen verbinding maken met Supabase');
    }

    // De root wordt hier aangemaakt en de app wordt gerenderd
    root = createRoot(rootElement);
    root.render(
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<LoadingFallback />}>
            <App />
          </Suspense>
        </QueryClientProvider>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('Initialisatie van de app is mislukt:', error);

    // Render de fout-UI bij een verbindingsfout
    root = createRoot(rootElement);
    root.render(<ConnectionErrorUI />);
  }
}

// Initialiseer QueryClient voor React Query
const queryClient = new QueryClient();
if (typeof window !== 'undefined') {
  setupPersistedQueryClient(queryClient);
}

// Start de applicatie
init();
