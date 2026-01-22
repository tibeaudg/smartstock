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
import { UserManagement } from './components/settings/UserManagement';
import { LicenseOverview } from './components/settings/LicenseOverview';
import { InvoicingOverview } from './components/settings/InvoicingOverview';
import { useAuth, AuthProvider } from "./hooks/useAuth";
import { useBranches, BranchProvider } from "./hooks/useBranches";
import { CurrencyProvider } from "./hooks/useCurrency";
import { useNavigationQueryReset } from "./hooks/useNavigationQueryReset";
import { useEnsureBranch } from "./hooks/useEnsureBranch";
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
import BillOfMaterialsPage from './components/products/BillOfMaterials';
import BOMEditPage from './components/products/BillOfMaterials'
import AdminPage from './pages/admin';
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
import VendorManagementPage from "./pages/customer-management";
import CreateSupplierPage from "./pages/CreateCustomerPage";
import EditSupplierPage from "./pages/EditCustomerPage";

const CategorysPage = React.lazy(() => import('./pages/products'));
const CategoriesPage = React.lazy(() => import('./pages/CategoriesPage'));
const ProductDetailPage = React.lazy(() => import('./pages/ProductDetailPage'));
const AddProductPage = React.lazy(() => import('./pages/AddProductPage'));

// Skeletal Loading Components
const SkeletonCard = () => (
  <div className="bg-white rounded-lg shadow p-6 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
  </div>
);

const SkeletonTable = () => (
  <div className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
    </div>
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="px-6 py-4 border-b border-gray-100 flex items-center gap-4">
        <div className="h-4 bg-gray-200 rounded w-1/6"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/5"></div>
        <div className="h-4 bg-gray-200 rounded w-1/6"></div>
      </div>
    ))}
  </div>
);

const SkeletonSidebar = () => (
  <div className="w-64 bg-white border-r border-gray-200 h-screen p-4 animate-pulse">
    <div className="h-8 bg-gray-200 rounded mb-6"></div>
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="mb-4">
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    ))}
  </div>
);

const SkeletonHeader = () => (
  <div className="bg-white border-b border-gray-200 px-6 py-4 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
        <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  </div>
);

const SkeletonDashboard = () => (
  <div className="min-h-screen bg-gray-50">
    <SkeletonHeader />
    <div className="flex">
      <SkeletonSidebar />
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </div>
  </div>
);

const SkeletonContent = () => (
  <div className="min-h-screen bg-gray-50 p-6">
    <div className="max-w-7xl mx-auto">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <SkeletonTable />
      </div>
    </div>
  </div>
);

const LoadingScreen = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="relative w-16 h-16 mx-auto mb-4">
        <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <div className="space-y-2 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
        <div className="h-3 bg-gray-200 rounded w-24 mx-auto"></div>
      </div>
    </div>
  </div>
);

const DashboardLoadingScreen = () => <SkeletonDashboard />;

const ContentLoadingScreen = () => <SkeletonContent />;

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
    
    // Use skeletal loading for dashboard routes, simple loading for others
    if (loading && !forceRender) {
      if (location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin')) {
        return <DashboardLoadingScreen />;
      }
      return <LoadingScreen />;
    }

    if (forceRender && loading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <Clock className="w-16 h-16 text-gray-300" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-gray-900">Authentication Timeout</h2>
            <p className="text-gray-600 mb-6">The authentication process is taking longer than expected.</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => window.location.reload()} variant="outline">
                Refresh Page
              </Button>
              <Button onClick={() => window.location.href = '/auth'}>
                Go to Login
              </Button>
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
        <Suspense fallback={
          location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin') 
            ? <DashboardLoadingScreen /> 
            : <ContentLoadingScreen />
        }>
          {children}
        </Suspense>
      </ThemeProvider>
    );
  };

  const BranchAwareRoute = ({ children }: { children: React.ReactNode }) => {
    const { loading: authLoading } = useAuth();
    const { activeBranch, loading: branchLoading } = useBranches();
    
    // Use the hook to ensure branch exists and is set
    useEnsureBranch();

    // Wait for both auth and branch to be ready with skeletal loading
    if (authLoading || branchLoading) return <DashboardLoadingScreen />;
    
    return <>{children}</>;
  };

  const AuthRoute = () => {
    const { user, userProfile, loading } = useAuth();
    const location = useLocation();
    const from = (location.state as any)?.from?.pathname || "/dashboard";
    const force = new URLSearchParams(location.search).get('force') === 'true';

    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 animate-pulse">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      );
    }
    
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
        <Route path="/what-is-bill-of-materials" element={<Navigate to="/bill-of-materials-software-free" replace />} />
        <Route path="/bill-of-materials" element={<Navigate to="/bill-of-materials-software-free" replace />} />

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
          <Route path="categoriesManagement" element={<CategoriesPage />} />
          <Route path="warehouses" element={<><SEO title="Warehouse Management" /><WarehousePage /></>} />
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
            <Route path="users" element={<UserManagement />} />
            <Route path="help-center" element={<HelpCenterPage />} />
            <Route path="license" element={<LicenseOverview />} />
            <Route path="invoicing" element={<InvoicingOverview />} />
          </Route>
          <Route path="sales-orders" element={<SalesOrdersPage />} />
          <Route path="customer-management" element={<VendorManagementPage />} />
          <Route path="customer-management/new" element={<CreateSupplierPage />} />
          <Route path="customer-management/:id/edit" element={<EditSupplierPage />} />
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