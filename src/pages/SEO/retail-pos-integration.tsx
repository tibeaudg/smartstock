import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateComprehensiveStructuredData } from '../../lib/structuredData';
import { 
  BarChart3, 
  CheckCircle,
  Star,
  CreditCard,
  Smartphone,
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  Package,
  Zap,
  Shield
} from 'lucide-react';

export default function RetailPosIntegration() {
  // Use the page refresh hook
  usePageRefresh();
  
  const faqData = [
    {
      question: "What is POS integration and why is it important for retail shops?",
      answer: "POS integration connects your point-of-sale system with your inventory management software. When a sale is made at the register, your inventory is automatically updated in real-time. This eliminates manual stock updates, prevents overselling, and ensures accurate inventory levels at all times."
    },
    {
      question: "Which POS systems does StockFlow integrate with?",
      answer: "StockFlow integrates with most popular POS systems including Square, Shopify POS, Lightspeed, Vend, and many others. We also offer API integration for custom POS systems. Contact our support team to check compatibility with your specific POS system."
    },
    {
      question: "How does POS integration improve inventory accuracy?",
      answer: "POS integration automatically updates your inventory levels every time a sale is processed. This eliminates human error from manual updates and ensures your stock counts are always accurate. You'll never oversell products or have discrepancies between your POS and inventory system."
    },
    {
      question: "Can I still use StockFlow if I don't have a POS system?",
      answer: "Yes! StockFlow works perfectly as a standalone inventory management system. You can manually update stock levels or use barcode scanning. However, POS integration provides the most accurate and efficient inventory management experience."
    },
    {
      question: "How long does it take to set up POS integration?",
      answer: "Most POS integrations can be set up in under 30 minutes. Our support team guides you through the process and handles the technical setup. Once connected, your inventory will automatically sync with every sale."
    }
  ];

  // Generate structured data
  const structuredData = generateComprehensiveStructuredData('software', {
    title: "Retail POS Integration - Seamless Inventory Management",
    url: "https://www.stockflow.be/retail-pos-integration",
    description: "Connect your POS system with inventory management for real-time stock updates. Seamless integration for retail shops.",
    breadcrumbs: [
      { name: "Home", url: "https://www.stockflow.be/", position: 1 },
      { name: "Retail POS Integration", url: "https://www.stockflow.be/retail-pos-integration", position: 2 }
    ],
    faqData: faqData,
    softwareData: {
      name: "StockFlow - Retail POS Integration",
      description: "Connect your POS system with inventory management for real-time stock updates. Seamless integration for retail shops.",
      category: "BusinessApplication",
      operatingSystem: "Web Browser",
      price: "0",
      currency: "EUR",
      rating: {
        value: "4.9",
        count: "180"
      },
      features: [
        "Real-time POS sync",
        "Automatic stock updates",
        "Multi-POS support",
        "Sales analytics",
        "Inventory accuracy",
        "Easy setup"
      ],
      image: "https://www.stockflow.be/Inventory-Management.png",
      url: "https://www.stockflow.be/retail-pos-integration"
    }
  });

  const features = [
    {
      icon: CreditCard,
      title: "Real-time POS Sync",
      description: "Every sale automatically updates your inventory levels. No more manual counting or stock discrepancies."
    },
    {
      icon: Smartphone,
      title: "Mobile POS Integration",
      description: "Connect mobile POS systems and tablets for seamless inventory management on the go."
    },
    {
      icon: Zap,
      title: "Instant Stock Updates",
      description: "See inventory changes immediately as sales are processed. Perfect for busy retail environments."
    },
    {
      icon: BarChart3,
      title: "Unified Sales Analytics",
      description: "Combine POS sales data with inventory insights for comprehensive business reporting."
    },
    {
      icon: Shield,
      title: "Secure Integration",
      description: "Bank-level security ensures your sales data is protected during synchronization."
    },
    {
      icon: Clock,
      title: "24/7 Synchronization",
      description: "Continuous sync ensures your inventory is always up-to-date, even during peak hours."
    }
  ];

  const benefits = [
    "Eliminate manual stock updates",
    "Prevent overselling with real-time sync",
    "Reduce inventory discrepancies by 95%",
    "Save 8+ hours per week on manual tasks",
    "Improve customer satisfaction",
    "Get accurate sales and inventory reports",
    "Scale your business efficiently",
    "Focus on customer service, not paperwork"
  ];

  const posSystems = [
    {
      name: "Square",
      description: "Popular choice for small retail shops with easy setup and competitive rates.",
      icon: "💳",
      features: ["Contactless payments", "Inventory sync", "Analytics dashboard"]
    },
    {
      name: "Shopify POS",
      description: "Perfect for shops with online stores. Seamless integration between online and offline sales.",
      icon: "🛒",
      features: ["Omnichannel sales", "Real-time sync", "Customer management"]
    },
    {
      name: "Lightspeed",
      description: "Comprehensive retail solution with advanced inventory management features.",
      icon: "⚡",
      features: ["Advanced reporting", "Multi-location", "Staff management"]
    },
    {
      name: "Vend",
      description: "Cloud-based POS system designed for retail businesses of all sizes.",
      icon: "☁️",
      features: ["Cloud-based", "Multi-store", "Customer loyalty"]
    }
  ];

  const testimonials = [
    {
      name: "Jennifer Adams",
      role: "Owner, Fashion Boutique",
      content: "POS integration with StockFlow eliminated all our inventory discrepancies. Our staff can focus on customers instead of manual stock updates, and we've reduced errors by 90%.",
      rating: 5
    },
    {
      name: "Mark Rodriguez",
      role: "Manager, Electronics Store",
      content: "The real-time sync is incredible. When we sell something, the inventory updates instantly. No more overselling or disappointing customers with out-of-stock items.",
      rating: 5
    },
    {
      name: "Amanda Lee",
      role: "Owner, Gift Shop",
      content: "Setting up the POS integration was surprisingly easy. Within 20 minutes, our Square system was connected and our inventory was automatically updating with every sale.",
      rating: 5
    }
  ];

  const integrationSteps = [
    {
      step: "1",
      title: "Choose Your POS",
      description: "Select from supported POS systems or contact us for custom integration"
    },
    {
      step: "2",
      title: "Connect Systems",
      description: "Our team helps you securely connect your POS with StockFlow"
    },
    {
      step: "3",
      title: "Test Integration",
      description: "Verify that sales automatically update your inventory levels"
    },
    {
      step: "4",
      title: "Go Live",
      description: "Start enjoying real-time inventory management with every sale"
    }
  ];

  return (
    <SeoPageLayout title="Retail POS Integration">
      <SEO
        title="Retail POS Integration - Seamless Inventory Management 2024 | StockFlow"
        description="Connect your POS system with inventory management for real-time stock updates. Seamless integration for retail shops. Free trial!"
        keywords="retail POS integration, POS inventory management, POS stock management, retail POS software, POS integration, point of sale integration, retail inventory sync, POS stock tracking, retail POS system, inventory POS integration, retail checkout integration, POS inventory sync, retail sales integration, POS management software, retail POS solution"
        url="https://www.stockflow.be/retail-pos-integration"
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
              <span className="text-blue-400">POS Integration</span> Made Simple
            </h1>
            <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-4xl mx-auto">
              Connect your POS system with inventory management for real-time stock updates. Every sale automatically updates your inventory - no more manual counting!
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
            <p className="text-sm text-gray-200">Trusted by 400+ retail shops for POS integration</p>
          </div>
        </div>
      </section>

      {/* POS Systems Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Works with Popular <span className="text-blue-600">POS Systems</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Seamlessly integrate with the POS systems you already use and trust.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {posSystems.map((pos, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="text-4xl mb-4">{pos.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{pos.name}</h3>
                <p className="text-gray-600 mb-4">{pos.description}</p>
                <ul className="space-y-2 text-sm">
                  {pos.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center justify-center text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
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
              Powerful <span className="text-blue-600">Integration Features</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need for seamless POS and inventory management integration.
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
              Why Choose <span className="text-blue-600">POS Integration</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Transform your retail operations with seamless POS and inventory integration.
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
              Simple <span className="text-blue-600">Integration Process</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get your POS system connected with StockFlow in just a few simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {integrationSteps.map((step, index) => (
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
              See how retail shops have improved their operations with POS integration.
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
            Ready to Connect Your POS System?
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Join hundreds of retail shops using StockFlow for seamless POS integration and real-time inventory management.
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
            <p className="text-lg text-gray-600">Everything you need to know about POS integration</p>
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
            Seamless POS integration for retail shops. Real-time inventory updates with every sale.
          </p>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} StockFlow. All rights reserved.
              POS integration solutions for retail businesses.
            </p>
          </div>
        </div>
      </footer>

    </SeoPageLayout>
  );
}
