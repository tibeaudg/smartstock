import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateComprehensiveStructuredData } from '../../lib/structuredData';
import { 
  BarChart3, 
  CheckCircle,
  Star,
  Package,
  AlertCircle,
  TrendingDown,
  Clock,
  DollarSign,
  Target,
  Zap,
  Shield,
  Smartphone
} from 'lucide-react';

export default function SmallShopStockControl() {
  // Use the page refresh hook
  usePageRefresh();
  
  const faqData = [
    {
      question: "What is stock control and why is it important for small shops?",
      answer: "Stock control is the process of managing inventory levels to ensure you have the right products available when customers need them. For small shops, effective stock control prevents stockouts that lose sales, reduces overstock that ties up cash, and helps maintain healthy profit margins."
    },
    {
      question: "How can small shops implement effective stock control without expensive systems?",
      answer: "StockFlow offers affordable stock control solutions specifically designed for small shops. Start with basic tracking features, set minimum stock levels, and use barcode scanning for accuracy. The system grows with your business without requiring large upfront investments."
    },
    {
      question: "What are the most common stock control mistakes small shops make?",
      {
        question: "What are the most common stock control mistakes small shops make?",
        answer: "Common mistakes include not setting minimum stock levels, failing to track fast-moving items, relying on manual counting, ignoring seasonal trends, and not analyzing which products are most profitable. Our system helps avoid these pitfalls."
      }
    },
    {
      question: "How often should small shops check their stock levels?",
      answer: "Daily monitoring is ideal for fast-moving items, while slower-moving inventory can be checked weekly. StockFlow provides real-time updates and alerts, so you always know your current stock levels without manual checking."
    },
    {
      question: "Can stock control help small shops compete with larger retailers?",
      answer: "Absolutely! Effective stock control helps small shops maintain better customer service by avoiding stockouts, reduces costs through optimized inventory levels, and provides insights to make smarter purchasing decisions. This levels the playing field with larger competitors."
    }
  ];

  // Generate structured data
  const structuredData = generateComprehensiveStructuredData('software', {
    title: "Small Shop Stock Control - Simple Inventory Management",
    url: "https://www.stockflow.be/small-shop-stock-control",
    description: "Simple stock control system for small shops. Prevent stockouts, reduce overstock, and boost profits with easy-to-use inventory management.",
    breadcrumbs: [
      { name: "Home", url: "https://www.stockflow.be/", position: 1 },
      { name: "Small Shop Stock Control", url: "https://www.stockflow.be/small-shop-stock-control", position: 2 }
    ],
    faqData: faqData,
    softwareData: {
      name: "StockFlow - Small Shop Stock Control",
      description: "Simple stock control system for small shops. Prevent stockouts, reduce overstock, and boost profits with easy-to-use inventory management.",
      category: "BusinessApplication",
      operatingSystem: "Web Browser",
      price: "0",
      currency: "EUR",
      rating: {
        value: "4.9",
        count: "150"
      },
      features: [
        "Simple stock tracking",
        "Low stock alerts",
        "Barcode scanning",
        "Sales reporting",
        "Supplier management",
        "Mobile access"
      ],
      image: "https://www.stockflow.be/Inventory-Management.png",
      url: "https://www.stockflow.be/small-shop-stock-control"
    }
  });

  const features = [
    {
      icon: Package,
      title: "Simple Stock Tracking",
      description: "Track your inventory with an intuitive interface designed for small shops. No complex setup required."
    },
    {
      icon: AlertCircle,
      title: "Smart Stock Alerts",
      description: "Get notified before you run out of popular items. Set custom alerts for different products and seasons."
    },
    {
      icon: Smartphone,
      title: "Mobile Stock Management",
      description: "Manage your stock from anywhere with our mobile app. Perfect for busy shop owners on the go."
    },
    {
      icon: BarChart3,
      title: "Sales Insights",
      description: "See which products sell best and when. Make smarter purchasing decisions with clear sales data."
    },
    {
      icon: Target,
      title: "Optimal Stock Levels",
      description: "Never overstock or understock again. Our system suggests optimal inventory levels based on your sales."
    },
    {
      icon: Zap,
      title: "Quick Setup",
      description: "Get started in minutes, not weeks. Import your existing inventory or start fresh with our guided setup."
    }
  ];

  const benefits = [
    "Prevent costly stockouts",
    "Reduce overstock by 30%",
    "Save 5+ hours per week",
    "Improve cash flow",
    "Increase customer satisfaction",
    "Make data-driven decisions",
    "Scale your business efficiently",
    "Compete with larger retailers"
  ];

  const stockControlMethods = [
    {
      title: "ABC Analysis",
      description: "Categorize your products by value and importance. Focus your attention on high-value items that drive most of your profits.",
      icon: "📊",
      benefit: "Focus on what matters most"
    },
    {
      title: "Minimum Stock Levels",
      description: "Set minimum stock levels for each product. Get alerts when inventory drops below your safety threshold.",
      icon: "⚠️",
      benefit: "Never run out of stock"
    },
    {
      title: "Regular Stock Takes",
      description: "Conduct regular inventory counts to ensure accuracy. Use barcode scanning for fast and error-free counting.",
      icon: "📱",
      benefit: "Maintain inventory accuracy"
    },
    {
      title: "Seasonal Planning",
      description: "Plan for seasonal demand changes. Stock up before busy periods and reduce orders during slow seasons.",
      icon: "📅",
      benefit: "Optimize for seasonal sales"
    }
  ];

  const testimonials = [
    {
      name: "David Thompson",
      role: "Owner, Corner Convenience Store",
      content: "StockFlow's stock control system saved our business during the busy holiday season. We never ran out of popular items and our profits increased by 40%.",
      rating: 5
    },
    {
      name: "Lisa Martinez",
      role: "Manager, Fashion Boutique",
      content: "The mobile app is perfect for our small shop. I can check stock levels and place orders while managing the store. It's made inventory management so much easier.",
      rating: 5
    },
    {
      name: "Robert Kim",
      role: "Owner, Electronics Store",
      content: "The sales insights helped us identify our best-performing products. We've reduced overstock by 35% and improved our cash flow significantly.",
      rating: 5
    }
  ];

  const implementationSteps = [
    {
      step: "1",
      title: "Import Your Inventory",
      description: "Quickly add your existing products or start with our templates"
    },
    {
      step: "2",
      title: "Set Stock Levels",
      description: "Define minimum and maximum stock levels for each product"
    },
    {
      step: "3",
      title: "Configure Alerts",
      description: "Set up notifications for low stock and reorder points"
    },
    {
      step: "4",
      title: "Start Tracking",
      description: "Begin using the system for daily stock management"
    }
  ];

  return (
    <SeoPageLayout title="Small Shop Stock Control">
      <SEO
        title="Small Shop Stock Control - Simple Inventory Management 2024 | StockFlow"
        description="Simple stock control system for small shops. Prevent stockouts, reduce overstock, boost profits. Free trial available!"
        keywords="small shop stock control, shop inventory management, small business stock control, retail stock management, shop stock tracking, small shop inventory system, stock control software, inventory management for small shops, shop stock control app, small retail inventory, stock management for shops, shop inventory tracking, small business inventory control, retail stock control system, shop stock management software"
        url="https://www.stockflow.be/small-shop-stock-control"
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
              Simple <span className="text-blue-400">Stock Control</span> for Small Shops
            </h1>
            <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-4xl mx-auto">
              Stop losing sales to stockouts and wasting money on overstock. Get simple, effective stock control that actually works for small shops.
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
            <p className="text-sm text-gray-200">Trusted by 300+ small shops for stock control</p>
          </div>
        </div>
      </section>

      {/* Stock Control Methods Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Proven <span className="text-blue-600">Stock Control Methods</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Learn the stock control methods that successful small shops use to stay profitable and competitive.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stockControlMethods.map((method, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="text-4xl mb-4">{method.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{method.title}</h3>
                <p className="text-gray-600 mb-4">{method.description}</p>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-green-800">Key Benefit:</p>
                  <p className="text-sm text-green-700">{method.benefit}</p>
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
              Everything You Need for <span className="text-blue-600">Effective Stock Control</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Simple yet powerful features designed specifically for small shop owners who need effective stock control.
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
              Why Small Shops Choose <span className="text-blue-600">Our Stock Control</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join hundreds of small shop owners who have transformed their business with effective stock control.
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
              Set up your stock control system quickly and start seeing results immediately.
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
              Success Stories from <span className="text-blue-600">Small Shop Owners</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how small shop owners have improved their stock control and grown their business.
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
            Start Controlling Your Stock Today
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Join hundreds of small shop owners who have improved their stock control and grown their business with StockFlow.
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
            <p className="text-lg text-gray-600">Everything you need to know about stock control for small shops</p>
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
            Simple stock control solutions for small shops. Prevent stockouts, reduce overstock, and grow your business.
          </p>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} StockFlow. All rights reserved.
              Stock control solutions for small shops.
            </p>
          </div>
        </div>
      </footer>

    </SeoPageLayout>
  );
}
