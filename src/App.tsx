import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { StripeProvider } from "@/components/providers/StripeProvider";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StockManagementApp } from "./components/StockManagementApp";
import { HomePage } from "./components/HomePage";
import { HomePageNL } from "./components/HomePageNL";
import { AuthPage } from "./components/AuthPage";
import NotFound from "./pages/NotFound";
import SEOOverviewPage from './pages/seo';
import { Dashboard } from './components/Dashboard';
import { StockList } from './components/StockList';
import { StockMovements } from './components/StockMovements';
import { Settings } from './components/Settings';
import { ProfileSettings } from './components/settings/ProfileSettings';
import { BranchManagement } from './components/settings/BranchManagement';
import { UserManagement } from './components/settings/UserManagement';
import { LicenseOverview } from './components/settings/LicenseOverview';
import { InvoicingOverview } from './components/settings/InvoicingOverview';
import { InvoiceList } from './components/payments/InvoiceList';
import IntegrationsSettings from './components/settings/Integrations';
import IntegrationsPage from './pages/integrations';
import { useAuth, AuthProvider } from "./hooks/useAuth";
import { useBranches, BranchProvider } from "./hooks/useBranches";
import { CurrencyProvider } from "./hooks/useCurrency";
import { FirstBranchSetup } from "./components/FirstBranchSetup";
import React, { Suspense, useState, useEffect } from "react";
import { useOptimizedTabSwitching } from "./hooks/useOptimizedTabSwitching";
import { useNavigationQueryReset } from "./hooks/useNavigationQueryReset";
import { ContentWrapper } from "./ContentWrapper";
import AdminUserDetailPage from './pages/AdminUserDetailPage';
import AdminNotificationsPage from './pages/AdminNotificationsPage';
import SEO from './components/SEO';
import PreloadResources from './components/PreloadResources';
import { Admin } from './components/Admin';
import { AdminChatList } from './components/AdminChatList';
import { CustomReports } from './components/analytics/CustomReports';
import { ExportData } from './components/analytics/ExportData';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ErrorTestComponent } from './components/ErrorTestComponent';
import FeaturesPage from './components/FeaturesPage';
import CookieConsent from './components/CookieConsent';
import { useCookieConsent } from './hooks/useCookieConsent';
import { getSeoRoutes } from './routes/seoRoutes';

// (SEO pages are auto-imported via getSeoRoutes)

// Import remaining synchronous pages
import SubscriptionTestPage from './pages/subscription-test';
import NlPricingPage from "./pages/nl-pricing";
import MobileAppPage from "./pages/mobile-app";
import HelpCenterPage from "./pages/help-center";
import CategorysPage from './pages/categories';
import SuppliersPage from './pages/suppliers';
import AdminPage from './pages/admin';
import PricingPage from './pages/pricing';
import CheckoutPage from './pages/checkout';
import { SubscriptionManagement } from './components/settings/SubscriptionManagement';
import { AdminSubscriptionManagement } from './components/admin/SubscriptionManagement';

import { AuthContext } from './hooks/useAuth';

