import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import SEO from '../components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Home, AlertCircle, RefreshCw, Mail, HelpCircle
} from 'lucide-react';

const ServerError = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "500 Error: Server error occurred"
    );
  }, []);

  // Structured data for 500 page
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Server Error (500) | StockFlow",
      "description": "We're experiencing technical difficulties. Our team has been notified and is working to resolve the issue.",
      "url": "https://www.stockflow.be/500",
      "isPartOf": {
        "@type": "WebSite",
        "name": "StockFlow",
        "url": "https://www.stockflow.be"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <SEO
          title="Server Error (500) | StockFlow"
          description="We're experiencing technical difficulties. Our team has been notified and is working to resolve the issue."
          keywords="500, server error, technical difficulties"
          url="https://www.stockflow.be/500"
          structuredData={structuredData}
          noindex={true}
        />
        <Helmet>
          <meta name="prerender-status-code" content="500" />
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">500</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Server Error
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            We're experiencing technical difficulties. Our team has been notified and is working to resolve the issue.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8 justify-center items-center">
          <Button onClick={() => window.location.reload()} className="px-6">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button onClick={() => navigate("/")} variant="outline" className="px-6">
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        </div>

        {/* Contact Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Need immediate assistance?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6 justify-center items-center">
              <div className="flex flex-col gap-2 justify-center items-center">
                <h3 className="font-semibold mb-3 flex items-center justify-center gap-2">
                  <Mail className="h-4 w-4" />
                  Contact our support team
                </h3>
        
                <a 
                  href="mailto:info@stockflow.be" 
                  className="text-blue-600 hover:underline"
                >
                  info@stockflow.be
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServerError;




