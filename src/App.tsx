import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { StripeProvider } from "@/components/providers/StripeProvider";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { StockManagementApp } from "./components/StockManagementApp";
import { HomePage } from "./components/HomePage";
import { HomePageNL } from "./components/HomePageNL";
import { AuthPage } from "./components/AuthPage";
import NotFound from "./pages/NotFound";
import DemoPage from './pages/demo';
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
import { useAuth, AuthProvider } from "./hooks/useAuth";
import { useBranches, BranchProvider } from "./hooks/useBranches";
import { CurrencyProvider } from "./hooks/useCurrency";
import { FirstBranchSetup } from "./components/FirstBranchSetup";
import { OnboardingModal } from "./components/OnboardingModal";
import { Suspense, useState, useEffect } from "react";
import { useOptimizedTabSwitching } from "./hooks/useOptimizedTabSwitching";
import { ContentWrapper } from "./ContentWrapper";
import AdminUserDetailPage from './pages/AdminUserDetailPage';
import AdminNotificationsPage from './pages/AdminNotificationsPage';
import SEO from './components/SEO';
import PreloadResources from './components/PreloadResources';
import { Admin } from './components/Admin';
import { AdminChatList } from './components/AdminChatList';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { AIPredictions } from './components/analytics/AIPredictions';
import { CustomReports } from './components/analytics/CustomReports';
import { ExportData } from './components/analytics/ExportData';
import { APIAccess } from './components/analytics/APIAccess';
import { AdvancedFiltering } from './components/analytics/AdvancedFiltering';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ErrorTestComponent } from './components/ErrorTestComponent';
import FeaturesPage from './components/FeaturesPage';

// Import all SEO pages
import VoorraadbeheerTips from './pages/SEO/voorraadbeheer-tips';
import VoorraadbeheerSoftwareVergelijken from './pages/SEO/voorraadbeheer-software-vergelijken';
import VoorraadbeheerWebshop from './pages/SEO/voorraadbeheer-webshop';
import VoorraadbeheerBakkerij from './pages/SEO/voorraadbeheer-bakkerij';
import BlogListPage from './pages/blog';
import BlogPostPage from './pages/blog/[slug]';
import VoorraadbeheerFoutenVoorkomen from './pages/SEO/voorraadbeheer-fouten-voorkomen';
import VoorraadbeheerAutomatiseren from './pages/SEO/voorraadbeheer-automatiseren';
import VoorraadbeheerHoreca from './pages/SEO/voorraadbeheer-horeca';
import VoorraadbeheerExcelVsSoftware from './pages/SEO/voorraadbeheer-excel-vs-software';
import VoorraadbeheerVoorStarters from './pages/SEO/voorraadbeheer-voor-starters';
import MobielVoorraadbeheer from './pages/SEO/mobiel-voorraadbeheer';
import GratisStockbeheer from './pages/SEO/gratis-stockbeheer';
import Voorraadbeheer from './pages/SEO/voorraadbeheer';
import ScanPage from './pages/scan';
import SubscriptionTestPage from './pages/subscription-test';
import React from 'react';
import VoorraadbeheerSoftware from "./pages/SEO/voorraadbeheer-software";
import VoorraadbeheerKMO from "./pages/SEO/voorraadbeheer-kmo";
import Magazijnbeheer from "./pages/SEO/magazijnbeheer";
import Stockbeheer from "./pages/SEO/stockbeheer";
import SimpelStockbeheer from "./pages/SEO/simpelstockbeheer";
import GratisVoorraadbeheer from "./pages/SEO/gratis-voorraadbeheer";
import VoorraadbeheerVoorHoreca from "./pages/SEO/voorraadbeheer-voor-horeca";
import StockbeheerSoftware from "./pages/SEO/stockbeheer-software";
import VoorraadbeheerExcel from "./pages/SEO/voorraadbeheer-excel";
import GratisVoorraadbeheerApp from "./pages/SEO/gratis-voorraadbeheer-app";
import GratisVoorraadbeheerSoftware from "./pages/SEO/gratis-voorraadbeheer-software";
import ProgrammaStockbeheerGratis from "./pages/SEO/programma-stockbeheer-gratis";
import StockbeheerApp from "./pages/SEO/stockbeheer-app";
import MagazijnbeheerSoftwareGratis from "./pages/SEO/magazijnbeheer-software-gratis";
import VoorraadSoftwareGratis from "./pages/SEO/voorraad-software-gratis";
import BoekhoudprogrammaMetVoorraadbeheer from "./pages/SEO/boekhoudprogramma-met-voorraadbeheer";
import OnlineInventoryManagement from "./pages/SEO/online-inventory-management";
import OnlineInventorySoftware from "./pages/SEO/online-inventory-software";
import BestOnlineInventorySoftware from "./pages/SEO/best-online-inventory-software";
import BestOnlineInventorySystem from "./pages/SEO/best-online-inventory-system";
import AppVoorraadbeheerThuis from "./pages/SEO/app-voorraadbeheer-thuis";
import VoorraadbeheerApp from "./pages/SEO/voorraadbeheer-app";
import VoorraadbeheerExcelTemplateGratis from "./pages/SEO/voorraadbeheer-excel-template-gratis";
import VoorraadbeheerExcelZelfMaken from "./pages/SEO/voorraadbeheer-excel-zelf-maken";
import WarehouseManagementSystem from "./pages/SEO/warehouse-management-system";
import AboutPage from "./pages/SEO/about";
import PrivacyPolicyPage from "./pages/SEO/privacy-policy";
import TermsConditionsPage from "./pages/SEO/terms-conditions";
import SEOContactPage from "./pages/SEO/contact";
import InventoryManagementSoftware from "./pages/SEO/inventory-management-software";
import InventoryManagement from "./pages/SEO/inventory-management";
import InventorySoftware from "./pages/SEO/inventory-software";
import WarehouseSoftware from "./pages/SEO/warehouse-software";
import InventoryTracker from "./pages/SEO/inventory-tracker";
import BestInventoryManagementSoftware from "./pages/SEO/best-inventory-management-software";
import InventorySoftwareForSmallBusiness from "./pages/SEO/inventory-software-for-small-business";
import InventorySoftwareManagement from "./pages/SEO/inventory-software-management";
import SoftwareForInventoryManagement from "./pages/SEO/software-for-inventory-management";
import SoftwaresForInventoryManagement from "./pages/SEO/softwares-for-inventory-management";
import WatIsVoorraadbeheerSoftware from "./pages/SEO/wat-is-voorraadbeheer-software";
import ExcelVsVoorraadbeheerSoftware from "./pages/SEO/excel-vs-voorraadbeheer-software";
import ChecklistVoorraadbeheerSoftwareGereed from "./pages/SEO/checklist-voorraadbeheer-software-gereed";
import VoorraadbeheerAutomatiseren5Stappen from "./pages/SEO/voorraadbeheer-automatiseren-5-stappen";

