import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Routes, Route, useLocation } from 'react-router-dom';
import { createOrGetGuestSession, initializeDemoData } from '@/lib/demo/demoDataService';
import { DemoLayout } from '@/components/DemoLayout';
import { DemoDashboard } from '@/components/demo/DemoDashboard';
import { DemoCategories } from '@/components/demo/DemoCategories';
import { DemoTransactions } from '@/components/demo/DemoTransactions';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Context to provide session token to child components
export const DemoContext = React.createContext<{ sessionToken: string | null }>({ sessionToken: null });

function DemoRoutes() {
  const location = useLocation();
  const sessionToken = React.useContext(DemoContext).sessionToken;

  // Determine which component to render based on path
  if (location.pathname === '/demo' || location.pathname === '/demo/') {
    return <DemoDashboard sessionToken={sessionToken} />;
  } else if (location.pathname === '/demo/categories') {
    return <DemoCategories sessionToken={sessionToken} />;
  } else if (location.pathname === '/demo/transactions') {
    return <DemoTransactions sessionToken={sessionToken} />;
  }

  return <DemoDashboard sessionToken={sessionToken} />;
}

export default function DemoPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoDataInitialized, setDemoDataInitialized] = useState(false);

  useEffect(() => {
    initializeDemo();
  }, []);

  const initializeDemo = async () => {
    try {
      // Get or create session token
      const tokenFromUrl = searchParams.get('token');
      const session = await createOrGetGuestSession(tokenFromUrl || undefined);

      if (!session) {
        toast.error('Failed to initialize demo session');
        setLoading(false);
        return;
      }

      const token = session.session_token;
      setSessionToken(token);

      // Update URL with token if not present
      if (!tokenFromUrl) {
        setSearchParams({ token }, { replace: true });
      }

      // Initialize demo data if not already created
      if (!session.demo_data_created) {
        console.log('[Demo] Initializing demo data for token:', token);
        const success = await initializeDemoData(token);
        console.log('[Demo] Demo data initialization result:', success);
        if (success) {
          setDemoDataInitialized(true);
          toast.success('Demo data loaded successfully!');
        } else {
          toast.error('Failed to create demo data. Please refresh the page.');
          console.error('[Demo] Failed to initialize demo data');
        }
      } else {
        console.log('[Demo] Demo data already exists for this session');
        setDemoDataInitialized(true);
      }

      setLoading(false);
    } catch (error: any) {
      console.error('Error initializing demo:', error);
      toast.error('Failed to initialize demo');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Setting up your demo...</p>
        </div>
      </div>
    );
  }

  if (!sessionToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Demo Unavailable</h2>
          <p className="text-gray-600 mb-6">
            We couldn't set up your demo session. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <DemoContext.Provider value={{ sessionToken }}>
      <DemoLayout sessionToken={sessionToken}>
        <DemoRoutes />
      </DemoLayout>
    </DemoContext.Provider>
  );
}
