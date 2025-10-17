import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateComprehensiveStructuredData } from '../../lib/structuredData';
import { 
  Wine, 
  Calendar,
  AlertTriangle,
  TrendingDown,
  DollarSign,
  Package,
  CheckCircle,
  Clock,
  BarChart3,
  Smartphone,
  Building,
  Users,
  Shield,
  Zap
} from 'lucide-react';

export default function WineShopInventoryManagement() {
  usePageRefresh();
  
  const faqData = [
    {
      question: "How does StockFlow help wine shops track expiry dates?",
      answer: "StockFlow automatically tracks expiry dates for all your wine inventory. Set expiry alerts for wines that need to be sold before they expire, and get notifications when wines are approaching their expiry date. This prevents losses from expired inventory and helps you plan promotions."
    },
    {
      question: "Can I manage multiple wine shop locations with StockFlow?",
      answer: "Yes! StockFlow supports multi-location management, perfect for wine shops with separate storage, retail, and tasting room locations. Track inventory across all locations, transfer stock between locations, and get location-specific reports."
    },
    {
      question: "How does the dead stock optimizer work for wine shops?",
      answer: "Our dead stock optimizer identifies wines that haven't moved in 30, 60, or 90 days. It calculates how much capital is tied up in slow-moving inventory and provides recommendations for promotions, tastings, or liquidation to free up cash flow."
    },
    {
      question: "Does StockFlow integrate with wine shop POS systems?",
      answer: "Yes! StockFlow integrates with popular POS systems like Square, Shopify, and others through CSV import/export. When you make a sale, your inventory is automatically updated. We also support barcode scanning for quick inventory updates."
    },
    {
      question: "Can I track wine vintages and suppliers in StockFlow?",
      answer: "Absolutely! StockFlow allows you to track wine vintages, suppliers, and detailed product information. You can set up supplier management, track purchase history, and maintain detailed records of each wine's origin and characteristics."
    }
  ];

  const structuredData = generateComprehensiveStructuredData('software', {
    title: "Wine Shop Inventory Management Software | StockFlow",
    url: "https://www.stockflow.be/wine-shop-inventory-management",
    description: "Specialized inventory management for wine shops. Track expiry dates, manage vintages, optimize dead stock, and prevent losses. Free trial available.",
    breadcrumbs: [
      { name: "Home", url: "https://www.stockflow.be/", position: 1 },
      { name: "Wine Shop Inventory Management", url: "https://www.stockflow.be/wine-shop-inventory-management", position: 2 }
    ],
    faqData: faqData,
    softwareData: {
      name: "StockFlow Wine Shop Inventory Management",
      description: "Specialized inventory management software for wine shops and specialty beverage retailers.",
      category: "BusinessApplication",
      operatingSystem: "Web, iOS, Android",
      price: "0",
      currency: "EUR",
      rating: {
        value: "4.8",
        count: "127"
      },
      features: [
        "Wine expiry date tracking",
        "Vintage management",
        "Dead stock optimization",
        "Multi-location support",
        "Barcode scanning",
        "Supplier management",
        "POS integration"
      ],
      image: "https://www.stockflow.be/Inventory-Management.png",
      url: "https://www.stockflow.be/wine-shop-inventory-management"
    }
  });

  const wineShopFeatures = [
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Expiry Date Tracking",
      description: "Never lose money on expired wine again. Set expiry alerts and get notified before wines expire.",
      benefits: [
        "Automatic expiry notifications",
        "Prevent expired inventory losses",
        "Plan promotions before expiry",
        "Track wine aging periods"
      ]
    },
    {
      icon: <TrendingDown className="h-8 w-8" />,
      title: "Dead Stock Optimizer",
      description: "Identify slow-moving wines and free up capital. Our AI identifies wines that haven't moved in 30+ days.",
      benefits: [
        "Flag non-moving inventory",
        "Calculate tied-up capital",
        "Liquidation recommendations",
        "Promotion suggestions"
      ]
    },
    {
      icon: <Building className="h-8 w-8" />,
      title: "Multi-Location Management",
      description: "Manage storage, retail, and tasting room locations from one dashboard.",
      benefits: [
        "Centralized inventory view",
        "Location-specific tracking",
        "Transfer management",
        "Unified reporting"
      ]
    },
    {
      icon: <Wine className="h-8 w-8" />,
      title: "Vintage & Supplier Tracking",
      description: "Track wine vintages, suppliers, and detailed product information.",
      benefits: [
        "Vintage management",
        "Supplier relationships",
        "Purchase history",
        "Product characteristics"
      ]
    }
  ];

  const painPoints = [
    {
      problem: "Wine going bad before selling",
      solution: "Expiry date tracking with alerts",
      icon: <AlertTriangle className="h-6 w-6 text-red-500" />
    },
    {
      problem: "Capital tied up in slow wines",
      solution: "Dead stock optimizer identifies non-movers",
      icon: <DollarSign className="h-6 w-6 text-yellow-500" />
    },
    {
      problem: "Managing multiple locations",
      solution: "Multi-location inventory management",
      icon: <Building className="h-6 w-6 text-blue-500" />
    },
    {
      problem: "Lost sales from stockouts",
      solution: "Real-time inventory tracking",
      icon: <Package className="h-6 w-6 text-green-500" />
    }
  ];

  return (
    <SeoPageLayout title="Wine Shop Inventory Management">
      <SEO
        title="Wine Shop Inventory Management Software | StockFlow"
        description="Specialized inventory management for wine shops. Track expiry dates, manage vintages, optimize dead stock, and prevent losses. Free trial available."
        keywords="wine shop inventory management, wine inventory software, wine expiry tracking, dead stock optimizer, wine shop POS, specialty beverage inventory, wine vintage management"
        url="https://www.stockflow.be/wine-shop-inventory-management"
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-900 via-red-800 to-red-900 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Stop Losing Money on <span className="text-yellow-300">Expired Wine</span>
              </h1>
              <p className="text-xl text-red-100 mb-8 leading-relaxed">
                Specialized inventory management for wine shops. Track expiry dates, optimize dead stock, 
                and prevent losses with our wine-focused inventory software.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/auth"
                  className="bg-yellow-500 text-red-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-400 transition"
                >
                  Start Free Trial
                </Link>
                <Link
                  to="#features"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-red-900 transition"
                >
                  See Features
                </Link>
              </div>
              <p className="text-sm text-red-200 mt-4">No credit card required • 30-day free trial</p>
            </div>
            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&h=400&fit=crop" 
                alt="Wine shop inventory management" 
                className="w-full max-w-md mx-auto rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Common Wine Shop <span className="text-red-600">Inventory Problems</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Wine shops face unique inventory challenges. Here's how StockFlow solves them:
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {painPoints.map((point, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="flex justify-center mb-4">
                  {point.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{point.problem}</h3>
                <p className="text-sm text-gray-600 mb-4">{point.solution}</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '100%'}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Wine Shop <span className="text-red-600">Inventory Features</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Built specifically for wine shops and specialty beverage retailers
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {wineShopFeatures.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16 px-4 bg-red-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="text-red-600">Proven Results</span> for Wine Shops
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">40%</div>
              <h3 className="text-lg font-semibold mb-2">Reduction in Dead Stock</h3>
              <p className="text-gray-600">Wine shops using StockFlow reduce dead stock by an average of 40% within 3 months.</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">€15,000</div>
              <h3 className="text-lg font-semibold mb-2">Average Savings</h3>
              <p className="text-gray-600">Wine shops save an average of €15,000 annually by preventing expired inventory losses.</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">3 Hours</div>
              <h3 className="text-lg font-semibold mb-2">Weekly Time Saved</h3>
              <p className="text-gray-600">Save 3+ hours per week on inventory management tasks with automated tracking.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-red-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Stop Losing Money on Expired Wine?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Join wine shops across Belgium and Netherlands who trust StockFlow for their inventory management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="bg-yellow-500 text-red-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-400 transition"
            >
              Start Free Trial
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-red-900 transition"
            >
              Schedule Demo
            </Link>
          </div>
          <p className="text-sm text-red-200 mt-4">No credit card required • 30-day free trial • Cancel anytime</p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Everything you need to know about wine shop inventory management</p>
          </div>
          
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-200 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <img
            src="/logo.png"
            alt="stockflow"
            className="h-10 md:h-12 mx-auto mb-6"
          />
          <p className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
            Specialized inventory management solutions for wine shops and specialty beverage retailers.
            Track expiry dates, optimize dead stock, and prevent losses.
          </p>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} stockflow. All rights reserved.
              Wine shop inventory management made simple.
            </p>
          </div>
        </div>
      </footer>
    </SeoPageLayout>
  );
}
