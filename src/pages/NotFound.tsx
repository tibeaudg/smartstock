import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { SuggestionInput } from "@/components/SuggestionInput";
import SEO from '../components/SEO';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Home, Search, ArrowLeft, HelpCircle, BookOpen, Users, 
  TrendingUp, Package, BarChart3, Settings, Mail, Phone,
  ExternalLink, ChevronRight, AlertCircle
} from 'lucide-react';

const SUGGESTIES = [
  { label: "Home", path: "/", icon: Home, category: "main" },
  { label: "Pricing", path: "/pricing", icon: TrendingUp, category: "main" },
  { label: "Features", path: "/#features-section", icon: Package, category: "main" },
  { label: "Demo", path: "/#video-section", icon: BarChart3, category: "main" },
  { label: "Contact", path: "/#contact-section", icon: Mail, category: "main" },
  { label: "Inventory management tips", path: "/voorraadbeheer-tips", icon: BookOpen, category: "seo" },
  { label: "Compare software", path: "/voorraadbeheer-software-vergelijken", icon: Settings, category: "seo" },
  { label: "Inventory management webshop", path: "/voorraadbeheer-webshop", icon: Package, category: "seo" },
  { label: "Prevent errors", path: "/voorraadbeheer-fouten-voorkomen", icon: AlertCircle, category: "seo" },
  { label: "Automation", path: "/voorraadbeheer-automatiseren", icon: TrendingUp, category: "seo" },
  { label: "Inventory management hospitality", path: "/voorraadbeheer-horeca", icon: Users, category: "seo" },
  { label: "Excel vs. software", path: "/voorraadbeheer-excel-vs-software", icon: BarChart3, category: "seo" },
  { label: "Inventory management for starters", path: "/voorraadbeheer-voor-starters", icon: HelpCircle, category: "seo" },
  { label: "Mobile inventory management", path: "/mobiel-voorraadbeheer", icon: Package, category: "seo" },
];

const SOCIALS = [
  { label: "LinkedIn", url: "https://www.linkedin.com/company/stockflow", icon: "🔗" },
  { label: "Facebook", url: "https://www.facebook.com/stockflowapp", icon: "📘" },
  { label: "Twitter", url: "https://twitter.com/stockflowapp", icon: "🐦" },
];

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Use the page refresh hook
  usePageRefresh();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Enhanced structured data for 404 page
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Page Not Found (404) | StockFlow",
      "description": "This page doesn't exist. Find the right inventory management information, tips and solutions for SMEs here.",
      "url": `https://www.stockflow.be${location.pathname}`,
      "isPartOf": {
        "@type": "WebSite",
        "name": "StockFlow",
        "url": "https://www.stockflow.be"
      },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.stockflow.be/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "404 Error",
            "item": `https://www.stockflow.be${location.pathname}`
          }
        ]
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Where can I find inventory management tips?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Check out our comprehensive inventory management tips for SMEs on our dedicated page.",
            "author": {
              "@type": "Organization",
              "name": "StockFlow"
            }
          }
        },
        {
          "@type": "Question", 
          "name": "How can I automate inventory management?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Read our guide on inventory management automation for practical tips and solutions.",
            "author": {
              "@type": "Organization",
              "name": "StockFlow"
            }
          }
        },
        {
          "@type": "Question",
          "name": "What is StockFlow?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "StockFlow is a free inventory management software designed specifically for SMEs to track stock levels, manage inventory, and optimize business operations.",
            "author": {
              "@type": "Organization",
              "name": "StockFlow"
            }
          }
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "StockFlow",
      "url": "https://www.stockflow.be",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.stockflow.be/logo.png"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+32-123-456-789",
        "contactType": "customer service",
        "email": "info@stockflow.be"
      }
    }
  ];

  // Filter suggestions based on search term and category
  const filteredSuggestions = SUGGESTIES.filter(suggestion => {
    const matchesSearch = suggestion.label.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || suggestion.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const mainSuggestions = SUGGESTIES.filter(s => s.category === "main");
  const seoSuggestions = SUGGESTIES.filter(s => s.category === "seo");

  const handleSuggestionClick = (path: string) => {
    if (path.startsWith("#")) {
      // Scroll to section on homepage
      navigate("/");
      setTimeout(() => {
        const element = document.querySelector(path);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <SEO
          title="Page Not Found (404) | StockFlow"
          description="This page doesn't exist. Find the right inventory management information, tips and solutions for SMEs here."
          keywords="404, page not found, inventory management, stock management, tips, SME"
          url={`https://www.stockflow.be${location.pathname}`}
          structuredData={structuredData}
          noindex={true}
        />
        <Helmet>
          <meta name="prerender-status-code" content="404" />
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            The page you're looking for doesn't exist. But don't worry, we'll help you find what you need!
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search for what you need
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <Input
                type="text"
                placeholder="Search pages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button onClick={() => navigate("/")} className="px-6">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </div>
            
            {/* Category Filter */}
            <div className="flex gap-2 mb-4">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
              >
                All
              </Button>
              <Button
                variant={selectedCategory === "main" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("main")}
              >
                Main Pages
              </Button>
              <Button
                variant={selectedCategory === "seo" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("seo")}
              >
                Guides
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Main Pages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mainSuggestions.map((suggestion, index) => {
                  const IconComponent = suggestion.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion.path)}
                      className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <IconComponent className="h-4 w-4 text-blue-600" />
                      <span className="flex-1">{suggestion.label}</span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Helpful Guides
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {seoSuggestions.slice(0, 5).map((suggestion, index) => {
                  const IconComponent = suggestion.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion.path)}
                      className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <IconComponent className="h-4 w-4 text-green-600" />
                      <span className="flex-1">{suggestion.label}</span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Results */}
        {searchTerm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                Search Results ({filteredSuggestions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredSuggestions.length > 0 ? (
                <div className="space-y-2">
                  {filteredSuggestions.map((suggestion, index) => {
                    const IconComponent = suggestion.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion.path)}
                        className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <IconComponent className="h-4 w-4 text-blue-600" />
                        <span className="flex-1">{suggestion.label}</span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No results found. Try a different search term.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Contact Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Still can't find what you're looking for?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Support
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Get help from our support team
                </p>
                <a 
                  href="mailto:info@stockflow.be" 
                  className="text-blue-600 hover:underline"
                >
                  info@stockflow.be
                </a>
              </div>
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Support
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Call us for immediate assistance
                </p>
                <a 
                  href="tel:+32123456789" 
                  className="text-blue-600 hover:underline"
                >
                  +32 123 45 67 89
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            Error: Page not found ({location.pathname})
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
