import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StockManagementApp } from "./components/StockManagementApp";
import { HomePage } from "./components/HomePage";
import { HomePageNL } from "./components/HomePageNL";
import { AuthPage } from "./components/AuthPage";
import NotFound from "./pages/NotFound";
import ServerError from "./pages/ServerError";
import DemoPage from './pages/demo';
import { Dashboard } from './components/Dashboard';
import { StockMovements } from './components/StockMovements';
import { Settings } from './components/Settings';
import { ProfileSettings } from './components/settings/ProfileSettings';
import { BranchManagement } from './components/settings/BranchManagement';
import { UserManagement } from './components/settings/UserManagement';
import { LicenseOverview } from './components/settings/LicenseOverview';
import { InvoicingOverview } from './components/settings/InvoicingOverview';
import { useAuth, AuthProvider } from "./hooks/useAuth";
import { useBranches, BranchProvider } from "./hooks/useBranches";
import { CurrencyProvider } from "./hooks/useCurrency";
import { FirstBranchSetup } from "./components/FirstBranchSetup";
import React, { Suspense, useState, useEffect } from "react";
import { useOptimizedTabSwitching } from "./hooks/useOptimizedTabSwitching";
import { useNavigationQueryReset } from "./hooks/useNavigationQueryReset";
import { useAuthRouteRefresh } from "./hooks/useAuthRouteRefresh";
import { ContentWrapper } from "./ContentWrapper";
import AdminUserDetailPage from './pages/AdminUserDetailPage';
import AdminNotificationsPage from './pages/AdminNotificationsPage';
import SEO from './components/SEO';
import PreloadResources from './components/PreloadResources';
import { Admin } from './components/Admin';
import { AdminChatList } from './components/AdminChatList';
import { CustomReports } from './components/analytics/CustomReports';
import { ExportData } from './components/analytics/ExportData';
import { AdvancedReports } from './components/analytics/AdvancedReports';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ErrorTestComponent } from './components/ErrorTestComponent';
import FeaturesPage from './components/FeaturesPage';
import CookieConsent from './components/CookieConsent';
import { useCookieConsent } from './hooks/useCookieConsent';
import { getSeoRoutes } from './routes/seoRoutes';
import { ThemeProvider } from './hooks/useTheme';


// (SEO pages are auto-imported via getSeoRoutes)

// Import remaining synchronous pages
import HelpCenterPage from "./pages/help-center";
import CategorysPage from './pages/products';
import CategoriesPage from './pages/CategoriesPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AddProductPage from './pages/AddProductPage';
import BillOfMaterialsPage from './pages/BillOfMaterialsPage';
import AdminPage from './pages/admin';
import PricingPage from './pages/pricing';
import CheckoutPage from './pages/checkout';
import ResourcesPage from './pages/resources';
import CustomersPage from './pages/customers';
import CustomerDetailPage from './pages/customers/[id]';
import ReportingPage from './pages/reporting';
import { AdminSubscriptionManagement } from './components/admin/SubscriptionManagement';
import { AuthContext } from './hooks/useAuth';
import WarehousePage from "./pages/WarehousePage";

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
  
  // Note: useAuthRouteRefresh removed - it was causing full page reloads
  // useFocusDataRefresh in ContentWrapper handles data refresh more gracefully

  
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
      <ThemeProvider>
        <Suspense fallback={<LoadingScreen />}>
          {children}
        </Suspense>
      </ThemeProvider>
    );
  };

  // Branch-aware route component (must be used inside BranchProvider)
  const BranchAwareRoute = ({ children }: { children: React.ReactNode }) => {
    const { branches, hasNoBranches, loading: branchesLoading, hasError, queryLoading, isInitialLoad } = useBranches();
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
    // Only show this if:
    // 1. Initial load has completed (isInitialLoad is false)
    // 2. Query is not loading (queryLoading is false)
    // 3. No error occurred
    // 4. We're certain there are no branches (hasNoBranches is true)
    // This prevents showing the popup before we've actually checked if branches exist
    if (!isInitialLoad && !queryLoading && !hasError && hasNoBranches && branches.length === 0) {
      console.debug('[BranchAwareRoute] No branches found after initial load, showing FirstBranchSetup');
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
        <Route path="/reporting" element={<ReportingPage />} />
        <Route path="/error-test" element={<ErrorTestComponent />} />
        <Route path="/auth" element={<AuthRoute />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/demo/*" element={<DemoPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/customers/:id" element={<CustomerDetailPage />} />

        {/* Legacy route redirects */}
        <Route path="/inventory-software-management" element={<Navigate to="/solutions/inventory-software-management" replace />} />
        <Route path="/asset-tracking" element={<Navigate to="/solutions/asset-tracking" replace />} />

        {/* SEO routes (auto-generated from src/pages/SEO) */}
        {(() => {
          const seoRoutes = getSeoRoutes();
          // Debug: Check if inventory-software-management route exists
          const targetRoute = seoRoutes.find(r => r.path === '/solutions/inventory-software-management');
          if (targetRoute) {
            console.log('[App] ✅ /solutions/inventory-software-management route is registered');
          } else {
            console.error('[App] ❌ /solutions/inventory-software-management route is MISSING!');
            console.log('[App] Available SEO routes:', seoRoutes.map(r => r.path).slice(0, 20));
          }
          return seoRoutes.map(r => (
            <Route key={r.path} path={r.path} element={r.element} />
          ));
        })()}

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
          <Route path="stock" element={<Navigate to="/dashboard/categories" replace />} />
          <Route path="categories" element={<CategorysPage />} />
          <Route path="categories-management" element={<CategoriesPage />} />
          <Route path="products/new" element={<AddProductPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="warehouses" element={<WarehousePage />} />
          <Route path="bom" element={<BillOfMaterialsPage />} />
          <Route path="transactions" element={<StockMovements />} />

          <Route path="analytics/reports" element={<CustomReports />} />
          <Route path="analytics/advanced" element={<AdvancedReports />} />
          <Route path="analytics/export" element={<ExportData />} />
          <Route path="settings" element={<Settings />}>
            <Route index element={<ProfileSettings />} />
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="branches" element={<BranchManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="help-center" element={<HelpCenterPage />} />
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

        {/* Error routes */}
        <Route path="/500" element={<ServerError />} />
        
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
        </CurrencyProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}