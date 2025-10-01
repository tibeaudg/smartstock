import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateComprehensiveStructuredData } from '../../lib/structuredData';
import { 
  BarChart3, 
  CheckCircle,
  Star,
  MapPin,
  Building,
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  Package,
  Zap,
  Globe
} from 'lucide-react';

export default function RetailMultiLocation() {
  // Use the page refresh hook
  usePageRefresh();
  
  const faqData = [
    {
      question: "What is multi-location retail management and why is it important?",
      answer: "Multi-location retail management allows you to manage inventory, sales, and operations across multiple store locations from a single dashboard. It's essential for retail chains, franchises, and businesses with multiple outlets to maintain consistent operations, optimize stock levels, and ensure all locations have the right products at the right time."
    },
    {
      question: "How does multi-location inventory management work?",
      answer: "Multi-location inventory management provides centralized control over all your store locations. You can transfer stock between locations, view real-time inventory across all stores, set location-specific reorder points, and generate consolidated reports. This helps optimize inventory distribution and reduce overall carrying costs."
    },
    {
      question: "Can I transfer inventory between different store locations?",
      answer: "Yes! StockFlow's multi-location management includes built-in transfer functionality. You can easily move products between locations, track transfer history, and set up automatic reorder rules based on sales patterns at each location."
    },
    {
      question: "How do I handle different pricing or promotions across locations?",
      answer: "Multi-location management allows you to set location-specific pricing, promotions, and discounts. You can also apply company-wide promotions or customize offers for specific markets while maintaining centralized control over your pricing strategy."
    },
    {
      question: "What reporting features are available for multi-location businesses?",
      answer: "Get comprehensive reports including location-specific sales performance, inventory turnover by store, transfer reports, and consolidated analytics. Compare performance across locations, identify top-performing stores, and make data-driven decisions for your entire retail network."
    }
  ];

  // Generate structured data
  const structuredData = generateComprehensiveStructuredData('software', {
    title: "Multi-Location Retail Management - Chain Store Inventory Control",
    url: "https://www.stockflow.be/retail-multi-location",
    description: "Manage multiple retail locations with centralized inventory control. Transfer stock, track sales, and optimize operations across your retail chain.",
    breadcrumbs: [
      { name: "Home", url: "https://www.stockflow.be/", position: 1 },
      { name: "Multi-Location Retail Management", url: "https://www.stockflow.be/retail-multi-location", position: 2 }
    ],
    faqData: faqData,
    softwareData: {
      name: "StockFlow - Multi-Location Retail Management",
      description: "Manage multiple retail locations with centralized inventory control. Transfer stock, track sales, and optimize operations across your retail chain.",
      category: "BusinessApplication",
      operatingSystem: "Web Browser",
      price: "0",
      currency: "EUR",
      rating: {
        value: "4.8",
        count: "120"
      },
      features: [
        "Multi-location inventory",
        "Stock transfers",
        "Location-specific reporting",
        "Centralized management",
        "Real-time sync",
        "Performance analytics"
      ],
      image: "https://www.stockflow.be/Inventory-Management.png",
      url: "https://www.stockflow.be/retail-multi-location"
    }
  });

  const features = [
    {
      icon: Building,
      title: "Multi-Location Dashboard",
      description: "Manage all your store locations from one centralized dashboard. Get real-time visibility into inventory, sales, and operations across your entire retail network."
    },
    {
      icon: Package,
      title: "Stock Transfers",
      description: "Easily transfer inventory between locations with automated workflows. Track transfer history and optimize stock distribution based on demand patterns."
    },
    {
      icon: MapPin,
      title: "Location-Specific Settings",
      description: "Configure different pricing, promotions, and inventory rules for each location while maintaining centralized control and oversight."
    },
    {
      icon: BarChart3,
      title: "Comparative Analytics",
      description: "Compare performance across locations, identify top-performing stores, and make data-driven decisions to optimize your entire retail network."
    },
    {
      icon: Globe,
      title: "Centralized Management",
      description: "Control user permissions, access levels, and operational settings across all locations from a single administrative interface."
    },
    {
      icon: Zap,
      title: "Real-Time Synchronization",
      description: "All locations sync in real-time, ensuring accurate inventory levels and consistent data across your entire retail chain."
    }
  ];

  const benefits = [
    "Optimize inventory across all locations",
    "Reduce overall carrying costs by 20%",
    "Improve stock turnover rates",
    "Eliminate stockouts with smart transfers",
    "Centralize management operations",
    "Get location-specific insights",
    "Scale your retail network efficiently",
    "Maintain consistent brand experience"
  ];

  const multiLocationFeatures = [
    {
      title: "Inventory Visibility",
      description: "See real-time inventory levels across all your store locations in one dashboard. Never lose track of stock again.",
      icon: "👁️",
      benefit: "Complete visibility"
    },
    {
      title: "Smart Transfers",
      description: "Automatically suggest stock transfers based on sales patterns and demand forecasting at each location.",
      icon: "🚚",
      benefit: "Optimized distribution"
    },
    {
      title: "Performance Comparison",
      description: "Compare sales performance, inventory turnover, and profitability across all your retail locations.",
      icon: "📊",
      benefit: "Data-driven decisions"
    },
    {
      title: "Centralized Control",
      description: "Manage pricing, promotions, and inventory policies across all locations while allowing local customization.",
      icon: "🎛️",
      benefit: "Unified management"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Operations Manager, Fashion Chain",
      content: "Managing 8 store locations used to be a nightmare. StockFlow's multi-location features let us optimize inventory across all stores and reduce carrying costs by 25%.",
      rating: 5
    },
    {
      name: "David Park",
      role: "Owner, Electronics Retail Chain",
      content: "The stock transfer feature is a game-changer. We can quickly move inventory between stores based on demand, ensuring customers always find what they need.",
      rating: 5
    },
    {
      name: "Maria Gonzalez",
      role: "Franchise Owner, Gift Shop Chain",
      content: "The comparative analytics help us identify which stores are performing best and why. We've used these insights to improve underperforming locations by 30%.",
      rating: 5
    }
  ];

  const implementationSteps = [
    {
      step: "1",
      title: "Add Locations",
      description: "Set up all your store locations with specific settings and configurations"
    },
    {
      step: "2",
      title: "Import Inventory",
      description: "Upload existing inventory data for each location or start fresh"
    },
    {
      step: "3",
      title: "Configure Transfers",
      description: "Set up transfer rules and automated workflows between locations"
    },
    {
      step: "4",
      title: "Train Teams",
      description: "Train your staff at each location on the new multi-location system"
    }
  ];

  return (
    <SeoPageLayout title="Multi-Location Retail Management">
      <SEO
        title="Multi-Location Retail Management - Chain Store Inventory Control 2024 | StockFlow"
        description="Manage multiple retail locations with centralized inventory control. Transfer stock, track sales, optimize operations. Free trial!"
        keywords="multi-location retail management, chain store inventory, retail chain management, multi-store inventory, retail franchise management, chain store software, multi-location inventory system, retail chain software, multi-store management, retail chain inventory, franchise inventory management, multi-location retail software, chain store management system, retail chain operations, multi-store inventory control"
        url="https://www.stockflow.be/retail-multi-location"
        structuredData={structuredData}
      />

      {/* Hero Section with Background */}
      <section 
        className="relative py-16 sm:py-20 md:py-24 px-4 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/image.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              Multi-Location <span className="text-blue-400">Retail Management</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-4xl mx-auto">
              Manage your entire retail chain from one dashboard. Transfer stock between locations, track performance across stores, and optimize operations for maximum profitability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                to="/auth"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition shadow-lg"
              >
                Start Free Trial
              </Link>
              <Link
                to="/demo"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition shadow-lg"
              >
                Watch Demo
              </Link>
            </div>
            <p className="text-sm text-gray-200">Trusted by 200+ retail chains for multi-location management</p>
          </div>
        </div>
      </section>

      {/* Multi-Location Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Powerful <span className="text-blue-600">Multi-Location Features</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage multiple retail locations efficiently and profitably.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {multiLocationFeatures.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-green-800">Key Benefit:</p>
                  <p className="text-sm text-green-700">{feature.benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Complete <span className="text-blue-600">Multi-Location Solution</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Advanced features designed specifically for retail chains and multi-location businesses.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why Choose <span className="text-blue-600">Multi-Location Management</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Transform your retail chain operations with centralized multi-location management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Get Started in <span className="text-blue-600">4 Simple Steps</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Set up your multi-location retail management system quickly and efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {implementationSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Success Stories from <span className="text-blue-600">Retail Chain Owners</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how retail chains have improved their multi-location operations with StockFlow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Manage Multiple Locations?
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Join hundreds of retail chains using StockFlow for efficient multi-location management and optimized operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/auth"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition shadow-lg"
            >
              Start Free Trial
            </Link>
            <Link
              to="/demo"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition"
            >
              Watch Demo
            </Link>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm opacity-75">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              No credit card required
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Instant access
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Free trial
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Everything you need to know about multi-location retail management</p>
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
            alt="StockFlow"
            className="h-10 md:h-12 mx-auto mb-6"
          />
          <p className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
            Multi-location retail management for chains and franchises. Centralized control, optimized operations.
          </p>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} StockFlow. All rights reserved.
              Multi-location retail management solutions.
            </p>
          </div>
        </div>
      </footer>

    </SeoPageLayout>
  );
}