// Import comparison pages - Phase 1
import StockFlowVsSortly from "./pages/SEO/stockflow-vs-sortly";
import StockFlowVsSortlyNL from "./pages/SEO/stockflow-vs-sortly-nl";
import StockFlowVsExactOnline from "./pages/SEO/stockflow-vs-exact-online";
import StockFlowVsExactOnlineNL from "./pages/SEO/stockflow-vs-exact-online-nl";
import BestVoorraadbeheerSoftwareKMO from "./pages/SEO/best-voorraadbeheer-software-kmo";

// Import comparison pages - Phase 2 International
import StockFlowVsFishbowl from "./pages/SEO/stockflow-vs-fishbowl";
import StockFlowVsZohoInventory from "./pages/SEO/stockflow-vs-zoho-inventory";
import StockFlowVsInFlow from "./pages/SEO/stockflow-vs-inflow";
import StockFlowVsCin7 from "./pages/SEO/stockflow-vs-cin7";
import StockFlowVsTradeGecko from "./pages/SEO/stockflow-vs-tradegecko";
import StockFlowVsKatana from "./pages/SEO/stockflow-vs-katana";
import StockFlowVsDearSystems from "./pages/SEO/stockflow-vs-dear-systems";
import StockFlowVsUnleashed from "./pages/SEO/stockflow-vs-unleashed";
import StockFlowVsSKULabs from "./pages/SEO/stockflow-vs-skulabs";
import StockFlowVsOrdoro from "./pages/SEO/stockflow-vs-ordoro";
import StockFlowVsInventoryPlanner from "./pages/SEO/stockflow-vs-inventory-planner";
import StockFlowVsSkuVault from "./pages/SEO/stockflow-vs-skuvault";
import StockFlowVsBrightpearl from "./pages/SEO/stockflow-vs-brightpearl";
import StockFlowVsLinnworks from "./pages/SEO/stockflow-vs-linnworks";

