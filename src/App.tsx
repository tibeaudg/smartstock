import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StockManagementApp } from "./components/StockManagementApp";
import { HomePage } from "./components/HomePage";
import { AuthPage } from "./components/AuthPage";
import NotFound from "./pages/NotFound";
import { StripeProvider } from "./providers/StripeProvider";

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

const App = () => {
  console.log('App component rendered');
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <StripeProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/dashboard" element={<StockManagementApp />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </StripeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
