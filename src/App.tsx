import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { StockManagementApp } from "./components/StockManagementApp";
import { HomePage } from "./components/HomePage";
import { AuthPage } from "./components/AuthPage";
import NotFound from "./pages/NotFound";
import { Dashboard } from "./components/Dashboard";
import { StockList } from "./components/StockList";
import { StockMovements } from "./components/StockMovements";
import { Settings } from "./components/Settings";
import { useAuth, AuthProvider } from "./hooks/useAuth";
import { Suspense } from "react";
import { ContentWrapper } from "./ContentWrapper";
import AdminInvoicingPage from "./components/AdminInvoicingPage";
import { AlertCircle } from "lucide-react";

// Configure QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minuten
      // --- DEFINITIEVE OPLOSSING ---
      // Zet deze optie op `true`. Dit is de ingebouwde, robuuste oplossing
      // van React Query voor het herstellen van de verbinding en het verversen
      // van data wanneer de gebruiker terugkeert naar de app.
      refetchOnWindowFocus: true, 
      retry: 1,
    },
  },
});

const LoadingScreen = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, userProfile } = useAuth();
  const location = useLocation();

  if (location.pathname === '/reset-password') {
    return <>{children}</>;
  }
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!user || !userProfile) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // BLOCKED USER HANDLING
  if (userProfile.blocked) {
    // Only allow dashboard/settings (facturatie submenu)
    const allowedPaths = [
      '/dashboard',
      '/dashboard/settings',
      '/dashboard/settings/invoicing',
      '/dashboard/settings/facturatie',
      '/dashboard/settings/invoicing/',
      '/dashboard/settings/facturatie/'
    ];
    const isAllowed = allowedPaths.some((p) => location.pathname.startsWith(p));
    if (!isAllowed) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
          <div className="bg-white p-8 rounded shadow max-w-md w-full text-center border border-red-200">
            <AlertCircle size={32} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-red-700 mb-2">Uw account is geblokkeerd</h2>
            <p className="text-gray-700 mb-4">U heeft geen toegang tot andere onderdelen van het platform. U kunt alleen uw facturen bekijken en betalen.</p>
            <Navigate to="/dashboard/settings/invoicing" replace />
          </div>
        </div>
      );
    }
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      {children}
    </Suspense>
  );
};


// Auth Route Component
const AuthRoute = () => {
  const { user, loading, userProfile } = useAuth();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/dashboard";

  if (loading) {
    return <LoadingScreen />;
  }

  if (user && userProfile) {
    return <Navigate to={from} replace />;
  }

  return <AuthPage />;
};

const App = () => {
  return (
    <ContentWrapper>
      <div className="w-screen h-screen bg-white">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Openbare routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/auth" element={<AuthRoute />} />

                  {/* Beschermde dashboard routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <StockManagementApp />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Dashboard userRole="staff" />} />
                    <Route path="stock" element={<StockList />} />
                    <Route path="transactions" element={<StockMovements />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>

                  <Route path="/admin" element={<AdminInvoicingPage />} />

                  {/* Fallback route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </QueryClientProvider>
      </div>
    </ContentWrapper>
  );
};

export default App;