// Import comparison pages - Phase 3 Regional
import StockFlowVsTeamleader from "./pages/SEO/stockflow-vs-teamleader";

import CategorysPage from './pages/categories';
import SuppliersPage from './pages/suppliers';
import AdminPage from './pages/admin';
import { PaymentTestPage } from './pages/PaymentTest';
import { DeliveryNotesManagement } from './components/delivery-notes/DeliveryNotesManagement';
import { IncomingDeliveryNotes } from './components/delivery-notes/IncomingDeliveryNotes';
import { OutgoingDeliveryNotes } from './components/delivery-notes/OutgoingDeliveryNotes';
import PricingPage from './pages/pricing';
import CheckoutPage from './pages/checkout';
import DeadStockCalculatorPage from './pages/dead-stock-calculator';
import { SubscriptionManagement } from './components/settings/SubscriptionManagement';
import { AdminSubscriptionManagement } from './components/admin/SubscriptionManagement';

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

  
  // Protected Route Component (without branch logic)
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading, userProfile } = useAuth();
    const location = useLocation();
    const [showOnboarding, setShowOnboarding] = useState(false);

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

    // Check if user needs onboarding
    if (userProfile && !(userProfile as any).onboarding_completed) {
      console.debug('[ProtectedRoute] User needs onboarding');
      return (
        <>
          <OnboardingModal 
            isOpen={true} 
            onClose={() => setShowOnboarding(false)} 
          />
          {children}
        </>
      );
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
    const { branches, hasNoBranches, loading: branchesLoading } = useBranches();
    const [forceRender, setForceRender] = useState(false);

    // Safety timeout - force render after 5 seconds
    useEffect(() => {
      if (branchesLoading) {
        console.warn('[BranchAwareRoute] Branch loading detected, starting safety timer');
        const timeout = setTimeout(() => {
          console.error('[BranchAwareRoute] Safety timeout reached - forcing render despite loading state');
          setForceRender(true);
        }, 5000);
        
        return () => clearTimeout(timeout);
      }
    }, [branchesLoading]);

    if (branchesLoading && !forceRender) {
      console.debug('[BranchAwareRoute] Loading branches... (loading:', branchesLoading, 'branches:', branches?.length, ')');
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading branches...</p>
            <p className="text-xs text-gray-400 mt-2">If this takes too long, please refresh the page</p>
          </div>
        </div>
      );
    }

    // Check if user has no branches and needs to create their first branch
    if (hasNoBranches && branches.length === 0) {
      console.debug('[BranchAwareRoute] No branches found, showing FirstBranchSetup');
      return <FirstBranchSetup />;
    }

    console.debug('[BranchAwareRoute] Rendering children (branches:', branches?.length, ')');
    return <>{children}</>;
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

  return (
    <ContentWrapper>
      <Routes>
        {/* Openbare routes */}
        <Route path="/" element={<HomePage />} />
        
        {/* Dutch Homepage */}
        <Route path="/nl" element={<HomePageNL />} />
        
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/error-test" element={<ErrorTestComponent />} />
        <Route path="/auth" element={<AuthRoute />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/dead-stock-calculator" element={<DeadStockCalculatorPage />} />
        <Route path="/contact" element={<SEOContactPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        {/* Dutch SEO Pages - Both original paths and /nl/ paths */}
        <Route path="/voorraadbeheer-tips" element={<VoorraadbeheerTips />} />
        <Route path="/nl/voorraadbeheer-tips" element={<VoorraadbeheerTips />} />
        
        <Route path="/voorraadbeheer-software-vergelijken" element={<VoorraadbeheerSoftwareVergelijken />} />
        <Route path="/nl/voorraadbeheer-software-vergelijken" element={<VoorraadbeheerSoftwareVergelijken />} />
        
        <Route path="/voorraadbeheer-webshop" element={<VoorraadbeheerWebshop />} />
        <Route path="/nl/voorraadbeheer-webshop" element={<VoorraadbeheerWebshop />} />
        
        <Route path="/voorraadbeheer-bakkerij" element={<VoorraadbeheerBakkerij />} />
        <Route path="/nl/voorraadbeheer-bakkerij" element={<VoorraadbeheerBakkerij />} />
        
        <Route path="/voorraadbeheer-fouten-voorkomen" element={<VoorraadbeheerFoutenVoorkomen />} />
        <Route path="/nl/voorraadbeheer-fouten-voorkomen" element={<VoorraadbeheerFoutenVoorkomen />} />
        
        <Route path="/voorraadbeheer-automatiseren" element={<VoorraadbeheerAutomatiseren />} />
        <Route path="/nl/voorraadbeheer-automatiseren" element={<VoorraadbeheerAutomatiseren />} />
        
        <Route path="/voorraadbeheer-horeca" element={<VoorraadbeheerHoreca />} />
        <Route path="/nl/voorraadbeheer-horeca" element={<VoorraadbeheerHoreca />} />
        
        <Route path="/voorraadbeheer-excel-vs-software" element={<VoorraadbeheerExcelVsSoftware />} />
        <Route path="/nl/voorraadbeheer-excel-vs-software" element={<VoorraadbeheerExcelVsSoftware />} />
        
        <Route path="/voorraadbeheer-voor-starters" element={<VoorraadbeheerVoorStarters />} />
        <Route path="/nl/voorraadbeheer-voor-starters" element={<VoorraadbeheerVoorStarters />} />
        
        <Route path="/mobiel-voorraadbeheer" element={<MobielVoorraadbeheer />} />
        <Route path="/nl/mobiel-voorraadbeheer" element={<MobielVoorraadbeheer />} />
        
        <Route path="/voorraadbeheer-software" element={<VoorraadbeheerSoftware />} />
        <Route path="/nl/voorraadbeheer-software" element={<VoorraadbeheerSoftware />} />
        
        <Route path="/voorraadbeheer-kmo" element={<VoorraadbeheerKMO />} />
        <Route path="/nl/voorraadbeheer-kmo" element={<VoorraadbeheerKMO />} />
        
        <Route path="/magazijnbeheer" element={<Magazijnbeheer />} />
        <Route path="/nl/magazijnbeheer" element={<Magazijnbeheer />} />
        
        <Route path="/stockbeheer-software" element={<StockbeheerSoftware />} />
        <Route path="/nl/stockbeheer-software" element={<StockbeheerSoftware />} />
        
        <Route path="/voorraadbeheer-excel" element={<VoorraadbeheerExcel />} />
        <Route path="/nl/voorraadbeheer-excel" element={<VoorraadbeheerExcel />} />
        
        <Route path="/voorraadbeheer" element={<Voorraadbeheer />} />
        <Route path="/nl/voorraadbeheer" element={<Voorraadbeheer />} />
        
        <Route path="/wat-is-voorraadbeheer-software" element={<WatIsVoorraadbeheerSoftware />} />
        <Route path="/nl/wat-is-voorraadbeheer-software" element={<WatIsVoorraadbeheerSoftware />} />
        
        <Route path="/excel-vs-voorraadbeheer-software" element={<ExcelVsVoorraadbeheerSoftware />} />
        <Route path="/nl/excel-vs-voorraadbeheer-software" element={<ExcelVsVoorraadbeheerSoftware />} />
        
        <Route path="/checklist-voorraadbeheer-software-gereed" element={<ChecklistVoorraadbeheerSoftwareGereed />} />
        <Route path="/nl/checklist-voorraadbeheer-software-gereed" element={<ChecklistVoorraadbeheerSoftwareGereed />} />
        
        <Route path="/voorraadbeheer-automatiseren-5-stappen" element={<VoorraadbeheerAutomatiseren5Stappen />} />
        <Route path="/nl/voorraadbeheer-automatiseren-5-stappen" element={<VoorraadbeheerAutomatiseren5Stappen />} />
        
        <Route path="/stockbeheer" element={<Stockbeheer />} />
        <Route path="/nl/stockbeheer" element={<Stockbeheer />} />
        
        <Route path="/simpelstockbeheer" element={<SimpelStockbeheer />} />
        <Route path="/nl/simpelstockbeheer" element={<SimpelStockbeheer />} />
        
        <Route path="/gratis-voorraadbeheer" element={<GratisVoorraadbeheer />} />
        <Route path="/nl/gratis-voorraadbeheer" element={<GratisVoorraadbeheer />} />
        
        <Route path="/voorraadbeheer-voor-horeca" element={<VoorraadbeheerVoorHoreca />} />
        <Route path="/nl/voorraadbeheer-voor-horeca" element={<VoorraadbeheerVoorHoreca />} />
        
        {/* Blog routes */}
        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        
        {/* More Dutch SEO Pages */}
        <Route path="/gratis-stockbeheer" element={<GratisStockbeheer />} />
        <Route path="/nl/gratis-stockbeheer" element={<GratisStockbeheer />} />
        
        <Route path="/gratis-voorraadbeheer-app" element={<GratisVoorraadbeheerApp />} />
        <Route path="/nl/gratis-voorraadbeheer-app" element={<GratisVoorraadbeheerApp />} />
        
        <Route path="/gratis-voorraadbeheer-software" element={<GratisVoorraadbeheerSoftware />} />
        <Route path="/nl/gratis-voorraadbeheer-software" element={<GratisVoorraadbeheerSoftware />} />
        
        <Route path="/programma-stockbeheer-gratis" element={<ProgrammaStockbeheerGratis />} />
        <Route path="/nl/programma-stockbeheer-gratis" element={<ProgrammaStockbeheerGratis />} />
        
        <Route path="/stockbeheer-app" element={<StockbeheerApp />} />
        <Route path="/nl/stockbeheer-app" element={<StockbeheerApp />} />
        
        <Route path="/magazijnbeheer-software-gratis" element={<MagazijnbeheerSoftwareGratis />} />
        <Route path="/nl/magazijnbeheer-software-gratis" element={<MagazijnbeheerSoftwareGratis />} />
        
        <Route path="/voorraad-software-gratis" element={<VoorraadSoftwareGratis />} />
        <Route path="/nl/voorraad-software-gratis" element={<VoorraadSoftwareGratis />} />
        
        <Route path="/boekhoudprogramma-met-voorraadbeheer" element={<BoekhoudprogrammaMetVoorraadbeheer />} />
        <Route path="/nl/boekhoudprogramma-met-voorraadbeheer" element={<BoekhoudprogrammaMetVoorraadbeheer />} />
        <Route path="/online-inventory-management" element={<OnlineInventoryManagement />} />
        <Route path="/online-inventory-software" element={<OnlineInventorySoftware />} />
        <Route path="/best-online-inventory-software" element={<BestOnlineInventorySoftware />} />
        <Route path="/best-online-inventory-system" element={<BestOnlineInventorySystem />} />
        <Route path="/app-voorraadbeheer-thuis" element={<AppVoorraadbeheerThuis />} />
        <Route path="/nl/app-voorraadbeheer-thuis" element={<AppVoorraadbeheerThuis />} />
        
        <Route path="/voorraadbeheer-app" element={<VoorraadbeheerApp />} />
        <Route path="/nl/voorraadbeheer-app" element={<VoorraadbeheerApp />} />
        
        <Route path="/voorraadbeheer-excel-template-gratis" element={<VoorraadbeheerExcelTemplateGratis />} />
        <Route path="/nl/voorraadbeheer-excel-template-gratis" element={<VoorraadbeheerExcelTemplateGratis />} />
        
        <Route path="/voorraadbeheer-excel-zelf-maken" element={<VoorraadbeheerExcelZelfMaken />} />
        <Route path="/nl/voorraadbeheer-excel-zelf-maken" element={<VoorraadbeheerExcelZelfMaken />} />
        <Route path="/warehouse-management-system" element={<WarehouseManagementSystem />} />
        <Route path="/inventory-management-software" element={<InventoryManagementSoftware />} />
        <Route path="/inventory-management" element={<InventoryManagement />} />
        <Route path="/inventory-software" element={<InventorySoftware />} />
        <Route path="/warehouse-software" element={<WarehouseSoftware />} />
        <Route path="/inventory-tracker" element={<InventoryTracker />} />
        <Route path="/best-inventory-management-software" element={<BestInventoryManagementSoftware />} />
        <Route path="/inventory-software-for-small-business" element={<InventorySoftwareForSmallBusiness />} />
        <Route path="/inventory-software-management" element={<InventorySoftwareManagement />} />
        <Route path="/software-for-inventory-management" element={<SoftwareForInventoryManagement />} />
        <Route path="/softwares-for-inventory-management" element={<SoftwaresForInventoryManagement />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-conditions" element={<TermsConditionsPage />} />

        {/* Comparison Pages - Phase 1 */}
        <Route path="/stockflow-vs-sortly" element={<StockFlowVsSortly />} />
        <Route path="/nl/stockflow-vs-sortly" element={<StockFlowVsSortlyNL />} />
        <Route path="/stockflow-vs-exact-online" element={<StockFlowVsExactOnline />} />
        <Route path="/nl/stockflow-vs-exact-online" element={<StockFlowVsExactOnlineNL />} />
        <Route path="/best-voorraadbeheer-software-kmo" element={<BestVoorraadbeheerSoftwareKMO />} />
        <Route path="/nl/best-voorraadbeheer-software-kmo" element={<BestVoorraadbeheerSoftwareKMO />} />

        {/* Comparison Pages - Phase 2 International */}
        <Route path="/stockflow-vs-fishbowl" element={<StockFlowVsFishbowl />} />
        <Route path="/stockflow-vs-zoho-inventory" element={<StockFlowVsZohoInventory />} />
        <Route path="/stockflow-vs-inflow" element={<StockFlowVsInFlow />} />
        <Route path="/stockflow-vs-cin7" element={<StockFlowVsCin7 />} />
        <Route path="/stockflow-vs-tradegecko" element={<StockFlowVsTradeGecko />} />
        <Route path="/stockflow-vs-katana" element={<StockFlowVsKatana />} />
        <Route path="/stockflow-vs-dear-systems" element={<StockFlowVsDearSystems />} />
        <Route path="/stockflow-vs-unleashed" element={<StockFlowVsUnleashed />} />
        <Route path="/stockflow-vs-skulabs" element={<StockFlowVsSKULabs />} />
        <Route path="/stockflow-vs-ordoro" element={<StockFlowVsOrdoro />} />
        <Route path="/stockflow-vs-inventory-planner" element={<StockFlowVsInventoryPlanner />} />
        <Route path="/stockflow-vs-skuvault" element={<StockFlowVsSkuVault />} />
        <Route path="/stockflow-vs-brightpearl" element={<StockFlowVsBrightpearl />} />
        <Route path="/stockflow-vs-linnworks" element={<StockFlowVsLinnworks />} />

        {/* Comparison Pages - Phase 3 Regional */}
        <Route path="/stockflow-vs-teamleader" element={<StockFlowVsTeamleader />} />
        <Route path="/nl/stockflow-vs-teamleader" element={<StockFlowVsTeamleader />} />

        {/* Beschermde dashboard routes */}
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
          <Route path="scan" element={<ScanPage />} />
          <Route path="subscription-test" element={<SubscriptionTestPage />} />
          <Route path="stock" element={<StockList />} />
          <Route path="categories" element={<CategorysPage />} />
          <Route path="suppliers" element={<SuppliersPage />} />
          <Route path="transactions" element={<StockMovements />} />
          <Route path="delivery-notes" element={<DeliveryNotesManagement />}>
            <Route index element={<IncomingDeliveryNotes />} />
            <Route path="incoming" element={<IncomingDeliveryNotes />} />
            <Route path="outgoing" element={<OutgoingDeliveryNotes />} />
          </Route>
          <Route path="analytics" element={<AnalyticsDashboard />} />
          <Route path="analytics/predictions" element={<AIPredictions />} />
          <Route path="analytics/reports" element={<CustomReports />} />
          <Route path="analytics/export" element={<ExportData />} />
          <Route path="analytics/api" element={<APIAccess />} />
          <Route path="analytics/filtering" element={<AdvancedFiltering />} />
          <Route path="settings" element={<Settings />}>
            <Route index element={<ProfileSettings />} />
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="branches" element={<BranchManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="subscription" element={<SubscriptionManagement />} />
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
            <Route path="seo" element={<SEO />} />
            <Route path="payment-test" element={<PaymentTestPage />} />
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
  };
  
  return (
    <ErrorBoundary>
      <SEO structuredData={localBusinessSchema} />
      <PreloadResources 
        criticalImages={[
          '/logo.png',
          '/Inventory-Management.png'
        ]}
        criticalFonts={[
          'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
        ]}
      />
      {/* QueryClientProvider wordt nu beheerd in main.tsx */}
      <AuthProvider>
        <CurrencyProvider>
          <StripeProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppRouter />
              </BrowserRouter>
            </TooltipProvider>
          </StripeProvider>
        </CurrencyProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
