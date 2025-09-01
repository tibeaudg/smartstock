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
import { ProfileSettings } from "./components/settings/ProfileSettings";
import { BranchManagement } from "./components/settings/BranchManagement";
import { UserManagement } from "./components/settings/UserManagement";
import { ModuleManagement } from "./components/settings/ModuleManagement";
import { LicenseOverview } from "./components/settings/LicenseOverview";
import { InvoicingOverview } from "./components/settings/InvoicingOverview";
import { useAuth, AuthProvider } from "./hooks/useAuth";
import { Suspense } from "react";
import { ContentWrapper } from "./ContentWrapper";
import AdminInvoicingPage from "./components/AdminInvoicingPage";
import AdminUserDetailPage from './pages/AdminUserDetailPage';
import AdminNotificationsPage from './pages/AdminNotificationsPage';
import { AlertCircle } from "lucide-react";
import SEO from './components/SEO';
import PreloadResources from './components/PreloadResources';
import { Admin } from './components/Admin';
import AdminCMS from './components/AdminCMS';
import { AdminChatList } from './components/AdminChatList';
import VoorraadbeheerTips from './pages/SEO/voorraadbeheer-tips';
import VoorraadbeheerSoftwareVergelijken from './pages/SEO/voorraadbeheer-software-vergelijken';
import VoorraadbeheerWebshop from './pages/SEO/voorraadbeheer-webshop';
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
import React, { useState } from 'react';
import { OnboardingModal } from "./components/onboarding/OnboardingModal";
import VoorraadbeheerSoftware from "./pages/SEO/voorraadbeheer-software";
import Stockbeheer from "./pages/SEO/stockbeheer";
import SimpelStockbeheer from "./pages/SEO/simpelstockbeheer";
import GratisVoorraadbeheer from "./pages/SEO/gratis-voorraadbeheer";
import VoorraadbeheerVoorHoreca from "./pages/SEO/voorraadbeheer-voor-horeca";


// ErrorBoundary component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    // Je kunt hier logging toevoegen
    // console.error('ErrorBoundary caught:', error, errorInfo);
  }
  handleReload = () => {
    window.location.reload();
  };
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 32, textAlign: 'center', color: '#b91c1c', background: '#fef2f2', minHeight: '100vh' }}>
          <h1 style={{ fontSize: 28, marginBottom: 16 }}>Er is een fout opgetreden</h1>
          <p style={{ marginBottom: 16 }}>Sorry, er is iets misgegaan in de applicatie.<br/>Probeer de pagina te verversen. Blijft dit probleem zich voordoen, neem dan contact op met de supportdienst.</p>
          <button onClick={this.handleReload} style={{ background: '#2563eb', color: 'white', padding: '10px 24px', borderRadius: 6, fontSize: 16, border: 'none' }}>Opnieuw proberen</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Check of localStorage werkt
function isLocalStorageAvailable() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const testKey = '__test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

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

export default function App() {
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
      {/* Verwijderde dubbele wrapper */}
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ContentWrapper>
                <Routes>
                  {/* Openbare routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/auth" element={<AuthRoute />} />
                  <Route path="/voorraadbeheer-tips" element={<VoorraadbeheerTips />} />
                  <Route path="/voorraadbeheer-software-vergelijken" element={<VoorraadbeheerSoftwareVergelijken />} />
                  <Route path="/voorraadbeheer-webshop" element={<VoorraadbeheerWebshop />} />
                  <Route path="/voorraadbeheer-fouten-voorkomen" element={<VoorraadbeheerFoutenVoorkomen />} />
                  <Route path="/voorraadbeheer-automatiseren" element={<VoorraadbeheerAutomatiseren />} />
                  <Route path="/voorraadbeheer-horeca" element={<VoorraadbeheerHoreca />} />
                  <Route path="/voorraadbeheer-excel-vs-software" element={<VoorraadbeheerExcelVsSoftware />} />
                  <Route path="/voorraadbeheer-voor-starters" element={<VoorraadbeheerVoorStarters />} />
                  <Route path="/mobiel-voorraadbeheer" element={<MobielVoorraadbeheer />} />
                  <Route path="/voorraadbeheer-software" element={<VoorraadbeheerSoftware />} />
                  <Route path="/voorraadbeheer" element={<Voorraadbeheer />} />
                  <Route path="/stockbeheer" element={<Stockbeheer />} />
                  <Route path="/simpelstockbeheer" element={<SimpelStockbeheer />} />
                  <Route path="/gratis-voorraadbeheer" element={<GratisVoorraadbeheer />} />
                  <Route path="/voorraadbeheer-voor-horeca" element={<VoorraadbeheerVoorHoreca />} />
                  
                  {/* Blog routes */}
                  <Route path="/blog" element={<BlogListPage />} />
                  <Route path="/blog/:slug" element={<BlogPostPage />} />
                  <Route path="/gratis-stockbeheer" element={<GratisStockbeheer />} />

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
                    <Route path="scan" element={<ScanPage />} />
                    <Route path="stock" element={<StockList />} />
                    <Route path="transactions" element={<StockMovements />} />
                    <Route path="settings" element={<Settings />}>
                      <Route index element={<ProfileSettings />} />
                      <Route path="profile" element={<ProfileSettings />} />
                      <Route path="branches" element={<BranchManagement />} />
                      <Route path="users" element={<UserManagement />} />
                      <Route path="modules" element={<ModuleManagement />} />
                      <Route path="license" element={<LicenseOverview />} />
                      <Route path="invoicing" element={<InvoicingOverview />} />
                    </Route>
                  </Route>

                  {/* Admin routes */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <StockManagementApp />
                      </ProtectedRoute>
                    }
                  >
                    <Route element={<Admin />}>
                      <Route index element={<AdminInvoicingPage />} />
                      <Route path="cms" element={<AdminCMS />} />
                      <Route path="notifications" element={<AdminNotificationsPage />} />
                      <Route path="chat" element={<AdminChatList />} />
                      <Route path="invoicing" element={<AdminInvoicingPage />} />
                      <Route path="seo" element={<SEO />} />
                      <Route path="user/:id" element={<AdminUserDetailPage />} />
                    </Route>
                  </Route>

                  {/* Fallback route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ContentWrapper>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
