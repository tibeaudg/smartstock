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
import AdminUserDetailPage from './pages/AdminUserDetailPage';
import { AlertCircle } from "lucide-react";
import SEO from './components/SEO';

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

  // Debug: log auth state and location
  console.debug('[ProtectedRoute] user:', user);
  console.debug('[ProtectedRoute] userProfile:', userProfile);
  console.debug('[ProtectedRoute] loading:', loading);
  console.debug('[ProtectedRoute] location:', location.pathname);

  if (location.pathname === '/reset-password') {
    return <>{children}</>;
  }
  
  if (loading) {
    console.debug('[ProtectedRoute] Loading...');
    return <LoadingScreen />;
  }
  
  if (!user || !userProfile) {
    console.debug('[ProtectedRoute] Not authenticated, redirecting to /auth');
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
    console.debug('[ProtectedRoute] Blocked user, isAllowed:', isAllowed);
    if (!isAllowed) {
      // Forceer een redirect zodat de gebruiker altijd op de juiste pagina komt
      window.location.replace('/dashboard/settings/invoicing');
      return null;
    }
  } else {
    // Als user niet meer geblokkeerd is, maar nog op een facturatiepagina staat, redirect naar dashboard
    const invoicingPaths = [
      '/dashboard/settings/invoicing',
      '/dashboard/settings/facturatie',
      '/dashboard/settings/invoicing/',
      '/dashboard/settings/facturatie/'
    ];
    const isOnInvoicing = invoicingPaths.some((p) => location.pathname.startsWith(p));
    if (isOnInvoicing) {
      window.location.replace('/dashboard');
      return null;
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

function App() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "stockflow",
    "image": "https://www.stockflow.be/logo.png",
    "@id": "https://www.stockflow.be/",
    "url": "https://www.stockflow.be/",
    "telephone": "+32-123-456-789",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Voorbeeldstraat 1",
      "addressLocality": "Gent",
      "postalCode": "9000",
      "addressCountry": "BE"
    },
    "description": "Simpel stockbeheer voor KMO's en zelfstandigen. Beheer je voorraad eenvoudig online met stockflow.",
    "areaServed": ["Gent", "Brugge", "Antwerpen", "Vlaanderen"]
  };
  return (
    <>
      <SEO structuredData={localBusinessSchema} />
      <ContentWrapper>
        {/* Verwijderde dubbele wrapper */}
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
                  <Route path="/admin/user/:id" element={<AdminUserDetailPage />} />

                  {/* Fallback route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ContentWrapper>
    </>
  );
}

export default App;
