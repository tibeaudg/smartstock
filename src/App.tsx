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

// Configure QueryClient to prevent unnecessary refetches
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
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

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, userProfile } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!user || !userProfile) {
    console.log('User not authenticated, redirecting to auth');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

// Auth Route Component
const AuthRoute = () => {
  const { user, loading, userProfile } = useAuth();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (user && userProfile) {
    console.log('User authenticated, redirecting to:', from);
    // Redirect to the page they tried to visit or dashboard
    return <Navigate to={from} replace />;
  }
  
  return <AuthPage />;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthRoute />} />
              <Route path="/dashboard/*" element={
                <ProtectedRoute>
                  <StockManagementApp />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard userRole="staff" />} />
                <Route path="stock" element={<StockList />} />
                <Route path="transactions" element={<StockMovements />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
