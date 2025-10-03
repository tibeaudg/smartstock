import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Smartphone, 
  Package, 
  BarChart3, 
  Building, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Shield, 
  Zap, 
  Target,
  CheckCircle,
  ArrowRight,
  Play,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/HeaderPublic';
import SEO from '@/components/SEO';
import { generateComprehensiveStructuredData } from '@/lib/structuredData';

export default function FeaturesPage() {
  const navigate = useNavigate();

  const structuredData = generateComprehensiveStructuredData(
    {
      name: 'StockFlow Features',
      description: 'Comprehensive inventory management features for small businesses in Belgium',
      url: 'https://www.stockflow.be/features'
    }
  );

  const coreFeatures = [
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Mobile Barcode Scanning",
      description: "Scan barcodes with your phone camera. No special hardware needed.",
      benefits: [
        "Works offline",
        "iOS & Android compatible", 
        "Instant stock updates",
        "Product identification"
      ]
    },
    {
      icon: <Package className="h-8 w-8" />,
      title: "Inventory Tracking",
      description: "Real-time stock levels across all your locations.",
      benefits: [
        "Multi-location support",
        "Low stock alerts",
        "Stock movement history",
        "Expiry date tracking"
      ]
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Analytics & Reports",
      description: "Understand your inventory performance with detailed insights.",
      benefits: [
        "Sales velocity reports",
        "Dead stock identification",
        "Turnover analysis",
        "Profit margin tracking"
      ]
    },
    {
      icon: <AlertTriangle className="h-8 w-8" />,
      title: "Dead Stock Optimizer",
      description: "Automatically identify and liquidate slow-moving inventory.",
      benefits: [
        "30/60/90 day alerts",
        "Capital recovery calculator",
        "Liquidation recommendations",
        "Waste reduction tracking"
      ]
    },
    {
      icon: <Building className="h-8 w-8" />,
      title: "Multi-Location Management",
      description: "Manage inventory across multiple stores, warehouses, and locations.",
      benefits: [
        "Centralized dashboard",
        "Location-specific alerts",
        "Transfer management",
        "Unified reporting"
      ]
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Team Collaboration",
      description: "Work together with your team on inventory management.",
      benefits: [
        "Role-based permissions",
        "Activity tracking",
        "Team notifications",
        "Shared dashboards"
      ]
    }
  ];

  const advancedFeatures = [
    {
      title: "API Integration",
      description: "Connect StockFlow with your existing systems and workflows.",
      icon: <Zap className="h-6 w-6" />
    },
    {
      title: "Custom Branding",
      description: "White-label your inventory management with your company branding.",
      icon: <Target className="h-6 w-6" />
    },
    {
      title: "Priority Support",
      description: "Get dedicated support with faster response times.",
      icon: <Shield className="h-6 w-6" />
    },
    {
      title: "Advanced Analytics",
      description: "Deep-dive into your inventory data with custom reports.",
      icon: <TrendingUp className="h-6 w-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="StockFlow Features - Complete Inventory Management Solution"
        description="Discover all StockFlow features: mobile scanning, analytics, multi-location tracking, dead stock optimization, and more for Belgian businesses."
        keywords="stockflow features, inventory management features, barcode scanning, stock tracking, analytics, Belgium"
        url="https://www.stockflow.be/features"
        structuredData={structuredData}
      />
      
      <Header 
        onLoginClick={() => navigate('/auth?mode=login')}
        onNavigate={() => {}}
        simplifiedNav={false}
        hideNotifications={true}
      />

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Everything You Need to Manage Inventory
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              From mobile scanning to advanced analytics, StockFlow provides all the tools 
              you need to optimize your inventory and boost your bottom line.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/auth?mode=register')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full"
              >
                Start Free Trial
              </Button>
              <Button
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg font-semibold rounded-full flex items-center gap-2"
              >
                <Play className="h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Core Features
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Powerful inventory management tools designed specifically for small businesses in Belgium.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <Card key={index} className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-gray-700">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center gap-2 text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Advanced Features
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Take your inventory management to the next level with our premium features.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advancedFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 text-purple-600">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Compare Plans
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Choose the plan that best fits your business needs.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Features</th>
                    <th className="px-6 py-4 text-center font-semibold text-gray-900">
                      <div className="text-lg">Free</div>
                      <div className="text-sm text-gray-600">€0/month</div>
                    </th>
                    <th className="px-6 py-4 text-center font-semibold text-gray-900 bg-blue-50">
                      <div className="text-lg">Growth</div>
                      <div className="text-sm text-gray-600">€29/month</div>
                      <Badge className="mt-2 bg-blue-600">Most Popular</Badge>
                    </th>
                    <th className="px-6 py-4 text-center font-semibold text-gray-900">
                      <div className="text-lg">Premium</div>
                      <div className="text-sm text-gray-600">€79/month</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Mobile Barcode Scanning</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center bg-blue-50">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Inventory Tracking</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center bg-blue-50">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Analytics & Reports</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-gray-400">Basic</span>
                    </td>
                    <td className="px-6 py-4 text-center bg-blue-50">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Dead Stock Optimizer</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-gray-400">-</span>
                    </td>
                    <td className="px-6 py-4 text-center bg-blue-50">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Multi-Location Support</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-gray-400">1 location</span>
                    </td>
                    <td className="px-6 py-4 text-center bg-blue-50">
                      <span className="text-gray-700">3 locations</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-gray-700">10 locations</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">API Access</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-gray-400">-</span>
                    </td>
                    <td className="px-6 py-4 text-center bg-blue-50">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Priority Support</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-gray-400">Email only</span>
                    </td>
                    <td className="px-6 py-4 text-center bg-blue-50">
                      <span className="text-gray-700">Email + Chat</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-gray-700">Phone + Chat + Email</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join 500+ Belgian businesses already using StockFlow to optimize their inventory.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/auth?mode=register')}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full"
            >
              Start Free Trial
            </Button>
            <Button
              onClick={() => navigate('/contact')}
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-full"
            >
              Contact Sales
            </Button>
          </div>
          <p className="text-blue-200 text-sm mt-4">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
}
