import React, { Suspense, useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from "react-router-dom";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StockManagementApp } from "./components/StockManagementApp";
import { HomePage } from "./components/HomePage";
import { AuthPage } from "./components/AuthPage";
import ServerError from "./pages/ServerError";
import { Dashboard } from './components/Dashboard';
import { StockMovements } from './components/StockMovements';
import { Settings } from './components/Settings';
import { ProfileSettings } from './components/settings/ProfileSettings';
import { UserManagement } from './components/settings/UserManagement';
import { LicenseOverview } from './components/settings/LicenseOverview';
import { InvoicingOverview } from './components/settings/InvoicingOverview';
import { BillingPage } from './components/settings/BillingPage';
import { BillingSuccessRedirect } from './components/BillingSuccessRedirect';
import { BranchesSettings } from './components/settings/BranchesSettings';
import { GeneralSettings } from './components/settings/GeneralSettings';
import { PaywallGate } from './components/PaywallGate';
import { useAuth } from "./hooks/useAuth";
import { useBranches, BranchProvider } from "./hooks/useBranches";
import { CurrencyProvider } from "./hooks/useCurrency";
import { useNavigationQueryReset } from "./hooks/useNavigationQueryReset";
import { usePageViewLogger } from "./hooks/usePageViewLogger";
import { useEnsureBranch } from "./hooks/useEnsureBranch";
import { ContentWrapper } from "./ContentWrapper";
import SEO from './components/SEO';

/** Meta for authenticated / utility routes — robots.txt also disallows these paths */
const privateSeo = { noindex: true, nofollow: true };
import PreloadResources from './components/PreloadResources';
import { Admin } from './components/Admin';
import { ErrorBoundary } from './components/ErrorBoundary';
import CookieConsent from './components/CookieConsent';
import { FirstTimeFeedbackWidget } from './components/FirstTimeFeedbackWidget';
import { useCookieConsent } from './hooks/useCookieConsent';
import { getSeoRoutes, getSeoLegacyRedirects, SolutionsPrefixRedirect } from './routes/seoRoutes';
import { ThemeProvider } from './hooks/useTheme';
import HeaderPublic from './components/HeaderPublic';
import Footer from './components/Footer';

