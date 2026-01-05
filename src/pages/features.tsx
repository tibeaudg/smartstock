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
import Header from '@/components/HeaderPublic';
import SEO from '@/components/SEO';
import { generateComprehensiveStructuredData } from '@/lib/structuredData';
import { Link } from 'react-router-dom';

export default function FeaturesPage() {
  const navigate = useNavigate();

  const structuredData = generateComprehensiveStructuredData(
    {
      name: 'StockFlow Features',
      description: 'Comprehensive inventory management features for small businesses in Belgium',
      url: 'https://www.stockflowsystems.com/features'
    }
  );

  const coreFeatures = [
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Mobile Barcode Scanning",
      description: "Use your phone's camera no scanner needed. Count 100 items in 3 minutes instead of 30.",
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
      description: "See stock levels update instantly. Know exactly what's where, right now not tomorrow.",
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
      description: "Identify your bestsellers. Flag dead stock draining capital. Track turnover ratios that actually matter.",
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
      description: "Automatically flags items with zero sales for 30/60/90 days. Recover capital before items expire or become obsolete.",
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
      description: "Track stock across shops, warehouses, trucks. Transfer items between locations with a tap. No more calling to check availability.",
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
      description: "Multiple people scan simultaneously. Real-time sync prevents conflicts. Role-based permissions keep data secure.",
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
        title="Inventory Software Features 2025 | StockFlow"
        description="Complete inventory management features: mobile barcode scanning, real-time tracking, multi-location support, analytics & reporting. Free plan available."
        keywords="inventory management features, stock management features, inventory software features, barcode scanning features, inventory tracking features, inventory management tools, stock management tools, inventory features list, best inventory management features, inventory software capabilities, stock control features, warehouse management features, inventory system features, inventory tracking software features, inventory management system features"
        url="https://www.stockflowsystems.com/features"
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
              Inventory Tools That Actually Save Time
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Skip the clipboard. Ditch the spreadsheets. Scan barcodes with your phone, get instant stock alerts, track dead inventory automatically. Our users cut counting time by 75% here's how.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/auth?mode=register')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full"
              >
                Join for Free
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
              Enterprise-grade features without enterprise pricing. Built for retailers, contractors, and small manufacturers who need accuracy without complexity.
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
              Power user features for businesses ready to scale: API integrations, custom workflows, priority support.
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

      {/* Feature Use Cases Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Real-World Use Cases
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Real scenarios from actual users. These aren't hypothetical use cases they're patterns we see daily from businesses using StockFlow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">E-commerce Retailer</h3>
              <p className="text-gray-700 mb-4">
                A Brussels-based online shop runs two warehouses. They scan incoming shipments on their phones, sync stock across both locations in real-time, and automatically flag bestsellers that need reordering. Stockouts dropped 85% in the first quarter.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Multi-channel inventory synchronization</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Real-time stock level updates across platforms</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Automated low stock alerts prevent overselling</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Field Service Contractor</h3>
              <p className="text-gray-700 mb-4">
                An HVAC contractor tracks parts across five service vans. Technicians scan items as they use them, so dispatchers know real-time availability. No more "drive back to the warehouse" scenarios. They cut return trips by 60%.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Track inventory across multiple service vehicles</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Mobile access for technicians in the field</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Real-time visibility for dispatchers</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Manufacturing Company</h3>
              <p className="text-gray-700 mb-4">
                A small manufacturer tracks raw materials, WIP, and finished goods. The dead stock optimizer flagged €8,500 in slow-moving inventory they liquidated it at 30% margin instead of letting it sit. Capital freed up for fast-moving items.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Track raw materials and components</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Optimize inventory turnover with analytics</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Identify and liquidate dead stock</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Multi-Location Retail Chain</h3>
              <p className="text-gray-700 mb-4">
                A three-store fashion chain tracks inventory across locations. When Store A runs low, they transfer from Store B with a few taps. Centralized dashboard shows all stores at once no more phone calls checking availability. Stock balancing improved by 70%.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Unified view of inventory across all stores</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Transfer management between locations</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Location-specific reporting and analytics</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Related Resources Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore More About StockFlow
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Deep dives on specific solutions, industry workflows, and transparent pricing no hidden costs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Pillar Page Link */}
            <Card className="hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl mb-2">Complete Guide</CardTitle>
                <CardDescription>
                  Comprehensive guide to inventory management software
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link 
                  to="/inventory-management-software" 
                  className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2 group"
                >
                  Read Complete Guide
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </CardContent>
            </Card>

            {/* Solutions Pages Link */}
            <Card className="hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl mb-2">Solutions</CardTitle>
                <CardDescription>
                  Explore inventory management solutions by use case
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link 
                  to="/solutions/inventory-management-software" 
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-2 group"
                >
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  Inventory Software Solutions
                </Link>
                <Link 
                  to="/solutions/mobile-inventory-management" 
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-2 group"
                >
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  Mobile Inventory Management
                </Link>
                <Link 
                  to="/solutions/inventory-management-software-cloud-based" 
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-2 group"
                >
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  Cloud-Based Solutions
                </Link>
              </CardContent>
            </Card>

            {/* Industry Pages Link */}
            <Card className="hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl mb-2">By Industry</CardTitle>
                <CardDescription>
                  See how features work in different industries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link 
                  to="/industries/contractor-inventory-management" 
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-2 group"
                >
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  Contractor Inventory
                </Link>
                <Link 
                  to="/warehouse-inventory-management" 
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-2 group"
                >
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  Warehouse Management
                </Link>
                <Link 
                  to="/industries/retail-inventory-management" 
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-2 group"
                >
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  Retail Inventory
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Pricing CTA */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to See Pricing?</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                View our transparent pricing plans and start your 14-day free trial. No credit card required.
              </p>
              <Link to="/pricing">
                <Button 
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  View Pricing Plans
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
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
              All features included on all plans. No upselling. No feature gates. Everything you see above is free forever.
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
            Over 500 businesses already using StockFlow. Most see time savings within the first week.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/auth?mode=register')}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full"
            >
              Join for Free
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
            No credit card required • Free forever • No subscriptions
          </p>
        </div>
      </section>
    </div>
  );
}
