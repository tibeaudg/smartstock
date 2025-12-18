import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Database, 
  ShoppingCart, 
  Mail, 
  CreditCard, 
  BarChart3, 
  Smartphone,
  CheckCircle,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import SEO from '@/components/SEO';
import Header from '@/components/HeaderPublic';
import Footer from '@/components/Footer';

const integrations = [
  {
    name: 'Stripe',
    description: 'Seamless payment processing for your business',
    icon: <CreditCard className="h-8 w-8" />,
    category: 'Payments',
    status: 'Available',
    features: ['Payment processing', 'Subscription management', 'Invoice generation']
  },
  {
    name: 'Supabase',
    description: 'Real-time database and authentication',
    icon: <Database className="h-8 w-8" />,
    category: 'Database',
    status: 'Available',
    features: ['Real-time updates', 'User authentication', 'Data storage']
  },
  {
    name: 'Shopify',
    description: 'Import inventory data from Shopify stores',
    icon: <ShoppingCart className="h-8 w-8" />,
    category: 'E-commerce',
    status: 'CSV Support',
    features: ['CSV import/export', 'Product sync', 'Inventory updates', 'Order tracking']
  },
  {
    name: 'Square',
    description: 'Connect with Square POS systems',
    icon: <ShoppingCart className="h-8 w-8" />,
    category: 'POS',
    status: 'CSV Support',
    features: ['CSV import/export', 'Product sync', 'Sales data import', 'Multi-location support']
  },
  {
    name: 'WooCommerce',
    description: 'WordPress e-commerce integration',
    icon: <ShoppingCart className="h-8 w-8" />,
    category: 'E-commerce',
    status: 'Coming Soon',
    features: ['API integration', 'Real-time sync', 'Order management', 'Inventory sync']
  },
  {
    name: 'Email Marketing',
    description: 'Sync with email marketing platforms',
    icon: <Mail className="h-8 w-8" />,
    category: 'Marketing',
    status: 'Coming Soon',
    features: ['Mailchimp integration', 'Customer segmentation', 'Automated emails']
  },
  {
    name: 'Analytics',
    description: 'Advanced reporting and analytics',
    icon: <BarChart3 className="h-8 w-8" />,
    category: 'Analytics',
    status: 'Available',
    features: ['Sales reports', 'Inventory analytics', 'Performance metrics']
  },
  {
    name: 'Mobile App',
    description: 'Native mobile applications',
    icon: <Smartphone className="h-8 w-8" />,
    category: 'Mobile',
    status: 'Available',
    features: ['iOS app', 'Android app', 'Offline sync']
  }
];

const categories = ['All', 'Payments', 'Database', 'E-commerce', 'POS', 'Marketing', 'Analytics', 'Mobile'];

export default function IntegrationsPage() {
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredIntegrations = selectedCategory === 'All' 
    ? integrations 
    : integrations.filter(integration => integration.category === selectedCategory);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Integrations - StockFlow",
    "description": "Connect StockFlow with your favorite tools and services for a complete business solution",
    "url": "https://www.stockflowsystems.com/integrations",
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": "StockFlow Integrations",
      "description": "Powerful integrations for inventory management"
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Integrations - StockFlow"
        description="Connect StockFlow with your favorite tools and services. Stripe payments, Supabase database, e-commerce platforms, and more."
        keywords="integrations, API, Stripe, Supabase, e-commerce, inventory management, business tools"
        url="https://www.stockflowsystems.com/integrations"
        structuredData={structuredData}
      />

      <Header />

      {/* Hero Section */}
      <div className="pt-40 bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Powerful Integrations
            </h1>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Integrations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredIntegrations.map((integration) => (
            <Card key={integration.name} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                    {integration.icon}
                  </div>
                  <Badge 
                    variant={integration.status === 'Available' ? 'default' : 'secondary'}
                    className={
                      integration.status === 'Available' 
                        ? 'bg-green-100 text-green-800' 
                        : integration.status === 'CSV Support'
                        ? 'bg-blue-100 text-blue-800'
                        : ''
                    }
                  >
                    {integration.status}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{integration.name}</CardTitle>
                <CardDescription className="text-gray-600">
                  {integration.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <Badge variant="secondary" className="mb-3">
                      {integration.category}
                    </Badge>
                  </div>
                  <ul className="space-y-2">
                    {integration.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {integration.status === 'Available' && (
                    <Button className="w-full mt-4" variant="outline">
                      Connect
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                  {integration.status === 'CSV Support' && (
                    <Button className="w-full mt-4" variant="outline">
                      View CSV Guide
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                  {integration.status === 'Coming Soon' && (
                    <Button className="w-full mt-4" variant="outline" disabled>
                      Coming Soon
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* API Section */}
        <div className="mt-20 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <Zap className="h-16 w-16 text-blue-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Custom Integrations</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Need a custom integration? Our robust API allows you to connect StockFlow with any system or build your own integrations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                View API Documentation
                <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