const ReportingPage = React.lazy(() => import('./pages/reporting'));
const AdminUserDetailPage = React.lazy(() => import('./pages/AdminUserDetailPage'));
const AdminNotificationsPage = React.lazy(() => import('./pages/AdminNotificationsPage'));
const AdminSmtpPage = React.lazy(() => import('./pages/AdminSmtpPage'));
const FeaturesPage = React.lazy(() => import('./components/FeaturesPage'));
const ResourcesPage = React.lazy(() => import('./pages/resources'));
const CustomersPage = React.lazy(() => import('./pages/customers'));
const CustomerDetailPage = React.lazy(() => import('./pages/customers/[id]'));
const WarehousePage = React.lazy(() => import("./pages/WarehousePage"));
const ContactPage = React.lazy(() => import("./pages/contact"));
const VideosPage = React.lazy(() => import("./pages/videos"));
const IntegrationsPage = React.lazy(() => import("./pages/integrations"));
const WorkflowsPage = React.lazy(() => import("./pages/workflows"));
const StockCountsPage = React.lazy(() => import("./pages/stock-counts"));
const CreateStockCountPage = React.lazy(() => import("./pages/CreateStockCountPage"));
const EditStockCountPage = React.lazy(() => import("./pages/EditStockCountPage"));
const PickListsPage = React.lazy(() => import("./pages/pick-lists"));
const CreatePickListPage = React.lazy(() => import("./pages/CreatePickListPage"));
const EditPickListPage = React.lazy(() => import("./pages/EditPickListPage"));
const SalesOrdersPage = React.lazy(() => import("./pages/sales-orders"));
const PurchaseOrdersPage = React.lazy(() => import("./pages/purchase-orders"));
const VendorManagementPage = React.lazy(() => import("./pages/customer-management"));
const CreateCustomerPage = React.lazy(() => import("./pages/CreateCustomerPage"));
const EditCustomerPage = React.lazy(() => import("./pages/EditCustomerPage"));
const SuppliersPage = React.lazy(() => import("./pages/suppliers"));
const CreateSupplierPage = React.lazy(() => import("./pages/CreateSupplierPage"));
const EditSupplierPage = React.lazy(() => import("./pages/EditSupplierPage"));
const AdminPage = React.lazy(() => import('./pages/admin'));
const BillOfMaterialsPage = React.lazy(() => import('./components/products/BillOfMaterials'));
const BOMEditPage = React.lazy(() => import('./components/products/BillOfMaterials'));
const CustomReports = React.lazy(() => import('./components/analytics/CustomReports').then(m => ({ default: m.CustomReports })));
const ExportData = React.lazy(() => import('./components/analytics/ExportData').then(m => ({ default: m.ExportData })));
const AdvancedReports = React.lazy(() => import('./components/analytics/AdvancedReports').then(m => ({ default: m.AdvancedReports })));
const HelpCenterPage = React.lazy(() => import("./pages/help-center"));
const MobileAppPage = React.lazy(() => import("./pages/MobileAppPage"));
const ReferAFriendPage = React.lazy(() => import("./pages/ReferAFriendPage"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const PricingPage = React.lazy(() => import('./pages/pricing'));
const FAQPage = React.lazy(() => import('./pages/faq'));

const CategorysPage = React.lazy(() => import('./pages/products'));
const CategoriesPage = React.lazy(() => import('./pages/CategoriesPage'));
const ProductDetailPage = React.lazy(() => import('./pages/ProductDetailPage'));
const AddProductPage = React.lazy(() => import('./pages/AddProductPage'));
const AddCategoryPage = React.lazy(() => import('./pages/AddCategoryPage'));
const CreateBOMPage = React.lazy(() => import('./pages/CreateBOMPage'));
const BulkImportPage = React.lazy(() => import('./pages/BulkImportPage'));
const CreateSalesOrderPage = React.lazy(() => import('./pages/CreateSalesOrderPage'));
const CreatePurchaseOrderPage = React.lazy(() => import('./pages/CreatePurchaseOrderPage'));
const EditPurchaseOrderPage = React.lazy(() => import('./pages/EditPurchaseOrderPage'));
const EditSalesOrderPage = React.lazy(() => import('./pages/EditSalesOrderPage'));
const BarcodeScannerPage = React.lazy(() => import('./pages/BarcodeScannerPage'));
const ScanPage = React.lazy(() => import('./pages/scan'));
const LocationsPage = React.lazy(() => import('./pages/LocationsPage'));

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

const FEATURES_STRUCTURED_DATA = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "StockFlow",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web, iOS, Android",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "featureList": [
      "Real-time inventory tracking",
      "Barcode and QR code scanning",
      "Bill of Materials management",
      "Multi-location warehouse support",
      "Low stock and reorder alerts",
      "Sales order management",
      "Purchase order management",
      "Reporting and analytics dashboard",
      "Offline mode support",
      "Role-based access control"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.stockflowsystems.com" },
      { "@type": "ListItem", "position": 2, "name": "Features", "item": "https://www.stockflowsystems.com/features" }
    ]
  }
];