// Loading Screen Component
const LoadingScreen = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Router component that contains the route definitions
const AppRouter = () => {
  // Reset query state on navigation to prevent hanging loading states
  // This must be inside the Router context
  useNavigationQueryReset();

  
  // Protected Route Component (without branch logic)
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading, userProfile } = useAuth();
    const location = useLocation();
    const [forceRender, setForceRender] = useState(false);

    // Safety timeout - force render after 10 seconds if still loading
    useEffect(() => {
      if (loading) {
        console.warn('[ProtectedRoute] Auth loading detected, starting safety timer');
        const timeout = setTimeout(() => {
          console.error('[ProtectedRoute] Auth loading timeout - forcing render');
          setForceRender(true);
        }, 10000);
        
        return () => clearTimeout(timeout);
      } else {
        setForceRender(false);
      }
    }, [loading]);

    // Debug: log auth state and location
    console.debug('[ProtectedRoute] user:', user);
    console.debug('[ProtectedRoute] userProfile:', userProfile);
    console.debug('[ProtectedRoute] loading:', loading);
    console.debug('[ProtectedRoute] location:', location.pathname);

    if (location.pathname === '/reset-password') {
      return <>{children}</>;
    }
    
    if (loading && !forceRender) {
      console.debug('[ProtectedRoute] Loading...');
      return <LoadingScreen />;
    }

    // If we're force rendering due to timeout, show a retry option
    if (forceRender && loading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Authentication taking longer than expected</h2>
            <p className="text-gray-600 mb-6">
              We're having trouble verifying your authentication. This might be due to a slow connection or server issue.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
              >
                Refresh Page
              </button>
              <button
                onClick={() => {
                  setForceRender(false);
                  // Force continue to auth page
                  window.location.href = '/auth';
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      );
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

  // Branch-aware route component (must be used inside BranchProvider)
  const BranchAwareRoute = ({ children }: { children: React.ReactNode }) => {
    const { branches, hasNoBranches, loading: branchesLoading, hasError } = useBranches();
    const { authLoading } = useAuth();
    const [forceRender, setForceRender] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    // Safety timeout - force render after 8 seconds (increased from 5)
    useEffect(() => {
      if (branchesLoading && !authLoading) {
        console.warn('[BranchAwareRoute] Branch loading detected, starting safety timer');
        const timeout = setTimeout(() => {
          console.error('[BranchAwareRoute] Safety timeout reached - showing retry option');
          setForceRender(true);
        }, 8000);
        
        return () => clearTimeout(timeout);
      }
    }, [branchesLoading, authLoading]);

    // Show loading only if auth is also loading OR branches are loading (but not too long)
    if ((branchesLoading || authLoading) && !forceRender) {
      console.debug('[BranchAwareRoute] Loading... (auth:', authLoading, 'branches:', branchesLoading, 'count:', branches?.length, ')');
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              {authLoading ? 'Checking authentication...' : 'Loading your workspace...'}
            </p>
            <p className="text-xs text-gray-400 mt-2">This should only take a moment</p>
          </div>
        </div>
      );
    }

    // If force render is triggered (timeout), show retry option
    if (forceRender && branchesLoading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Taking longer than expected</h2>
            <p className="text-gray-600 mb-6">
              We're having trouble loading your workspace. This might be due to a slow connection.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Refresh Page
              </Button>
              <Button
                onClick={() => {
                  setForceRender(false);
                  setRetryCount(c => c + 1);
                }}
                variant="outline"
              >
                Continue Anyway
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // Check if user has no branches and needs to create their first branch
    // Only show this if we're certain (not loading, no error, and explicitly hasNoBranches)
    if (hasNoBranches && branches.length === 0 && !branchesLoading && !hasError) {
      console.debug('[BranchAwareRoute] No branches found, showing FirstBranchSetup');
      return <FirstBranchSetup />;
    }

    // If there's an error loading branches, show error state instead of continuing
    if (hasError && !branchesLoading) {
      console.debug('[BranchAwareRoute] Error loading branches, showing error state');
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to load workspace</h2>
            <p className="text-gray-600 mb-6">
              We encountered an issue loading your workspace. This might be due to a connection problem.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Refresh Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    console.debug('[BranchAwareRoute] Rendering children (branches:', branches?.length, ')');
    return <>{children}</>;
  };

  // Auth Route Component
const AuthRoute = () => {
  const authCtx = React.useContext(AuthContext);
  const user = authCtx?.user || null;

    const loading = authCtx?.loading ?? true;
    const userProfile = authCtx?.userProfile || null;
    const location = useLocation();
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/dashboard";

    if (loading) {
      return <LoadingScreen />;
    }

    if (user && userProfile) {
      return <Navigate to={from} replace />;
    }

    return <AuthPage />;
  };

  return (
    <ContentWrapper>
      <Routes>
        {/* Openbare routes */}
        <Route path="/" element={<HomePage />} />
        
        {/* Dutch Homepage */}
        <Route path="/nl" element={<HomePageNL />} />


        
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/error-test" element={<ErrorTestComponent />} />
        <Route path="/auth" element={<AuthRoute />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/nl/pricing" element={<NlPricingPage />} />
        <Route path="/integrations" element={<IntegrationsPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/seo" element={<SEOOverviewPage />} />

        {/* SEO routes (auto-generated from src/pages/SEO) */}
        {getSeoRoutes().map(r => (
          <Route key={r.path} path={r.path} element={r.element} />
        ))}

        {/* NL/EN aliases (preserve legacy URLs) */}
        <Route path="/nl/voorraadbeheer-tips" element={<Navigate to="/voorraadbeheer-tips" replace />} />
        <Route path="/nl/voorraadbeheer-software-vergelijken" element={<Navigate to="/voorraadbeheer-software-vergelijken" replace />} />
        <Route path="/nl/voorraadbeheer-fouten-voorkomen" element={<Navigate to="/voorraadbeheer-fouten-voorkomen" replace />} />

        <Route path="/mobile-app" element={<MobileAppPage />} />
        <Route path="/nl/voorraadbeheer-voor-starters" element={<Navigate to="/voorraadbeheer-voor-starters" replace />} />
        <Route path="/nl/mobiel-voorraadbeheer" element={<Navigate to="/mobiel-voorraadbeheer" replace />} />
        <Route path="/nl/voorraadbeheer-software" element={<Navigate to="/voorraadbeheer-software" replace />} />
        <Route path="/nl/magazijnbeheer" element={<Navigate to="/magazijnbeheer" replace />} />
        <Route path="/en/warehouse-management" element={<Navigate to="/warehouse-management" replace />} />
        <Route path="/nl/stockbeheer-software" element={<Navigate to="/stockbeheer-software" replace />} />
        <Route path="/nl/software-stockbeheer" element={<Navigate to="/software-stockbeheer" replace />} />
        <Route path="/nl/stockbeheer-programma" element={<Navigate to="/stockbeheer-programma" replace />} />
        <Route path="/nl/programma-stockbeheer" element={<Navigate to="/programma-stockbeheer" replace />} />
        <Route path="/nl/magazijnbeheer-software" element={<Navigate to="/magazijnbeheer-software" replace />} />
        <Route path="/nl/voorraadbeheer" element={<Navigate to="/voorraadbeheer" replace />} />
        <Route path="/nl/wat-is-voorraadbeheer-software" element={<Navigate to="/wat-is-voorraadbeheer-software" replace />} />
        <Route path="/nl/voorraadbeheer-horeca" element={<Navigate to="/voorraadbeheer-horeca" replace />} />
        <Route path="/nl/stockbeheer" element={<Navigate to="/stockbeheer" replace />} />
        <Route path="/nl/simpelstockbeheer" element={<Navigate to="/simpelstockbeheer" replace />} />
        <Route path="/nl/gratis-voorraadbeheer" element={<Navigate to="/gratis-voorraadbeheer" replace />} />
        <Route path="/nl/gratis-stockbeheer" element={<Navigate to="/gratis-stockbeheer" replace />} />
        <Route path="/nl/gratis-voorraadbeheer-app" element={<Navigate to="/gratis-voorraadbeheer-app" replace />} />
        <Route path="/nl/gratis-voorraadbeheer-software" element={<Navigate to="/gratis-voorraadbeheer-software" replace />} />
        <Route path="/nl/programma-stockbeheer-gratis" element={<Navigate to="/programma-stockbeheer-gratis" replace />} />
        <Route path="/nl/voorraadbeheer-app" element={<Navigate to="/voorraadbeheer-app" replace />} />



        {/* Beschermde dashboard routesfefe */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <BranchProvider>
                <BranchAwareRoute>
                  <StockManagementApp />
                </BranchAwareRoute>
              </BranchProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard userRole="staff" />} />
          <Route path="barcoding" element={<Navigate to="/barcoding" replace />} />
          <Route path="subscription-test" element={<SubscriptionTestPage />} />
          <Route path="stock" element={<StockList />} />
          <Route path="categories" element={<CategorysPage />} />
          <Route path="suppliers" element={<SuppliersPage />} />
          <Route path="transactions" element={<StockMovements />} />

          <Route path="analytics/reports" element={<CustomReports />} />
          <Route path="analytics/export" element={<ExportData />} />
          <Route path="settings" element={<Settings />}>
            <Route index element={<ProfileSettings />} />
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="branches" element={<BranchManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="subscription" element={<SubscriptionManagement />} />
            <Route path="integrations" element={<IntegrationsSettings />} />
            <Route path="help-center" element={<HelpCenterPage />} />
            <Route path="invoices" element={<InvoiceList />} />
            <Route path="license" element={<LicenseOverview />} />
            <Route path="invoicing" element={<InvoicingOverview />} />
          </Route>
        </Route>

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <BranchProvider>
                <BranchAwareRoute>
                  <StockManagementApp />
                </BranchAwareRoute>
              </BranchProvider>
            </ProtectedRoute>
          }
        >
          <Route element={<Admin />}>
            <Route path="notifications" element={<AdminNotificationsPage />} />
            <Route path="chat" element={<AdminChatList />} />
            <Route path="subscriptions" element={<AdminSubscriptionManagement />} />

            <Route path="user/:id" element={<AdminUserDetailPage />} />
          </Route>
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ContentWrapper>
  );
};

export default function App() {
  // Use the optimized tab switching hook at the top level
  useOptimizedTabSwitching();
  
  // Initialize cookie consent and tracking
  useCookieConsent();
  

  return (
    <ErrorBoundary>
      <SEO/>
      {/* logo.png and Inventory-Management.png are already preloaded in index.html */}
      <PreloadResources 
        criticalFonts={[]}
      />
      {/* QueryClientProvider wordt nu beheerd in main.tsx */}
      <AuthProvider>
        <CurrencyProvider>
          <StripeProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter
                future={{
                  v7_startTransition: true,
                  v7_relativeSplatPath: true,
                }}
              >
                <AppRouter />
              </BrowserRouter>
              <CookieConsent />
            </TooltipProvider>
          </StripeProvider>
        </CurrencyProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}