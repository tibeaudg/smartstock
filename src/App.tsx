import React, { Suspense, useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StockManagementApp } from "./components/StockManagementApp";
import { HomePage } from "./components/HomePage";
import { AuthPage } from "./components/AuthPage";
import NotFound from "./pages/NotFound";
import ServerError from "./pages/ServerError";
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
import { AdvancedReports } from './components/analytics/AdvancedReports';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ErrorTestComponent } from './components/ErrorTestComponent';
import FeaturesPage from './components/FeaturesPage';
import CookieConsent from './components/CookieConsent';
import { useCookieConsent } from './hooks/useCookieConsent';
import { getSeoRoutes } from './routes/seoRoutes';
import { ThemeProvider } from './hooks/useTheme';
import HelpCenterPage from "./pages/help-center";
import BillOfMaterialsPage from './pages/BillOfMaterialsPage';
import BOMEditPage from './pages/BillOfMaterialsPage'
import AdminPage from './pages/admin';
import PricingPage from './pages/pricing';
import ResourcesPage from './pages/resources';
import CustomersPage from './pages/customers';
import CustomerDetailPage from './pages/customers/[id]';
import ReportingPage from './pages/reporting';
import WarehousePage from "./pages/WarehousePage";
import AboutPage from "./pages/about";
import SupportPage from "./pages/help-center";
import VideosPage from "./pages/videos";
import IntegrationsPage from "./pages/integrations";
import SalesOrdersPage from "./pages/sales-orders";
import VendorManagementPage from "./pages/VendorManagement";



const CategorysPage = React.lazy(() => import('./pages/products'));
const CategoriesPage = React.lazy(() => import('./pages/CategoriesPage'));
const ProductDetailPage = React.lazy(() => import('./pages/ProductDetailPage'));
const AddProductPage = React.lazy(() => import('./pages/AddProductPage'));

const LoadingScreen = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

const AppRouter = () => {
  useNavigationQueryReset();

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading, userProfile } = useAuth();
    const location = useLocation();
    const [forceRender, setForceRender] = useState(false);

    useEffect(() => {
      if (loading) {
        const timeout = setTimeout(() => setForceRender(true), 10000);
        return () => clearTimeout(timeout);
      } else {
        setForceRender(false);
      }
    }, [loading]);

    if (location.pathname === '/reset-password') return <>{children}</>;
    if (loading && !forceRender) return <LoadingScreen />;

    if (forceRender && loading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-xl font-bold mb-2">Authentication Timeout</h2>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => window.location.reload()}>Refresh</Button>
              <Button onClick={() => window.location.href = '/auth'}>Login</Button>
            </div>
          </div>
        </div>
      );
    }

    if (!user || !userProfile) return <Navigate to="/auth" state={{ from: location }} replace />;

    if (userProfile.blocked) {
      const allowed = ['/dashboard/settings/invoicing', '/dashboard/settings/facturatie'].some(p => location.pathname.startsWith(p));
      if (!allowed) {
        window.location.replace('/dashboard/settings/invoicing');
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

  const BranchAwareRoute = ({ children }: { children: React.ReactNode }) => {
    const { branches, hasNoBranches, loading, hasError, queryLoading, isInitialLoad } = useBranches();
    const { authLoading } = useAuth();

    if (loading || authLoading) return <LoadingScreen />;
    if (!isInitialLoad && !queryLoading && !hasError && hasNoBranches && branches.length === 0) return <FirstBranchSetup />;
    
    return <>{children}</>;
  };

  const AuthRoute = () => {
    const { user, userProfile, loading } = useAuth();
    const location = useLocation();
    const from = (location.state as any)?.from?.pathname || "/dashboard";
    const force = new URLSearchParams(location.search).get('force') === 'true';

    if (loading) return <LoadingScreen />;
    if (user && userProfile && !force) return <Navigate to={from} replace />;
    return <AuthPage />;
  };

  return (
    <ContentWrapper>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<><SEO title="Free Inventory Management Software" /><HomePage /></>} />
        <Route path="/features" element={<><SEO title="Features & Capabilities" /><FeaturesPage /></>} />
        <Route path="/reporting" element={<><SEO title="Inventory Reporting & Analytics" /><ReportingPage /></>} />
        <Route path="/pricing" element={<><SEO title="Pricing & Plans" /><PricingPage /></>} />
        <Route path="/resources" element={<><SEO title="Resources & Guides" /><ResourcesPage /></>} />
        <Route path="/customers" element={<><SEO title="Our Customers" /><CustomersPage /></>} />
        <Route path="/customers/:id" element={<><SEO title="Customer Details" /><CustomerDetailPage /></>} />
        <Route path="/auth" element={<><SEO title="Login to StockFlow" /><AuthRoute /></>} />
        <Route path="/about" element={<><SEO title="About StockFlow" /><AboutPage /></>} />
        <Route path="/help-center" element={<><SEO title="Help Center" /><SupportPage /></>} />
        <Route path='/videos' element={<><SEO title="Instruction Videos" /><VideosPage /></>} />
        <Route path='/integrations' element={<><SEO title="Integrations"/><IntegrationsPage /></>} />

        {/* REDIRECTS */}
        <Route path="/inventory-software-management" element={<Navigate to="/solutions/inventory-software-management" replace />} />
        <Route path="/asset-tracking" element={<Navigate to="/solutions/asset-tracking" replace />} />

        {/* DYNAMIC SEO ROUTES */}
        {getSeoRoutes().map(r => (
          <Route key={r.path} path={r.path} element={r.element} />
        ))}

        {/* ADMIN ROUTES - Fixed 404 by moving outside of complex branch nesting */}
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
            <Route path="user/:id" element={<AdminUserDetailPage />} />
          </Route>
        </Route>

        {/* DASHBOARD ROUTES */}
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
          <Route index element={<><SEO title="StockFlow Dashboard" /><Dashboard userRole="staff" /></>} />
          <Route path="categories" element={<><SEO title="Product Inventory" /><CategorysPage /></>} />
          <Route path="categories-management" element={<CategoriesPage />} />
          <Route path="products/new" element={<AddProductPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="warehouses" element={<><SEO title="Warehouse Management" /><WarehousePage /></>} />
            // In your router configuration (e.g., App.tsx or router.tsx)
          <Route path="bom" element={<BillOfMaterialsPage />}>
            <Route path="edit/:productId" element={<BOMEditPage />} />
          </Route>
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
          <Route path="sales-orders" element={<SalesOrdersPage />} />
          <Route path="vendor-management" element={<VendorManagementPage />} />

        </Route>

        {/* ERROR & FALLBACK */}
        <Route path="/500" element={<ServerError />} />
        <Route path="*" element={<><SEO title="Page Not Found" /><NotFound /></>} />
      </Routes>
    </ContentWrapper>
  );
};

export default function App() {
  useCookieConsent();

  return (
    <ErrorBoundary>
      <PreloadResources criticalFonts={[]} />
      <AuthProvider>
        <CurrencyProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <AppRouter />
            </BrowserRouter>
            <CookieConsent />
          </TooltipProvider>
        </CurrencyProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}