const AppRouter = () => {
  useNavigationQueryReset();
  usePageViewLogger();

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading, userProfile } = useAuth();
    const location = useLocation();
    const [forceRender, setForceRender] = useState(false);
    const [profileModalDismissed, setProfileModalDismissed] = useState(
      () => sessionStorage.getItem('profileNameDismissed') === '1'
    );

    const dismissProfileModal = () => {
      sessionStorage.setItem('profileNameDismissed', '1');
      setProfileModalDismissed(true);
    };

    const needsNamePrompt =
      !loading &&
      !profileModalDismissed &&
      !!userProfile &&
      !userProfile.first_name &&
      !userProfile.last_name &&
      location.pathname !== '/auth';

    const showFeedbackWidget =
      !loading &&
      !!userProfile &&
      userProfile.feedback_prompted === false &&
      location.pathname !== '/auth';

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
      const allowed = [
        '/dashboard/settings/invoicing',
        '/dashboard/settings/facturatie',
        ...(userProfile.is_owner === true ? ['/admin'] : []),
      ].some(p => location.pathname.startsWith(p));
      if (!allowed) {
        window.location.replace('/dashboard/settings/invoicing');
        return null;
      }
    }

    return (
      <ThemeProvider>
        {needsNamePrompt && userProfile && (
          <CompleteProfileModal
            userId={userProfile.id}
            email={userProfile.email}
            onComplete={dismissProfileModal}
            onSkip={dismissProfileModal}
          />
        )}
        {showFeedbackWidget && userProfile && (
          <FirstTimeFeedbackWidget
            userId={userProfile.id}
            userEmail={userProfile.email}
            userName={userProfile.first_name ?? ''}
          />
        )}
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

  const BlogSlugRedirect = () => {
    const { slug } = useParams();
    return <Navigate to={`/${slug ?? ''}`} replace />;
  };

  return (
    <ContentWrapper>
      <Suspense fallback={<ContentLoadingScreen />}>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<><SEO title="Inventory Chaos? Track Stock in Real-Time (Completely Free) | StockFlow" description="Stop losing sales to stockouts and overselling. StockFlow tracks inventory in real-time across all channels, even when WiFi drops. Completely free. 15+ hours saved weekly." url="https://www.stockflowsystems.com/" image="https://www.stockflowsystems.com/Inventory-Management.png" /><HomePage /></>} />
        <Route path="/features" element={<><SEO title="Inventory Management Features & Capabilities | StockFlow" description="Explore StockFlow features: barcode scanning, BOM management, stock alerts, reporting, and offline support. Free inventory software for growing businesses." url="https://www.stockflowsystems.com/features" structuredData={FEATURES_STRUCTURED_DATA} /><FeaturesPage /></>} />
        <Route path="/reporting" element={
          <React.Suspense fallback={<ContentLoadingScreen />}>
            <SEO title="Inventory Reporting & Analytics Software | StockFlow" description="Discover inventory reporting and analytics tools from StockFlow. Track stock, sales and performance in real time with free software built for small business." url="https://www.stockflowsystems.com/reporting" />
            <ReportingPage />
          </React.Suspense>
        } />
        <Route path="/resources" element={<><SEO title="Inventory Management Resources & Guides | StockFlow" description="Find free inventory software guides, operating tips, and best practices for inventory control, barcode scanning, and stock management." url="https://www.stockflowsystems.com/resources" /><ResourcesPage /></>} />
        <Route path="/customers" element={<><SEO title="StockFlow Customers & Success Stories | Inventory Software" description="Read customer success stories from businesses using StockFlow for inventory management, barcode scanning, and BOM tracking." url="https://www.stockflowsystems.com/customers" /><CustomersPage /></>} />
        <Route path="/customers/:id" element={<><SEO title="Customer Success Story | StockFlow" description="Learn how a StockFlow customer solved inventory issues with barcode scanning and real-time stock visibility." /><CustomerDetailPage /></>} />
        <Route path="/auth" element={<><SEO title="Login to StockFlow" description="Access StockFlow to manage inventory, scan barcodes, and run your stock operations from anywhere." {...privateSeo} /><AuthRoute /></>} />
        <Route path="/billing-success" element={<><SEO title="Billing" {...privateSeo} /><BillingSuccessRedirect /></>} />
        <Route path="/contact" element={<><SEO title="Contact StockFlow | Free Inventory Software Support" description="Contact StockFlow to get help with inventory software, barcode scanning setup, or getting started with the free plan." url="https://www.stockflowsystems.com/contact" /><ContactPage /></>} />
        <Route
          path="/help-center"
          element={
            <>
              <SEO
                title="StockFlow Help Center | Support & FAQs"
                description="Get help with StockFlow inventory software. Browse FAQs, troubleshooting guides, billing support, integrations, and contact our support team."
                url="https://www.stockflowsystems.com/help-center"
              />
              <HeaderPublic />
              <main className="container mx-auto px-4 py-8">
                <Suspense fallback={<SkeletonCard />}>
                  <HelpCenterPage />
                </Suspense>
              </main>
              <Footer />
            </>
          }
        />
        <Route path='/videos' element={<><SEO title="StockFlow Instruction Videos | Inventory & Barcode Training" description="Watch StockFlow tutorial videos for inventory management, barcode scanning, reporting, and using the free app effectively." url="https://www.stockflowsystems.com/videos" /><VideosPage /></>} />
        <Route path='/integrations' element={<><SEO title="Inventory Software Integrations | StockFlow" description="Discover which tools integrate with StockFlow for inventory, ecommerce, accounting, and barcode workflows." url="https://www.stockflowsystems.com/integrations"/><IntegrationsPage /></>} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/faq" element={<FAQPage />} />

        {/* REDIRECTS */}
        <Route path="/what-is-bill-of-materials" element={<Navigate to="/bill-of-materials-software-free" replace />} />
        <Route path="/bill-of-materials" element={<Navigate to="/bill-of-materials-software-free" replace />} />
        <Route path="/blog/:slug" element={<BlogSlugRedirect />} />
        <Route path="/what-is-the-best-free-inventory-management-software" element={<Navigate to="/best-free-inventory-software-with-barcode-scanning" replace />} />
        <Route path="/blog/what-is-the-best-free-inventory-management-software" element={<Navigate to="/best-free-inventory-software-with-barcode-scanning" replace />} />
        <Route path="/best-online-inventory-software" element={<Navigate to="/best-free-inventory-software-with-barcode-scanning" replace />} />
        <Route path="/blog/best-online-inventory-software" element={<Navigate to="/best-free-inventory-software-with-barcode-scanning" replace />} />
        <Route path="/inventory-management-bing" element={<Navigate to="/inventory-management" replace />} />
        <Route path="/prix" element={<Navigate to="/pricing" replace />} />
        <Route path="/prix-abonnement" element={<Navigate to="/pricing" replace />} />
        <Route path="/non-profit-inventory-management" element={<Navigate to="/non-profit-inventory-management-software" replace />} />
        {getSeoLegacyRedirects().map((redirect) => (
          <Route
            key={redirect.from}
            path={redirect.from}
            element={<Navigate to={redirect.to} replace />}
          />
        ))}
        <Route path="/solutions/*" element={<SolutionsPrefixRedirect />} />

        {/* DYNAMIC SEO ROUTES */}
        {getSeoRoutes().map(r => (
          <Route key={r.path} path={r.path} element={r.element} />
        ))}

        {/* ADMIN ROUTES - Fixed 404 by moving outside of complex branch nesting */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <SEO title="Admin" {...privateSeo} />
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
            <Route path="smtp" element={<AdminSmtpPage />} />
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
          <Route index element={<><SEO title="StockFlow Dashboard" {...privateSeo} /><Dashboard userRole="staff" /></>} />
          <Route path="categories" element={<><SEO title="Product Inventory" {...privateSeo} /><CategorysPage /></>} />
          <Route path="products/import" element={<BulkImportPage />} />
          <Route path="scan" element={<BarcodeScannerPage />} />
          <Route path="scan-flow" element={<ScanPage />} />
          <Route path="categories-management" element={<CategoriesPage />} />
          <Route path="categories-management/new" element={<AddCategoryPage />} />
          <Route path="products/new" element={<AddProductPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="categoriesManagement" element={<CategoriesPage />} />
          <Route path="warehouses" element={<><SEO title="Warehouse Management" {...privateSeo} /><WarehousePage /></>} />
          <Route path="locations" element={<><SEO title="Locations" {...privateSeo} /><LocationsPage /></>} />
          <Route path="bom/new" element={<CreateBOMPage />} />
          <Route path="bom" element={<BillOfMaterialsPage />}>
            <Route path="edit/:productId" element={<BOMEditPage />} />
          </Route>
          <Route path="transactions" element={<StockMovements />} />
          <Route path="analytics/reports" element={<CustomReports />} />
          <Route path="analytics/advanced" element={<AdvancedReports />} />
          <Route path="analytics/export" element={<ExportData />} />
          <Route path="settings" element={<Settings />}>
            <Route index element={<ProfileSettings />} />
            <Route path="general" element={<GeneralSettings />} />
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="help-center" element={<HelpCenterPage />} />
            <Route path="mobile-app" element={<MobileAppPage />} />
            <Route path="refer-a-friend" element={<ReferAFriendPage />} />
            <Route path="license" element={<LicenseOverview />} />
            <Route path="invoicing" element={<InvoicingOverview />} />
            <Route path="billing" element={<BillingPage />} />
            <Route path="branches" element={<BranchesSettings />} />
          </Route>
          <Route path="workflows" element={<WorkflowsPage />} />
          <Route path="stock-counts" element={<PaywallGate feature="orders"><StockCountsPage /></PaywallGate>} />
          <Route path="stock-counts/new" element={<PaywallGate feature="orders"><CreateStockCountPage /></PaywallGate>} />
          <Route path="stock-counts/:id/edit" element={<PaywallGate feature="orders"><EditStockCountPage /></PaywallGate>} />
          <Route path="pick-lists" element={<PaywallGate feature="orders"><PickListsPage /></PaywallGate>} />
          <Route path="pick-lists/new" element={<PaywallGate feature="orders"><CreatePickListPage /></PaywallGate>} />
          <Route path="pick-lists/:id/edit" element={<PaywallGate feature="orders"><EditPickListPage /></PaywallGate>} />
          <Route path="sales-orders" element={<PaywallGate feature="orders"><SalesOrdersPage /></PaywallGate>} />
          <Route path="sales-orders/new" element={<PaywallGate feature="orders"><CreateSalesOrderPage /></PaywallGate>} />
          <Route path="purchase-orders" element={<PaywallGate feature="orders"><PurchaseOrdersPage /></PaywallGate>} />
          <Route path="purchase-orders/new" element={<PaywallGate feature="orders"><CreatePurchaseOrderPage /></PaywallGate>} />
          <Route path="purchase-orders/:id/edit" element={<PaywallGate feature="orders"><EditPurchaseOrderPage /></PaywallGate>} />
          <Route path="sales-orders/:id/edit" element={<PaywallGate feature="orders"><EditSalesOrderPage /></PaywallGate>} />
          <Route path="customer-management" element={<PaywallGate feature="contacts"><VendorManagementPage /></PaywallGate>} />
          <Route path="customer-management/new" element={<PaywallGate feature="contacts"><CreateCustomerPage /></PaywallGate>} />
          <Route path="customer-management/:id/edit" element={<PaywallGate feature="contacts"><EditCustomerPage /></PaywallGate>} />
          <Route path="suppliers" element={<PaywallGate feature="contacts"><SuppliersPage /></PaywallGate>} />
          <Route path="suppliers/new" element={<PaywallGate feature="contacts"><CreateSupplierPage /></PaywallGate>} />
          <Route path="suppliers/:id/edit" element={<PaywallGate feature="contacts"><EditSupplierPage /></PaywallGate>} />
        </Route>

        {/* ERROR & FALLBACK */}
        <Route path="/500" element={<ServerError />} />
        <Route path="*" element={<><SEO title="Page Not Found" noindex /><NotFound /></>} />
      </Routes>
      </Suspense>
    </ContentWrapper>
  );
};

export default function App() {
  useCookieConsent();

  return (
    <ErrorBoundary>
      <PreloadResources criticalFonts={[]} />
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
    </ErrorBoundary>
  );
}