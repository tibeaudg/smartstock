import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateComprehensiveStructuredData } from '../../lib/structuredData';
import { 
  BarChart3, 
  CheckCircle,
  Star,
  ShoppingCart,
  Store,
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  Package,
  AlertTriangle,
  Smartphone
} from 'lucide-react';

export default function RetailInventoryManagement() {
  // Use the page refresh hook
  usePageRefresh();
  
  const faqData = [
    {
      question: "Why do small retail shops need inventory management software?",
      answer: "Small retail shops face unique challenges like limited storage space, seasonal demand fluctuations, and tight profit margins. Inventory management software helps prevent stockouts during peak seasons, reduces overstock costs, and provides real-time insights to make better purchasing decisions."
    },
    {
      question: "How can retail inventory management help with seasonal demand?",
      answer: "Retail inventory management software tracks historical sales data to predict seasonal demand patterns. It helps you prepare for busy periods by optimizing stock levels, identifying trending products, and ensuring you have enough inventory without overstocking."
    },
    {
      question: "What features are most important for small retail shops?",
      answer: "Key features include barcode scanning for quick updates, real-time stock tracking, low stock alerts, sales reporting, supplier management, and mobile access. These features help small shops compete with larger retailers while maintaining efficiency."
    },
    {
      question: "Can retail inventory management integrate with my POS system?",
      answer: "Yes, modern inventory management systems like StockFlow can integrate with most POS systems to automatically update stock levels when sales occur. This ensures your inventory is always accurate and reduces manual counting."
    },
    {
      question: "How much can small retail shops save with inventory management?",
      answer: "Small retail shops typically save 15-30% on inventory costs by reducing overstock, preventing stockouts, and optimizing purchasing. This translates to thousands of dollars in savings annually, making the ROI very attractive for small businesses."
    }
  ];

  // Generate structured data
  const structuredData = generateComprehensiveStructuredData('software', {
    title: "Retail Inventory Management Software for Small Shops",
    url: "https://www.stockflow.be/retail-inventory-management",
    description: "Complete retail inventory management solution for small shops. Track stock, prevent stockouts, and boost profits with real-time inventory control.",
    breadcrumbs: [
      { name: "Home", url: "https://www.stockflow.be/", position: 1 },
      { name: "Retail Inventory Management", url: "https://www.stockflow.be/retail-inventory-management", position: 2 }
    ],
    faqData: faqData,
    softwareData: {
      name: "StockFlow - Retail Inventory Management",
      description: "Complete retail inventory management solution for small shops. Track stock, prevent stockouts, and boost profits with real-time inventory control.",
      category: "BusinessApplication",
      operatingSystem: "Web Browser",
      price: "0",
      currency: "EUR",
      rating: {
        value: "4.8",
        count: "200"
      },
      features: [
        "Real-time stock tracking",
        "Barcode scanning",
        "Low stock alerts",
        "Sales analytics",
        "Supplier management",
        "Mobile access"
      ],
      image: "https://www.stockflow.be/Inventory-Management.png",
      url: "https://www.stockflow.be/retail-inventory-management"
    }
  });

  const features = [
    {
      icon: ShoppingCart,
      title: "Real-time Stock Tracking",
      description: "Monitor your inventory levels in real-time as customers make purchases. Never run out of popular items again."
    },
    {
      icon: Smartphone,
      title: "Mobile Barcode Scanning",
      description: "Scan barcodes with your smartphone to quickly update stock levels and check product information on the go."
    },
    {
      icon: AlertTriangle,
      title: "Low Stock Alerts",
      description: "Get instant notifications when inventory levels drop below your set thresholds. Stay ahead of stockouts."
    },
    {
      icon: BarChart3,
      title: "Sales Analytics",
      description: "Track your best-selling products, seasonal trends, and profit margins to make smarter purchasing decisions."
    },
    {
      icon: Users,
      title: "Supplier Management",
      description: "Keep track of your suppliers, order history, and delivery schedules to streamline your purchasing process."
    },
    {
      icon: Store,
      title: "Multi-location Support",
      description: "Manage inventory across multiple store locations or departments from a single dashboard."
    }
  ];

  const benefits = [
    "Reduce inventory costs by 25%",
    "Prevent stockouts during peak seasons",
    "Eliminate manual counting errors",
    "Improve cash flow management",
    "Increase customer satisfaction",
    "Save 10+ hours per week on inventory tasks",
    "Make data-driven purchasing decisions",
    "Scale your business efficiently"
  ];

  const retailChallenges = [
    {
      title: "Seasonal Demand Spikes",
      description: "Retail shops face unpredictable demand during holidays and seasons. Our system tracks patterns to help you prepare.",
      icon: "📈",
      solution: "Historical data analysis and demand forecasting"
    },
    {
      title: "Limited Storage Space",
      description: "Small shops have limited space for inventory. Optimize your stock levels with intelligent reorder points.",
      icon: "📦",
      solution: "Space-efficient inventory optimization"
    },
    {
      title: "Cash Flow Management",
      description: "Tight profit margins require careful inventory investment. Track ROI and optimize purchasing decisions.",
      icon: "💰",
      solution: "Financial tracking and cost optimization"
    },
    {
      title: "Competition with Big Retailers",
      description: "Compete with larger stores by having the right products in stock when customers need them.",
      icon: "🏪",
      solution: "Real-time visibility and quick restocking"
    }
  ];

  const testimonials = [
    {
      name: "Emma Johnson",
      role: "Owner, Boutique Fashion Store",
      content: "StockFlow transformed our seasonal inventory management. We no longer run out of popular items during peak shopping periods, and our profits increased by 35%.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Manager, Electronics Shop",
      content: "The barcode scanning feature saves us hours every week. We can now focus on customer service instead of manual inventory counting.",
      rating: 5
    },
    {
      name: "Sarah Williams",
      role: "Owner, Gift Shop",
      content: "The sales analytics helped us identify our best-selling products and optimize our purchasing. We've reduced overstock by 40%.",
      rating: 5
    }
  ];

  const implementationSteps = [
    {
      step: "1",
      title: "Set Up Your Products",
      description: "Add your products with barcodes and set optimal stock levels"
    },
    {
      step: "2",
      title: "Configure Alerts",
      description: "Set low stock alerts and reorder points for each product"
    },
    {
      step: "3",
      title: "Train Your Staff",
      description: "Train your team on barcode scanning and daily procedures"
    },
    {
      step: "4",
      title: "Monitor & Optimize",
      description: "Use analytics to continuously improve your inventory management"
    }
  ];

  return (
    <SeoPageLayout title="Retail Inventory Management">
      <SEO
        title="Retail Inventory Management Software for Small Shops 2024 | StockFlow"
        description="Complete retail inventory management solution for small shops. Track stock, prevent stockouts, boost profits. Free trial available!"
        keywords="retail inventory management, small retail shop software, retail stock management, shop inventory system, retail inventory tracking, small business inventory, retail POS integration, inventory management for retailers, retail stock control, shop management software, retail inventory software, small shop inventory, retail inventory solution, shop stock tracking, retail inventory app"
        url="https://www.stockflow.be/retail-inventory-management"
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
              Retail <span className="text-blue-400">Inventory Management</span> Made Simple
            </h1>
            <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-4xl mx-auto">
              Stop losing sales to stockouts. Manage your retail inventory like a pro with real-time tracking, smart alerts, and powerful analytics designed for small shops.
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
            <p className="text-sm text-gray-200">Trusted by 500+ retail shops for inventory management</p>
          </div>
        </div>
      </section>

      {/* Retail Challenges Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Common <span className="text-blue-600">Retail Challenges</span> We Solve
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Small retail shops face unique inventory challenges. Here's how we help you overcome them.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {retailChallenges.map((challenge, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="text-4xl mb-4">{challenge.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{challenge.title}</h3>
                <p className="text-gray-600 mb-4">{challenge.description}</p>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-blue-800">Our Solution:</p>
                  <p className="text-sm text-blue-700">{challenge.solution}</p>
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
              Everything You Need for <span className="text-blue-600">Retail Success</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Powerful features designed specifically for small retail shops and independent stores.
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
              Transform Your <span className="text-blue-600">Retail Business</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join hundreds of retail shops that have improved their operations with StockFlow.
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
              Set up your retail inventory management system in minutes, not weeks.
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
              Success Stories from <span className="text-blue-600">Retail Shop Owners</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how retail shops have transformed their inventory management with StockFlow.
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
            Ready to Transform Your Retail Inventory?
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Join hundreds of retail shops using StockFlow to manage their inventory more efficiently and profitably.
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
            <p className="text-lg text-gray-600">Everything you need to know about retail inventory management</p>
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
            The best retail inventory management software for small shops. Simple, powerful, and designed for success.
          </p>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} StockFlow. All rights reserved.
              Retail inventory management solutions for modern shops.
            </p>
          </div>
        </div>
      </footer>

    </SeoPageLayout>
  );
}
